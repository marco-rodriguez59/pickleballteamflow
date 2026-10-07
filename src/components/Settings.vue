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

      <ion-card class="settings-card">
        <ion-card-content class="settings-card-content">
          <div class="rate-control">
            <div class="setting-copy">
              <div class="setting-label">
                Rate App
              </div>

              <div class="setting-help">
                Enjoying the app? Leave a review on the store.
              </div>
            </div>

            <ion-button
              fill="solid"
              class="rate-button"
              aria-label="Rate Pickleball Team Flow"
              @click="rateApp"
            >
              <ion-icon
                slot="start"
                :icon="starOutline"
              />
              Rate
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card class="settings-card">
        <ion-card-content class="settings-card-content">
          <div class="setting-row">
            <div class="setting-copy">
              <div class="setting-label">
                Share App
              </div>

              <div class="setting-help">
                Invite friends to try Pickleball Team Flow.
              </div>
            </div>

            <ion-icon
              :icon="shareOutline"
              aria-hidden="true"
              class="setting-row-icon"
            />
          </div>

          <ion-textarea
            v-model="shareMessage"
            :rows="4"
            class="share-textarea"
            aria-label="Customize your share message"
            placeholder="Write a message to share with friends..."
          />

          <ion-button
            expand="block"
            class="share-button"
            :disabled="shareInProgress"
            @click="shareApp"
          >
            <ion-icon
              slot="start"
              :icon="shareOutline"
            />
            Share Pickleball Team Flow
          </ion-button>
        </ion-card-content>
      </ion-card>
    </section>
  </div>
</template>

<script>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonToggle
} from '@ionic/vue';

import {
  gridOutline,
  listOutline,
  shareOutline,
  starOutline
} from 'ionicons/icons';

import { Share } from '@capacitor/share';
import { openRateApp } from '../services/rateApp.js';

import {
  setCourtView,
  setShowNumbers,
  settings
} from '../settingsStore.js';

const DEFAULT_SHARE_MESSAGE =
  'I\'ve been using Pickleball Team Flow to organize fair court assignments and rotations. ' +
  'Check it out at https://pickleballteamflow.app';

export default {
  name: 'Settings',

  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonToggle
  },

  setup() {
    return {
      gridOutline,
      listOutline,
      shareOutline,
      starOutline
    };
  },

  data() {
    return {
      shareMessage: DEFAULT_SHARE_MESSAGE,
      shareInProgress: false
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
  },

  methods: {
    rateApp() {
      openRateApp();
    },

    async shareApp() {
      this.shareInProgress = true;

      try {
        await Share.share({
          title: 'Pickleball Team Flow',
          text: this.shareMessage.trim() || DEFAULT_SHARE_MESSAGE,
          url: 'https://pickleballteamflow.app',
          dialogTitle: 'Share Pickleball Team Flow'
        });
      } catch {
        // User cancelled or share sheet unavailable — no action needed
      } finally {
        this.shareInProgress = false;
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
    2.5rem
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
  --background: #eef2ef;
  --border-radius: 0.75rem;

  width: 100%;
  min-height: 48px;
}

.view-segment ion-segment-button {
  --color: #495057;
  --color-checked: #ffffff;
  --indicator-color: #0e4b2e;

  min-width: 0;
  min-height: 48px;

  font-weight: 700;
}

.view-segment ion-icon {
  margin-right: 0.35rem;

  font-size: 18px;
}

.number-control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}

.number-control ion-toggle {
  --track-background-checked: #a8c735;
  --handle-background-checked: #0e4b2e;

  flex-shrink: 0;
}

.rate-control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}

.rate-button {
  --background: #198754;
  --background-activated: #146c43;
  --border-radius: 0.65rem;
  --color: #ffffff;

  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  height: 40px;
}

.share-textarea {
  --background: #f4f7f4;
  --border-radius: 0.6rem;
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
  --padding-top: 0.6rem;
  --padding-bottom: 0.6rem;
  --color: #1f2d23;

  font-size: 0.9rem;
  line-height: 1.45;
  width: 100%;
  margin-bottom: 0.9rem;
}

.share-button {
  --background: #0e4b2e;
  --background-activated: #083320;
  --border-radius: 0.75rem;
  --color: #ffffff;

  font-weight: 700;
  font-size: 0.95rem;
  margin: 0;
}
</style>
