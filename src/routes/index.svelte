<script>
  import DropArea from "../components/droparea.svelte";
  import NavBar from "../components/navbar.svelte";
</script>

<div class="flex flex-col justify-start h-full w-full bg-gray-100">
  <NavBar start="Image Upload Service" end="Task" />

  <div class="flex-grow flex">
    <DropArea />
  </div>
</div>
