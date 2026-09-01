<template>
  <div class="settings-page">
    <section class="settings-section mb-4">
      <div class="page-heading text-center mb-4">
        <div class="section-eyebrow">
          APP CONTROLS
        </div>

        <h1 class="page-title mb-2">
          Settings
        </h1>

        <p class="page-subtitle text-secondary mb-0">
          Customize how court assignments are displayed.
        </p>
      </div>

      <ion-card class="settings-card">
        <ion-card-content class="settings-card-content">
          <div class="setting-row">
            <div class="setting-copy">
              <div class="setting-label">
                Court View
              </div>

              <div class="setting-help">
                Choose between list and VS matchup layouts.
              </div>
            </div>

            <ion-icon
              :icon="gridOutline"
              aria-hidden="true"
              class="setting-row-icon"
            />
          </div>

          <ion-segment
            v-model="courtView"
            class="view-segment"
            aria-label="Court assignment view"
          >
            <ion-segment-button value="list">
              <ion-icon :icon="listOutline" />
              <ion-label>List</ion-label>
            </ion-segment-button>

            <ion-segment-button value="vs">
              <ion-icon :icon="gridOutline" />
              <ion-label>VS</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-card-content>
      </ion-card>

      <ion-card class="settings-card">
        <ion-card-content class="settings-card-content">
          <div class="number-control">
            <div class="setting-copy">
              <div class="setting-label">
                Player Numbers
              </div>

              <div class="setting-help">
                Show roster numbers next to player names.
              </div>
            </div>

            <ion-toggle
              v-model="showNumbers"
              aria-label="Show player numbers"
            />
          </div>
        </ion-card-content>
      </ion-card>
    </section>
  </div>
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToggle
} from '@ionic/vue';

import {
  gridOutline,
  listOutline
} from 'ionicons/icons';

import {
  setCourtView,
  setShowNumbers,
  settings
} from '../settingsStore.js';

export default {
  name: 'Settings',

  components: {
    IonCard,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonToggle
  },

  setup() {
    return {
      gridOutline,
      listOutline
    };
  },

  computed: {
    courtView: {
      get() {
        return settings.courtView;
      },

      set(value) {
        setCourtView(value);
      }
    },

    showNumbers: {
      get() {
        return settings.showNumbers;
      },

      set(value) {
        setShowNumbers(value);
      }
    }
  }
};
</script>

<style scoped>
.settings-page {
  width: 100%;
  min-width: 0;
}

.page-heading {
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}

.section-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  color: #198754;
}

.page-title {
  font-size: clamp(
    1.7rem,
    5vw,
    2.4rem
  );

  font-weight: 700;
  line-height: 1.15;
}

.page-subtitle {
  font-size: 1rem;
  line-height: 1.5;
}

.settings-card {
  margin: 0 0 1rem;
  border-radius: 1rem;

  background: #ffffff;

  box-shadow:
    0 3px 14px
    rgba(0, 0, 0, 0.08);
}

.settings-card-content {
  padding: 1.25rem;
}

.setting-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 0.8rem;
}

.setting-copy {
  min-width: 0;
}

.setting-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2d23;
}

.setting-help {
  margin-top: 0.3rem;

  font-size: 0.9rem;
  line-height: 1.35;
  color: #6c757d;
}

.setting-row-icon {
  font-size: 1.15rem;
  color: #198754;
}

.view-segment {
  --background: #f6faf7;
  --border-radius: 0.75rem;
}

.number-control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}
</style>
