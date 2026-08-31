<template>
  <div class="app-shell">
    <!-- Navigation Bar -->
    <nav
      class="navbar navbar-expand-sm app-navbar"
      aria-label="Main navigation"
    >
      <div class="container-fluid">
        <router-link
          to="/"
          class="navbar-brand app-brand"
          aria-label="Pickleball Team Flow home"
        >
          <img
          src="./assets/pickleball-team-flow-mark.png"
          alt=""
          class="brand-logo"
          aria-hidden="true"
          > 
          <span>Pickleball Team Flow</span>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Open navigation menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          id="navbarNav"
          class="collapse navbar-collapse"
        >
          <ul class="navbar-nav ms-auto app-nav-links">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
                active-class="active"
                exact-active-class="active"
              >
                Home
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                to="/about"
                class="nav-link"
                active-class="active"
              >
                About
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container app-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app-navbar {
  margin-bottom: 1.5rem;

  border: 1px solid #e9ecef;
  border-radius: 0.875rem;

  background: #fff;

  box-shadow: 0 2px 8px rgba(33, 37, 41, 0.06);
}

.app-navbar .container-fluid {
  min-height: 64px;
  padding-left: 1rem;
  padding-right: 1rem;
}

.app-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;

  margin-right: 1rem;

  color: #212529;

  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;

  text-decoration: none;
}

.app-brand:hover {
  color: #146c43;
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.app-nav-links {
  gap: 0.25rem;
}

.app-nav-links .nav-link {
  min-height: 44px;

  display: flex;
  align-items: center;

  padding: 0.55rem 0.85rem;

  border-radius: 0.65rem;

  color: #495057;

  font-weight: 600;
}

.app-nav-links .nav-link:hover {
  background: #f8f9fa;
  color: #146c43;
}

.app-nav-links .nav-link.active {
  background: #e9f7ef;
  color: #146c43;
}

.app-brand:focus-visible,
.app-nav-links .nav-link:focus-visible,
.navbar-toggler:focus-visible {
  outline: 3px solid rgba(25, 135, 84, 0.28);
  outline-offset: 2px;
}

.navbar-toggler {
  min-width: 44px;
  min-height: 44px;

  border-color: #ced4da;
  border-radius: 0.65rem;
}

.app-content {
  padding-bottom: calc(
    2rem + env(safe-area-inset-bottom)
  );
}

@media (max-width: 575.98px) {
  .app-navbar {
    margin-left: -4px;
    margin-right: -4px;
    margin-bottom: 1rem;
  }

  .app-navbar .container-fluid {
    min-height: 60px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .app-brand {
    max-width: calc(100% - 60px);
    margin-right: 0.5rem;

    font-size: 1rem;
  }

  .brand-logo {
  width: 34px;
  height: 34px;
  }

  .navbar-collapse {
    padding-top: 0.65rem;
    padding-bottom: 0.35rem;

    border-top: 1px solid #e9ecef;
    margin-top: 0.55rem;
  }

  .app-nav-links {
    gap: 0.35rem;
  }

  .app-nav-links .nav-link {
    min-height: 48px;
    padding-left: 0.85rem;
    padding-right: 0.85rem;
  }
}
</style>
