<script>
  export let start = "title";
  export let end = "title";
</script>

<div
  class="bg-gradient-to-tl from-blue-300 to-red-200 drop-shadow-md w-full flex items-center justify-between"
>
  <div
    class="flex justify-between items-center w-full text-black/0 backdrop-blur-3xl bg-gradient-to-tr from-green-900 to-red-900 mix-blend-difference bg-clip-text font-black p-4 text-2xl"
  >
    <p>
      {start}
    </p>

    <p>
      {end}
    </p>
  </div>
</div>
