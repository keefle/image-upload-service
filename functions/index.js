const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Busboy = require("busboy");

const cors = require("cors")({ origin: true });

const path = require("path")
const os = require("os")
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

admin.initializeApp({ storageBucket: "image-upload-service-c0068.appspot.com" })


const bucket = admin.storage().bucket()

// uploadImage handles the recpetion of image/images and then uploads them to
// firebase storage.
exports.uploadImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Hello logs!", { structuredData: true });

    if (request.method !== "POST") {
      // Return a "method not allowed" error
      return response.status(405).json({ error: `Failed: Only posting images is allowed but recieved (${request.method}) request` });
    }

    const busboy = new Busboy({ headers: request.headers });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = [];
    const fileWrites = [];

    // This code will process each file uploaded.
    busboy.on("file", (_fieldname, file, filename, _encoding, mimetype) => {

      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        // Return a "bad request" error
        return response.status(400).json({ error: `Failed: Only accepts image/jpeg or image/png but recieved (${mimetype}) mimetype` });
      }

      const filepath = path.join(tmpdir, filename);
      uploads.push({ filepath: filepath, mimetype: mimetype });

      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      fileWrites.push(promise);
    });

    const fileUploads = [];

    // Triggered once all uploaded files are processed by busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      await Promise.all(fileWrites);

      // Processing each uploaded image here (uploading to Firebase Bucket Storage)
      for (const file of uploads) {

        const promise = bucket.upload(file.filepath, {
          destination: `${uuidv4()}-${path.basename(file.filepath)}`,
          metadata: { contentType: file.mimetype },
        });

        fileUploads.push(promise);
      }

      await Promise.all(fileUploads);

      for (const file of uploads) {
        fs.unlinkSync(file.filepath);
      }

      response.status(200).send({ success: `Succeeded: Upload of ${uploads.length} images Completed` });
    });

    busboy.end(request.rawBody);
  });
});
