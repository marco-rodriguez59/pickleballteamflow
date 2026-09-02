<template>
  <ion-app>
    <div
      class="app-shell"
      :class="{
        'native-phone': useBottomNav
      }"
    >
      <!-- =====================================================
           TOP HEADER
           Web / PWA / tablets
      ====================================================== -->
      <ion-header
        v-if="!useBottomNav"
        class="app-header"
      >
        <ion-toolbar class="brand-toolbar">
          <router-link
            to="/"
            class="app-brand"
            aria-label="Pickleball Team Flow home"
          >
            <img
              src="./assets/pickleball-team-flow-mark.png"
              alt=""
              class="brand-logo"
              aria-hidden="true"
            >

            <span>
              Pickleball Team Flow
            </span>
          </router-link>

          <ion-buttons slot="end">
            <ion-button
              id="main-menu-trigger"
              aria-label="Open navigation menu"
            >
              <ion-icon
                :icon="menuOutline"
                slot="icon-only"
              />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- =====================================================
           PAGE CONTENT
      ====================================================== -->
      <ion-content
        class="app-content"
        :fullscreen="false"
      >
        <div class="page-container">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </ion-content>

      <!-- =====================================================
           BOTTOM NAV
           Native phone apps only
      ====================================================== -->
      <nav
        v-if="useBottomNav"
        class="main-tab-bar"
        aria-label="Main navigation"
      >
        <button
          type="button"
          class="tab-button"
          :class="{
            active: $route.path === '/'
          }"
          :aria-current="
            $route.path === '/'
              ? 'page'
              : undefined
          "
          @click="goTo('/')"
        >
          <ion-icon
            :icon="homeOutline"
            aria-hidden="true"
          />

          <span class="tab-label">
            Home
          </span>
        </button>

        <button
          type="button"
          class="tab-button"
          :class="{
            active:
              $route.path === '/about'
          }"
          :aria-current="
            $route.path === '/about'
              ? 'page'
              : undefined
          "
          @click="goTo('/about')"
        >
          <ion-icon
            :icon="informationCircleOutline"
            aria-hidden="true"
          />

          <span class="tab-label">
            About
          </span>
        </button>

        <button
          type="button"
          class="tab-button"
          :class="{
            active:
              $route.path === '/settings'
          }"
          :aria-current="
            $route.path === '/settings'
              ? 'page'
              : undefined
          "
          @click="goTo('/settings')"
        >
          <ion-icon
            :icon="settingsOutline"
            aria-hidden="true"
          />

          <span class="tab-label">
            Settings
          </span>
        </button>
      </nav>

      <!-- =====================================================
           TOP MENU
           Only rendered when top header is being used
      ====================================================== -->
      <ion-popover
        v-if="!useBottomNav"
        trigger="main-menu-trigger"
        trigger-action="click"
        dismiss-on-select
      >
        <ion-content>
          <ion-list lines="none">
            <router-link
              to="/"
              class="menu-link"
            >
              <ion-item
                button
                detail="false"
              >
                <ion-icon
                  :icon="homeOutline"
                  slot="start"
                />

                <ion-label>
                  Home
                </ion-label>
              </ion-item>
            </router-link>

            <router-link
              to="/about"
              class="menu-link"
            >
              <ion-item
                button
                detail="false"
              >
                <ion-icon
                  :icon="informationCircleOutline"
                  slot="start"
                />

                <ion-label>
                  About
                </ion-label>
              </ion-item>
            </router-link>

            <router-link
              to="/settings"
              class="menu-link"
            >
              <ion-item
                button
                detail="false"
              >
                <ion-icon
                  :icon="settingsOutline"
                  slot="start"
                />

                <ion-label>
                  Settings
                </ion-label>
              </ion-item>
            </router-link>
          </ion-list>
        </ion-content>
      </ion-popover>
    </div>
  </ion-app>
</template>

<script>
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonToolbar
} from '@ionic/vue';

import {
  homeOutline,
  informationCircleOutline,
  menuOutline,
  settingsOutline
} from 'ionicons/icons';

import {
  Capacitor
} from '@capacitor/core';

export default {
  name: 'App',

  components: {
    IonApp,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    IonToolbar
  },

  setup() {
    return {
      homeOutline,
      informationCircleOutline,
      menuOutline,
      settingsOutline
    };
  },

  data() {
    return {
      isNativeApp:
        Capacitor.isNativePlatform(),

      viewportWidth:
        window.innerWidth
    };
  },

  computed: {
    /**
     * Bottom navigation is intentionally limited
     * to native phone-sized apps.
     *
     * Native iPhone / Android phone:
     *   bottom navigation
     *
     * Native tablet / iPad:
     *   top header
     *
     * Browser / PWA:
     *   top header regardless of viewport size
     */
    useBottomNav() {
      return (
        this.isNativeApp &&
        this.viewportWidth < 768
      );
    }
  },

  mounted() {
    window.addEventListener(
      'resize',
      this.handleResize
    );
  },

  beforeUnmount() {
    window.removeEventListener(
      'resize',
      this.handleResize
    );
  },

  methods: {
    handleResize() {
      this.viewportWidth =
        window.innerWidth;
    },

    goTo(path) {
      if (
        this.$route.path !== path
      ) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style scoped>
.app-shell {
  height: 100%;
  background: #f5f5f5;
}

/* =========================================================
   TOP HEADER
========================================================= */

.app-header {
  box-shadow:
    0 2px 10px
    rgba(14, 75, 46, 0.18);
}

.brand-toolbar {
  --background: #0e4b2e;
  --color: #ffffff;
  --border-width: 0;
  --min-height: 68px;

  padding-left:
    env(safe-area-inset-left);

  padding-right:
    env(safe-area-inset-right);
}

.app-brand {
  display: inline-flex;
  align-items: center;

  gap: 0.65rem;

  margin-left: 1rem;

  color: #ffffff;
  text-decoration: none;

  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
}

.app-brand:hover,
.app-brand:focus {
  color: #ffffff;
}

.brand-logo {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  object-fit: contain;
}

.brand-toolbar ion-button {
  --color: #ffffff;
  --border-radius: 0.65rem;

  width: 48px;
  height: 48px;
}

.brand-toolbar
ion-button::part(native) {
  min-width: 48px;
  min-height: 48px;
}

.brand-toolbar ion-icon {
  font-size: 24px;
}

/* =========================================================
   PAGE CONTENT
========================================================= */

.app-content {
  --background: #f5f5f5;
}

.page-container {
  width: 100%;
  max-width: 1200px;

  min-height: 100%;

  margin: 0 auto;

  padding:
    1.5rem
    1.25rem
    calc(
      2rem +
      env(safe-area-inset-bottom)
    );
}

/*
 * Reserve space for the fixed bottom nav
 * only when this is a native phone.
 */
.app-shell.native-phone
.page-container {
  padding:
    calc(
      0.75rem +
      env(safe-area-inset-top)
    )
    1.25rem
    calc(
      85px +
      env(safe-area-inset-bottom)
    );
}

/* =========================================================
   BOTTOM NAV
   Native phones only
========================================================= */

.main-tab-bar {
  position: fixed;

  bottom: 0;
  left: 0;
  right: 0;

  z-index: 100;

  display: flex;

  min-height:
    calc(
      65px +
      env(safe-area-inset-bottom)
    );

  border-top:
    1px solid #dee2e6;

  background: #ffffff;

  box-shadow:
    0 -2px 8px
    rgba(0, 0, 0, 0.08);

  padding-bottom:
    env(safe-area-inset-bottom);
}

.tab-button {
  flex: 1;

  min-width: 0;
  min-height: 65px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2px;

  border: 0;
  background: transparent;

  color: #6c757d;

  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  cursor: pointer;

  -webkit-tap-highlight-color:
    transparent;
}

.tab-button ion-icon {
  font-size: 24px;
}

.tab-label {
  white-space: nowrap;
}

.tab-button.active {
  color: #0e4b2e;
}

.tab-button:not([disabled]):active {
  color: #0e4b2e;
}

.tab-button:focus-visible {
  outline:
    3px solid
    rgba(25, 135, 84, 0.32);

  outline-offset: -3px;
}

/* =========================================================
   POPOVER MENU
========================================================= */

ion-popover {
  --width: 220px;
}

ion-popover ion-content {
  --background: #ffffff;
}

ion-popover ion-item {
  --min-height: 52px;
  --color: #212529;
  --background: #ffffff;
}

ion-popover ion-item:hover {
  --background: #f5f7f6;
}

ion-popover
ion-item ion-icon {
  color: #0e4b2e;

  font-size: 22px;
}

.menu-link {
  display: block;

  color: inherit;
  text-decoration: none;
}

/* =========================================================
   SMALL WEB / PWA SCREENS
========================================================= */

@media (max-width: 575.98px) {
  .brand-toolbar {
    --min-height: 64px;
  }

  .app-brand {
    max-width:
      calc(100% - 68px);

    margin-left: 0.75rem;

    font-size: 1rem;
  }

  .brand-logo {
    width: 36px;
    height: 36px;
  }

  /*
   * This applies to browser/PWA phone views.
   * Native phones override it through
   * .app-shell.native-phone .page-container.
   */
  .page-container {
    padding:
      1rem
      0.75rem
      calc(
        1.5rem +
        env(safe-area-inset-bottom)
      );
  }

  .app-shell.native-phone
  .page-container {
    padding:
      calc(
        0.75rem +
        env(safe-area-inset-top)
      )
      0.75rem
      calc(
        85px +
        env(safe-area-inset-bottom)
      );
  }
}
</style>
