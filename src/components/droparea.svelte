<script>
  import axios from "axios";
  import endpoints from "$lib/endpoints.js"

  let fileList = [];
  let percentCompleted = -1;
  let serverResMsg = "";
  let serverResStat = "";
  let serverResStatMsg = "";

    async function uploadImages() {
        const formData = new FormData();
        for (const file of fileList) {
            formData.append('files[]', file);
          }


        const res = await axios.post(endpoints.uploadImages, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
      },
        onUploadProgress: (progressEvent) => {
        percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(percentCompleted)
      }

      });
        console.log(res)
        serverResMsg = res.data.success || res.data.error;
        serverResStatMsg = res.data.success ? "success" : "error";
        serverResStat = res.data.success ? true : false;
        setTimeout(() => { serverResMsg  = ""}, 3000)
        setTimeout(() => { serverResStatMsg = ""}, 3000)
        setTimeout(() => { serverResStat = ""}, 3000)

        fileList = [];
        percentCompleted = -1;
      }


    function handleDragOver(ev) {
        ev.preventDefault();
    }

    function handleDroppedImages(ev) {
        ev.preventDefault();
        if (ev.dataTransfer.items) {
           for (let i = 0; i < ev.dataTransfer.items.length; i++) {
             if (ev.dataTransfer.items[i].kind !== "file") {
                 continue;
             }

             let file = ev.dataTransfer.items[i].getAsFile();
             if (file.type !== "image/jpeg" && file.type !== "image/png") {
               continue;
             }

               fileList = [...fileList, file];
           }
        } else {
           for (let i = 0; i < ev.dataTransfer.files.length; i++) {
             let file = ev.dataTransfer.files[i];
             if (file.type !== "image/jpeg" && file.type !== "image/png") {
               continue;
             }

               fileList = [...fileList, file];
           }
        }
    }
</script>

<div
    on:drop={handleDroppedImages} on:dragover={handleDragOver}
    class="
           m-4
           flex-grow
           flex
           flex-col
           justify-center
           items-center
           border-4
           border-dashed
           border-gray-300
           transition-all delay-200 duration-200"
    >

    <div class="text-xl md:text-4xl mt-auto text-center font-black text-gray-600
      flex-none">Drop Your Images Here!</div>


    <div class:opacity-0={serverResMsg === ""} class="transition-all duration-100
      text-center py-4 lg:px-4 w-3/4">
  <div class="p-2 rounded-full bg-gray-300 items-center text-gray-600 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
    <span class:bg-red-300={serverResStat === "error" } class="flex rounded-full
      bg-green-400 uppercase px-2 py-1 text-xs font-bold mr-3"> {serverResStatMsg} </span>
    <span class="font-semibold mr-2 text-xs md:text-base text-left flex-auto">{ serverResMsg }</span>
  </div>
</div>

    <button class:animate-pulse={percentCompleted !== -1} class:opacity-0={fileList.length === 0} on:click={uploadImages}
  class="bg-gradient-to-tl my-auto from-blue-300 to-red-200 drop-shadow-md
  rounded flex items-center justify-between transition-all duration-100">
<div
  class="flex rounded justify-center items-center text-black/0 backdrop-blur-3xl bg-gradient-to-tr from-green-900 to-red-900 mix-blend-difference bg-clip-text font-black p-4 text-xl"
  >
  Upload { fileList.length } files
  </div>
  </button>


  <div class:opacity-0={percentCompleted === -1} class="w-9/12 my-auto pt-1 transition-all duration-100">
    <div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
      <div style="width: {percentCompleted}%;"
            class="transform animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
        </div>
    </div>
  </div>

</div>
