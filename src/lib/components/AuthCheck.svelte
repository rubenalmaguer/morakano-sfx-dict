<script lang="ts">
  import { currentUser } from "$lib/firebase";
  const validEmails = ['morakanostudio@gmail.com', 'almaguerlopez@gmail.com'];

  export let simple: boolean = false;
</script>

{#if $currentUser && validEmails.includes($currentUser.email)}

  <slot />

{:else if simple}
<!-- Just hide content  -->

{:else if $currentUser}
  <div class="flex-grow flex flex-col justify-center items-center gap-4">
    <p class="text-error">
      Unauthorized user. ({$currentUser.email})
    </p>
    <a class="btn btn-primary" href="/login">Go to login page</a>
  </div>

{:else}

  <div class="flex-grow flex flex-col justify-center items-center gap-4">
    <p class="text-error">
      You must be logged in to view this page.
    </p>
    <a class="btn btn-primary" href="/login">Go to login page</a>
  </div>

{/if}