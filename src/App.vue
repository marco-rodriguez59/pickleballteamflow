<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 app-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">🏓 Pickleball Team Flow</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" active-class="active">About</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style scoped>
.app-navbar {
  border-radius: 0.75rem;
}

.navbar-brand {
  font-weight: 600;
  white-space: nowrap;
}

.navbar-toggler {
  min-width: 44px;
  min-height: 44px;
}

@media (max-width: 575.98px) {
  .navbar-brand {
    font-size: 1rem;
  }

  .app-navbar {
    margin-left: -4px;
    margin-right: -4px;
  }
}
</style>
