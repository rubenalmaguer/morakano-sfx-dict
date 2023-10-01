<script lang="ts">
  import { auth } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import { currentUser } from "$lib/firebase";

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
  }

</script>

<div class="w-full flex-grow flex flex-col items-center justify-center">
   
    {#if $currentUser}

        <h2 class="card-title">Welcome, {$currentUser.displayName}</h2>
        <p class="text-center text-success">You are logged in</p>

        <button class="btn btn-warning" on:click={() => signOut(auth)}>Sign out</button>
    
    {:else}
    
    <button on:click={signInWithGoogle} class="btn btn-accent w-28">Log in</button>
    
    {/if}

</div>

