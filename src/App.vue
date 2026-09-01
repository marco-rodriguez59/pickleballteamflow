<template>
  <ion-app>
    <div class="app-shell" :class="{ mobile: isMobile }">
      <ion-header v-if="!isMobile" class="app-header">
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

            <span>Pickleball Team Flow</span>
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

      <nav v-if="isMobile" class="main-tab-bar">
        <button
          type="button"
          class="tab-button"
          :class="{ active: $route.path === '/' }"
          @click="$router.push('/')"
        >
          <ion-icon :icon="homeOutline" aria-hidden="true" />
          <span class="tab-label">Home</span>
        </button>

        <button
          type="button"
          class="tab-button"
          :class="{ active: $route.path === '/about' }"
          @click="$router.push('/about')"
        >
          <ion-icon :icon="informationCircleOutline" aria-hidden="true" />
          <span class="tab-label">About</span>
        </button>

        <button
          type="button"
          class="tab-button"
          :class="{ active: $route.path === '/settings' }"
          @click="$router.push('/settings')"
        >
          <ion-icon :icon="settingsOutline" aria-hidden="true" />
          <span class="tab-label">Settings</span>
        </button>
      </nav>

      <ion-popover
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
              <ion-item button detail="false">
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
              <ion-item button detail="false">
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
              <ion-item button detail="false">
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
  IonToolbar,
  isPlatform
} from '@ionic/vue';

import {
  homeOutline,
  informationCircleOutline,
  menuOutline,
  settingsOutline
} from 'ionicons/icons';

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

  data() {
    return {
      isMobile: isPlatform('ios') || isPlatform('android') || isPlatform('mobile')
    };
  },

  setup() {
    return {
      homeOutline,
      informationCircleOutline,
      menuOutline,
      settingsOutline
    };
  }
};
</script>

<style scoped>
.app-shell {
  height: 100%;
  background: #f5f5f5;
}

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

.app-shell.mobile .page-container {
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
   TAB BAR (MOBILE ONLY)
========================================================= */

.main-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  display: flex;

  height: 65px;

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

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2px;

  border: 0;
  background: transparent;

  color: #6c757d;

  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

.tab-button ion-icon {
  font-size: 24px;
}

.tab-button.active {
  color: #0e4b2e;
}

.tab-button:not([disabled]):active {
  color: #0e4b2e;
}

.tab-button[disabled] {
  opacity: 0.4;
  cursor: default;
}

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

ion-popover ion-item ion-icon {
  color: #0e4b2e;

  font-size: 22px;
}

.menu-link {
  display: block;

  color: inherit;
  text-decoration: none;
}

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

  .page-container {
    padding:
      1rem
      0.75rem
      calc(
        1.5rem +
        env(safe-area-inset-bottom)
      );
  }
}
</style>
