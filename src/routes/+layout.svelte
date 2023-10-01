<script lang="ts">
    import '../app.css';
</script>

<!-- Why is %sveltekit.body% not a direct child of <body>? -->
<!-- https://github.com/sveltejs/kit/discussions/7585 -->
<!-- Comments in app.html make it to production, so this stays here. -->

<div class="min-h-full bg-pink-50 flex flex-col">
    <header class="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-70 text-base-content shadow-sm backdrop-blur transition-all duration-100">
        <nav class="navbar flex justify-center">
            <div class="navbar-start"></div>


            <div class="navbar-center">
                <div class="join">
                    <div>
                        <div>
                        <input class="input input-bordered join-item" placeholder="Search"/>
                        </div>
                    </div>
<!--                     <select class="select select-bordered join-item">
                        <option disabled selected>Filter</option>
                        <option>Sci-fi</option>
                        <option>Drama</option>
                        <option>Action</option>
                    </select> -->
                    <div class="indicator">
                        <button class="btn join-item">Search</button>
                    </div>
                </div>
            </div>


            <div class="navbar-end">
<!--                 <a href="/new" class="btn btn-circle">
                    +
                </a> -->
            </div>
        </nav>
    
    </header>
    
    <main class="flex-grow flex flex-col">
        <div class="flex-grow flex flex-col"><slot /></div>
        <footer class="flex justify-center items-center bg-base-100 bg-opacity-70 min-h-16">
            <h2>I'm a footer</h2>
        </footer>
    </main>  
</div>
      



