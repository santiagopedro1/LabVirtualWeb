<svelte:head>
  <title>Início - Labvirtual</title>
</svelte:head>

<section class="dark:text-white flex flex-col gap-4">
  <h2 class="text-xl">Welcome to SvelteKit</h2>
  <p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
  </p>
  <button class="px-4 py-3 bg-primary rounded-lg w-fit">
    <a href={`/dados?data=${new Date().toLocaleDateString('pt-BR')}`}> HOJE </a>
  </button>
</section>
