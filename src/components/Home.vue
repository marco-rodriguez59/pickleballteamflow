<template>
  <div class="home-page">
    <!-- =========================================================
         GAME SETUP
    ========================================================== -->
    <section class="setup-section mb-4">
      <div class="page-heading text-center mb-4">
        <div class="app-eyebrow">
          PICKLEBALL TEAM FLOW
        </div>

        <h1 class="page-title mb-2">
          Pickleball Court Assignments
        </h1>

        <p class="page-subtitle text-secondary mb-0">
          Set up your players, courts, and rounds.
        </p>
      </div>

      <ion-card class="setup-card">
        <ion-card-content class="setup-card-content">
          <div class="setup-heading">
            <div
              class="setup-icon"
              aria-hidden="true"
            >
              <ion-icon :icon="peopleOutline" />
            </div>

            <div class="setup-heading-text">
              <h2 class="h5 mb-0">
                Game Setup
              </h2>

              <div class="small text-secondary">
                Everything you need to create your court
                assignments.
              </div>
            </div>
          </div>

          <div class="roster-section">
            <div class="roster-heading">
              <div class="roster-heading-copy">
                <div class="setting-label roster-label">
                  Player Roster
                </div>

                <div class="roster-instruction">
                  Tap the box below and enter one player per line.
                </div>
              </div>

            <div class="roster-heading-actions">
              <div
                class="player-count"
                :class="{
                  'player-count-ready':
                    players.length >= 8 &&
                    players.length <= 24
                }"
                aria-live="polite"
              >
                {{ players.length }}
                player{{ players.length === 1 ? '' : 's' }}
              </div>
            
              <ion-button
                v-if="players.length"
                fill="clear"
                size="small"
                color="medium"
                class="clear-roster-button"
                aria-label="Clear player roster"
                @click="clearRoster()"
              >
                <ion-icon
                  :icon="trashOutline"
                  slot="start"
                />
            
                Clear Roster
              </ion-button>
            </div>
            </div>

            <ion-textarea
              ref="rosterTextarea"
              v-model="namesText"
              class="roster-textarea"
              fill="outline"
              :rows="6"
              :auto-grow="true"
              placeholder="Tap here to enter player names...&#10;John&#10;Sara"
              aria-label="Player roster"
              helper-text="8–24 players are supported."
              @ionInput="handleRosterInput"
            />

            <input
              type="file"
              ref="imageInput"
              @change="handleImageUpload"
              accept="image/*"
              capture="environment"
              style="display: none;"
            />

            <ion-button
              expand="block"
              fill="outline"
              class="scan-button"
              @click="$refs.imageInput.click()"
              :disabled="isProcessing"
            >
              <ion-icon
                :icon="cameraOutline"
                slot="start"
              />

              {{
                isProcessing
                  ? 'Processing Photo...'
                  : 'Scan Names from Photo'
              }}
            </ion-button>

            <div
              v-if="ocrProgress"
              class="small text-secondary mt-2"
              role="status"
              aria-live="polite"
            >
              {{ ocrProgress }}
            </div>
          </div>

          <div class="settings-grid">
            <div class="setting-card">
              <ion-select
                v-model="courtCount"
                class="setting-select"
                label="Courts"
                label-placement="stacked"
                fill="outline"
                interface="popover"
                aria-label="Number of Courts"
              >
                <ion-select-option
                  v-for="n in 11"
                  :key="n + 1"
                  :value="n + 1"
                >
                  {{ n + 1 }}
                </ion-select-option>
              </ion-select>

              <div class="small text-secondary setting-helper">
                {{ courtCount * 4 }} playing spots
              </div>
            </div>

            <div class="setting-card">
              <ion-select
                v-model="roundCount"
                class="setting-select"
                label="Rounds"
                label-placement="stacked"
                fill="outline"
                interface="popover"
                aria-label="Number of Rounds"
              >
                <ion-select-option
                  v-for="n in 12"
                  :key="n"
                  :value="n"
                >
                  {{ n }}
                </ion-select-option>
              </ion-select>

              <div class="small text-secondary setting-helper">
                Planned games
              </div>
            </div>
          </div>

          <div
            class="game-summary"
            aria-label="Game setup summary"
          >
            <div>
              <strong>{{ players.length }}</strong>
              <span>Players</span>
            </div>

            <div>
              <strong>{{ courtCount }}</strong>
              <span>Courts</span>
            </div>

            <div>
              <strong>{{ roundCount }}</strong>
              <span>Rounds</span>
            </div>

            <div>
              <strong>
                {{ Math.max(players.length - (courtCount * 4), 0) }}
              </strong>
              <span>Sitting Out</span>
            </div>
          </div>

          <ion-button
            expand="block"
            class="generate-button"
            @click="generate()"
          >
            <ion-icon
              :icon="playOutline"
              slot="start"
            />

            Generate Court Assignments
          </ion-button>

          <div
            v-if="schedule.length"
            class="secondary-actions"
          >
            <ion-button
              expand="block"
              fill="outline"
              color="medium"
              class="secondary-action"
              @click="clearAll()"
            >
              <ion-icon
                :icon="trashOutline"
                slot="start"
              />

              Clear Assignments
            </ion-button>

            <ion-button
              v-if="hasOpenRounds"
              expand="block"
              fill="outline"
              class="secondary-action"
              @click="regenerateRemaining()"
            >
              <ion-icon
                :icon="refreshOutline"
                slot="start"
              />

              Regenerate Open Rounds
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </section>

    <!-- =========================================================
         COURT ASSIGNMENTS
    ========================================================== -->
    <section class="assignments-section">
      <div class="assignments-heading">
        <div>
          <div class="section-eyebrow">
            YOUR GAME
          </div>

          <div class="assignment-title-row">
            <h2 class="assignments-title">
              Court Assignments
            </h2>

            <span
              v-if="schedule.length"
              class="round-count-text"
            >
              {{ schedule.length }}
              round{{ schedule.length === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ion-card
        v-if="!schedule.length"
        class="empty-assignments"
      >
        <ion-card-content class="empty-content">
          <div
            class="empty-icon"
            aria-hidden="true"
          >
            <ion-icon :icon="peopleOutline" />
          </div>

          <h3>
            Ready when you are
          </h3>

          <p>
            Enter at least <strong>8 players</strong>,
            choose your courts and rounds, then select
            <strong>Generate Court Assignments</strong>.
          </p>
        </ion-card-content>
      </ion-card>

      <!-- Rounds -->
      <div
        v-if="schedule.length"
        class="rounds-list"
      >
        <ion-card
          v-for="round in sortedSchedule"
          :key="round.index"
          class="round-card"
          :class="{
            'round-card-completed': round.closed
          }"
        >
          <div class="round-card-header">
            <div class="round-heading">
              <div class="round-label">
                ROUND
              </div>

              <h3 class="round-title">
                Round {{ round.index }}
              </h3>
            </div>

            <div class="round-actions">
              <span
                class="round-status"
                :class="
                  round.closed
                    ? 'round-status-closed'
                    : 'round-status-open'
                "
              >
                {{
                  round.closed
                    ? 'Completed'
                    : 'Open'
                }}
              </span>

              <ion-button
                size="small"
                fill="outline"
                :color="
                  round.closed
                    ? 'medium'
                    : 'success'
                "
                class="round-action-button"
                :aria-label="
                  round.closed
                    ? 'Reopen round ' + round.index
                    : 'Close round ' + round.index
                "
                @click="toggleRoundClosed(round)"
              >
                <ion-icon
                  :icon="
                    round.closed
                      ? refreshOutline
                      : checkmarkCircleOutline
                  "
                  slot="start"
                />

                {{
                  round.closed
                    ? 'Reopen'
                    : 'Close Round'
                }}
              </ion-button>
            </div>
          </div>

          <div
            v-show="!round.closed"
            class="round-content"
          >
            <!-- Sit Out -->
            <div
              v-if="round.sitOut.length"
              class="sit-out-card"
            >
              <div class="sit-out-heading">
                <div>
                  <div class="sit-out-label">
                    THIS ROUND
                  </div>

                  <h4 class="sit-out-title">
                    Sit Out
                  </h4>
                </div>

                <span
                  class="sit-out-count"
                  :aria-label="
                    round.sitOut.length +
                    ' players sitting out'
                  "
                >
                  {{ round.sitOut.length }}
                </span>
              </div>

              <div class="sit-out-players">
                <span
                  v-for="player in round.sitOut"
                  :key="player.id"
                  class="sit-out-player"
                >
                  <span
                    v-if="showNumbers"
                    class="sit-out-player-number"
                    :aria-label="'Player number ' + player.id"
                  >
                    #{{ player.id }}
                  </span>

                  <span class="sit-out-player-name">
                    {{ player.name }}
                  </span>
                </span>
              </div>

              <div
                v-if="!round.closed"
                class="sit-out-help"
              >
                <ion-icon
                  :icon="informationCircleOutline"
                  aria-hidden="true"
                />

                <span>
                  Need to make a change? Tap any court
                  player to swap them with someone sitting
                  out.
                </span>
              </div>
            </div>

            <div class="courts-grid">
              <div
                v-for="court in round.courts"
                :key="court.courtNumber"
                class="court-card"
              >
                <div class="court-card-header">
                  <div
                    class="court-heading-icon"
                    aria-hidden="true"
                  >
                    <ion-icon :icon="peopleOutline" />
                  </div>

                  <h4 class="court-title">
                    Court {{ court.courtNumber }}
                  </h4>
                </div>

                <!-- LIST VIEW -->
                <div
                  v-if="courtView === 'list'"
                  class="court-players"
                >
                  <button
                    v-for="player in court.players"
                    :key="player.id"
                    type="button"
                    class="player-row"
                    :class="{
                      'player-row-substitutable':
                        !round.closed &&
                        round.sitOut.length > 0
                    }"
                    :disabled="
                      round.closed ||
                      round.sitOut.length === 0
                    "
                    :aria-label="
                      !round.closed &&
                      round.sitOut.length > 0
                        ? 'Substitute ' + player.name
                        : player.name
                    "
                    @click="
                      !round.closed &&
                      round.sitOut.length > 0 &&
                      openSubModal(
                        round,
                        court,
                        player
                      )
                    "
                  >
                    <span class="player-name">
                      <span
                        v-if="showNumbers"
                        class="player-number"
                      >
                        #{{ player.id }}
                      </span>

                      <span class="player-name-text">
                        {{ player.name }}
                      </span>
                    </span>

                    <ion-icon
                      v-if="
                        !round.closed &&
                        round.sitOut.length > 0
                      "
                      :icon="swapVerticalOutline"
                      class="swap-indicator"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <!-- VS VIEW -->
                <div
                  v-else
                  class="vs-matchup"
                >
                  <div class="vs-team">
                    <div class="vs-team-label">
                      Team 1
                    </div>

                    <button
                      v-for="player in court.players.slice(0, 2)"
                      :key="player.id"
                      type="button"
                      class="vs-player"
                      :disabled="
                        round.closed ||
                        round.sitOut.length === 0
                      "
                      :aria-label="
                        !round.closed &&
                        round.sitOut.length > 0
                          ? 'Substitute ' + player.name
                          : player.name
                      "
                      @click="
                        !round.closed &&
                        round.sitOut.length > 0 &&
                        openSubModal(
                          round,
                          court,
                          player
                        )
                      "
                    >
                      <span
                        v-if="showNumbers"
                        class="player-number"
                      >
                        #{{ player.id }}
                      </span>

                      <span class="vs-player-name">
                        {{ player.name }}
                      </span>
                    </button>
                  </div>

                  <div
                    class="vs-divider"
                    aria-hidden="true"
                  >
                    VS
                  </div>

                  <div class="vs-team">
                    <div class="vs-team-label">
                      Team 2
                    </div>

                    <button
                      v-for="player in court.players.slice(2, 4)"
                      :key="player.id"
                      type="button"
                      class="vs-player"
                      :disabled="
                        round.closed ||
                        round.sitOut.length === 0
                      "
                      :aria-label="
                        !round.closed &&
                        round.sitOut.length > 0
                          ? 'Substitute ' + player.name
                          : player.name
                      "
                      @click="
                        !round.closed &&
                        round.sitOut.length > 0 &&
                        openSubModal(
                          round,
                          court,
                          player
                        )
                      "
                    >
                      <span
                        v-if="showNumbers"
                        class="player-number"
                      >
                        #{{ player.id }}
                      </span>

                      <span class="vs-player-name">
                        {{ player.name }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Idle Court Notice -->
            <div
              v-if="round.courts.length < courtCount"
              class="idle-courts"
            >
              <ion-icon
                :icon="informationCircleOutline"
                aria-hidden="true"
              />

              <span>
                {{ courtCount - round.courts.length }}
                court{{
                  courtCount - round.courts.length === 1
                    ? ''
                    : 's'
                }}
                idle this round.
              </span>
            </div>
          </div>

          <div
            v-if="round.closed"
            class="closed-round-summary"
          >
            <ion-icon
              :icon="checkmarkCircleOutline"
              aria-hidden="true"
            />

            <span>
              Round {{ round.index }} is complete.
              Reopen it to view or make changes.
            </span>
          </div>
        </ion-card>
      </div>
    </section>

    <!-- =========================================================
         SUBSTITUTION MODAL
    ========================================================== -->
    <ion-modal
      :is-open="subModal.show"
      class="substitution-modal"
      :backdrop-dismiss="true"
      @didDismiss="closeSubModal"
    >
      <ion-content class="substitution-content">
        <div class="sub-modal-shell">
          <div class="sub-modal-header">
            <div class="sub-modal-heading-copy">
              <div class="sub-modal-eyebrow">
                PLAYER SUBSTITUTION
              </div>

              <h2 class="sub-modal-title">
                Swap Player
              </h2>
            </div>

            <ion-button
              fill="clear"
              color="medium"
              class="sub-modal-close"
              aria-label="Close substitution window"
              @click="closeSubModal"
            >
              <ion-icon
                :icon="closeOutline"
                slot="icon-only"
              />
            </ion-button>
          </div>

          <div class="sub-current-player">
            <div class="small text-secondary mb-1">
              Replace
            </div>

            <div class="sub-current-player-name">
              {{ subModal.player?.name }}
            </div>

            <div class="small text-secondary mt-1">
              Court {{ subModal.court?.courtNumber }} ·
              Round {{ subModal.round?.index }}
            </div>
          </div>

          <div class="sub-instruction">
            Choose a player who is currently sitting out:
          </div>

          <div class="sub-player-list">
            <button
              v-for="p in subModal.round?.sitOut || []"
              :key="p.id"
              type="button"
              class="sub-player-option"
              :aria-label="
                'Swap ' +
                subModal.player?.name +
                ' with ' +
                p.name
              "
              @click="confirmSubstitution(p)"
            >
              <span class="sub-player-option-name">
                <span
                  v-if="showNumbers"
                  class="player-number"
                >
                  {{ p.id }}
                </span>

                <span class="sub-player-option-name-text">
                  {{ p.name }}
                </span>
              </span>

              <span class="sub-player-action">
                Swap

                <ion-icon
                  :icon="arrowForwardOutline"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>

          <div class="sub-modal-note">
            <ion-icon
              :icon="informationCircleOutline"
              aria-hidden="true"
            />

            <span>
              {{ subModal.player?.name }}
              will move to Sit Out for this round.
            </span>
          </div>

          <ion-button
            expand="block"
            fill="outline"
            color="medium"
            class="sub-cancel-button"
            @click="closeSubModal"
          >
            Cancel
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- =========================================================
         SETTINGS MODAL (MOBILE ONLY)
    ========================================================== -->
    <ion-modal
      v-if="isMobile"
      :is-open="settingsModal.show"
      class="settings-modal"
      :backdrop-dismiss="true"
      @didDismiss="closeSettingsModal"
    >
      <div class="settings-content">
        <div class="settings-modal-shell">
          <div class="settings-modal-header">
            <div class="settings-modal-heading-copy">
              <div class="settings-modal-eyebrow">
                APP CONTROLS
              </div>

              <h2 class="settings-modal-title">
                Settings
              </h2>

              <p class="settings-modal-subtitle">
                Customize how court assignments are displayed.
              </p>
            </div>

            <ion-button
              fill="clear"
              color="medium"
              class="settings-modal-close"
              aria-label="Close settings"
              @click="closeSettingsModal"
            >
              <ion-icon
                :icon="closeOutline"
                slot="icon-only"
              />
            </ion-button>
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

          <ion-button
            expand="block"
            class="settings-done-button"
            @click="closeSettingsModal"
          >
            Done
          </ion-button>
        </div>
      </div>
    </ion-modal>

    <!-- =========================================================
         TOAST
    ========================================================== -->
    <ion-toast
      :is-open="toast.show"
      :message="toast.message"
      :color="toast.color"
      :duration="toast.duration"
      position="bottom"
      @didDismiss="toast.show = false"
    />

  </div>
</template>

<script>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast,
  IonToggle,
  isPlatform
} from '@ionic/vue';

import {
  arrowForwardOutline,
  cameraOutline,
  checkmarkCircleOutline,
  closeOutline,
  gridOutline,
  homeOutline,
  informationCircleOutline,
  listOutline,
  peopleOutline,
  playOutline,
  refreshOutline,
  settingsOutline,
  swapVerticalOutline,
  trashOutline
} from 'ionicons/icons';

import {
  buildRound,
  keyPair,
  keyMatchup
} from '../utils.js';

import {
  setCourtView,
  setShowNumbers,
  settings
} from '../settingsStore.js';

import { createWorker } from 'tesseract.js';

export default {
  name: 'Home',

  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonLabel,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToast,
    IonToggle
  },

  setup() {
    return {
      arrowForwardOutline,
      cameraOutline,
      checkmarkCircleOutline,
      closeOutline,
      gridOutline,
      homeOutline,
      informationCircleOutline,
      listOutline,
      peopleOutline,
      playOutline,
      refreshOutline,
      settingsOutline,
      swapVerticalOutline,
      trashOutline
    };
  },

  data() {
    return {
      isMobile: isPlatform('ios') || isPlatform('android') || isPlatform('mobile'),
      namesText: '',
      courtCount: 2,
      roundCount: 7,
      schedule: [],
      isProcessing: false,
      ocrProgress: '',

      subModal: {
        show: false,
        round: null,
        court: null,
        player: null
      },

      settingsModal: {
        show: false
      },

      toast: {
        show: false,
        message: '',
        color: 'danger',
        duration: 4000
      }
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
    },

    players() {
      return this.namesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .map((name, i) => ({
          id: i + 1,
          name,
          sitOuts: 0,
          lastSatRound:
            Number.NEGATIVE_INFINITY
        }));
    },

    hasOpenRounds() {
      return this.schedule.some(
        round => !round.closed
      );
    },

    sortedSchedule() {
      const open = this.schedule.filter(r => !r.closed).sort((a, b) => a.index - b.index);
      const closed = this.schedule.filter(r => r.closed).sort((a, b) => a.index - b.index);
      return [...open, ...closed];
    }
  },

  methods: {
    showMessage(
      text,
      type = 'alert alert-danger'
    ) {
      let color = 'danger';

      if (type.includes('success')) {
        color = 'success';
      } else if (type.includes('warning')) {
        color = 'warning';
      } else if (type.includes('info')) {
        color = 'primary';
      }

      this.toast.message = text;
      this.toast.color = color;
      this.toast.duration = 4000;
      this.toast.show = true;
    },

    openSettingsModal() {
      this.settingsModal.show = true;
    },

    closeSettingsModal() {
      this.settingsModal.show = false;
    },

    scrollToTop() {
      const content = document.querySelector('.app-content');

      if (content && typeof content.scrollToTop === 'function') {
        content.scrollToTop(300);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    async handleRosterInput() {
  if (!this.isMobile) {
    return;
  }

  await this.$nextTick();

  window.setTimeout(async () => {
    const textarea =
      this.$refs.rosterTextarea?.$el ||
      this.$refs.rosterTextarea;

    const content =
      document.querySelector('.app-content');

    if (
      !textarea ||
      !content ||
      typeof content.getScrollElement !== 'function'
    ) {
      return;
    }

    const scrollElement =
      await content.getScrollElement();

    const rect =
      textarea.getBoundingClientRect();

    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight;

    // Leave room above the fixed mobile navigation
    // and a little breathing room below the cursor.
    const visibleBottom =
      viewportHeight - 100;

    if (rect.bottom > visibleBottom) {
      const scrollAmount =
        rect.bottom - visibleBottom;

      scrollElement.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, 75);
},

    async handleImageUpload(event) {
      const file = event.target.files[0];

      if (!file) return;

      this.isProcessing = true;
      this.ocrProgress =
        'Initializing OCR...';

      try {
        const worker =
          await createWorker('eng');

        this.ocrProgress =
          'Processing image...';

        const {
          data: { text }
        } = await worker.recognize(file);

        await worker.terminate();

        const extractedNames = text
          .split('\n')
          .map(line => line.trim())
          .filter(
            line =>
              line.length > 0 &&
              line.length < 50
          )
          .join('\n');

        if (extractedNames) {
          if (this.namesText.trim()) {
            this.namesText +=
              '\n' + extractedNames;
          } else {
            this.namesText =
              extractedNames;
          }

          this.showMessage(
            `Successfully extracted ${
              extractedNames.split('\n').length
            } names from image!`,
            'alert alert-success'
          );
        } else {
          this.showMessage(
            'No text found in image. Please try a clearer photo.',
            'alert alert-warning'
          );
        }
      } catch (error) {
        console.error(
          'OCR Error:',
          error
        );

        this.showMessage(
          'Unable to read names from that image. Please try another photo or enter the player names manually.',
          'alert alert-danger'
        );
      } finally {
        this.isProcessing = false;
        this.ocrProgress = '';
        event.target.value = '';
      }
    },

    generate() {
      if (
        !this.players ||
        this.players.length < 8 ||
        this.players.length > 24
      ) {
        this.showMessage(
          'Please enter between 8 and 24 player names.'
        );

        return;
      }

      if (
        !this.courtCount ||
        this.courtCount < 1
      ) {
        this.showMessage(
          'Please select a valid number of courts.'
        );

        return;
      }

      if (
        !this.roundCount ||
        this.roundCount < 1
      ) {
        this.showMessage(
          'Please select a valid number of rounds.'
        );

        return;
      }

      const people =
        this.namesText
          .split('\n')
          .map(name => name.trim())
          .filter(
            name =>
              name.length > 0
          );

      if (people.length === 0) {
        this.showMessage(
          'Please enter valid names.'
        );

        return;
      }

      const uniquePeople =
        [...new Set(people)];

      if (
        uniquePeople.length !==
        people.length
      ) {
        this.showMessage(
          'Warning: Duplicate names detected. Using unique names only.',
          'alert alert-warning'
        );
      }

      const roster =
        this.players.map(p => ({
          ...p
        }));

      const partnerCount =
        new Map();

      const opponentCount =
        new Map();

      const individualOpponentCount =
        new Map();

      const rounds = [];

      for (
        let r = 1;
        r <= this.roundCount;
        r++
      ) {
        const round =
          buildRound(
            roster,
            r,
            this.courtCount,
            partnerCount,
            opponentCount,
            individualOpponentCount
          );

        round.sitOut.forEach(
          p => {
            const rp =
              roster.find(
                x => x.id === p.id
              );

            if (rp) {
              rp.sitOuts += 1;
              rp.lastSatRound = r;
            }
          }
        );

        rounds.push(round);
      }

      this.schedule = rounds;

      this.showMessage(
        'Successfully generated ' +
          this.roundCount +
          ' rounds of court assignments!',
        'alert alert-success'
      );
    },
    clearRoster() {
      this.namesText = '';
      this.schedule = [];
    
      this.closeSubModal();
    
      this.showMessage(
        'Player roster and court assignments cleared.',
        'alert alert-success'
      );
    },
    clearAll() {
      this.schedule = [];

      this.showMessage(
        'Court assignments cleared.',
        'alert alert-success'
      );
    },

    toggleRoundClosed(round) {
      round.closed =
        !round.closed;
    },

    openSubModal(
      round,
      court,
      player
    ) {
      this.subModal = {
        show: true,
        round,
        court,
        player
      };
    },

    closeSubModal() {
      this.subModal = {
        show: false,
        round: null,
        court: null,
        player: null
      };
    },

    confirmSubstitution(
      sitOutPlayer
    ) {
      const {
        round,
        court,
        player
      } = this.subModal;

      const playerIdx =
        court.players.findIndex(
          p =>
            p.id === player.id
        );

      court.players.splice(
        playerIdx,
        1,
        { ...sitOutPlayer }
      );

      if (court.team1Ids) {
        const t1idx =
          court.team1Ids.indexOf(
            player.id
          );

        if (t1idx !== -1) {
          court.team1Ids[t1idx] =
            sitOutPlayer.id;
        }
      }

      if (court.team2Ids) {
        const t2idx =
          court.team2Ids.indexOf(
            player.id
          );

        if (t2idx !== -1) {
          court.team2Ids[t2idx] =
            sitOutPlayer.id;
        }
      }

      const sitOutIdx =
        round.sitOut.findIndex(
          p =>
            p.id ===
            sitOutPlayer.id
        );

      round.sitOut.splice(
        sitOutIdx,
        1
      );

      round.sitOut.push({
        ...player
      });

      this.closeSubModal();

      this.showMessage(
        `${player.name} subbed out → ${sitOutPlayer.name} subbed in.`,
        'alert alert-success'
      );
    },

    regenerateRemaining() {
      if (
        !this.players ||
        this.players.length < 8
      ) {
        this.showMessage(
          'Please enter at least 8 players to regenerate rounds.'
        );

        return;
      }

      const partnerCount =
        new Map();

      const opponentCount =
        new Map();

      const individualOpponentCount =
        new Map();

      const roster =
        this.players.map(
          p => ({
            ...p,
            sitOuts: 0,
            lastSatRound:
              Number.NEGATIVE_INFINITY
          })
        );

      this.schedule.forEach(
        round => {
          if (round.closed) {
            round.courts.forEach(
              court => {
                if (
                  court.players.length >= 4
                ) {
                  if (
                    court.team1Ids &&
                    court.team2Ids
                  ) {
                    const [a, b] =
                      court.team1Ids;

                    const [c, d] =
                      court.team2Ids;

                    const pk1 =
                      keyPair(a, b);

                    const pk2 =
                      keyPair(c, d);

                    partnerCount.set(
                      pk1,
                      (
                        partnerCount.get(
                          pk1
                        ) || 0
                      ) + 1
                    );

                    partnerCount.set(
                      pk2,
                      (
                        partnerCount.get(
                          pk2
                        ) || 0
                      ) + 1
                    );

                    const mk =
                      keyMatchup(
                        [
                          { id: a },
                          { id: b }
                        ],
                        [
                          { id: c },
                          { id: d }
                        ]
                      );

                    opponentCount.set(
                      mk,
                      (
                        opponentCount.get(
                          mk
                        ) || 0
                      ) + 1
                    );

                    [
                      [a, c],
                      [a, d],
                      [b, c],
                      [b, d]
                    ].forEach(
                      ([x, y]) => {
                        const ik =
                          keyPair(
                            x,
                            y
                          );

                        individualOpponentCount.set(
                          ik,
                          (
                            individualOpponentCount.get(
                              ik
                            ) || 0
                          ) + 1
                        );
                      }
                    );
                  } else {
                    const p =
                      court.players;

                    const pk1 =
                      keyPair(
                        p[0].id,
                        p[1].id
                      );

                    const pk2 =
                      keyPair(
                        p[2].id,
                        p[3].id
                      );

                    partnerCount.set(
                      pk1,
                      (
                        partnerCount.get(
                          pk1
                        ) || 0
                      ) + 1
                    );

                    partnerCount.set(
                      pk2,
                      (
                        partnerCount.get(
                          pk2
                        ) || 0
                      ) + 1
                    );
                  }
                }
              }
            );

            round.sitOut.forEach(
              p => {
                const rp =
                  roster.find(
                    x =>
                      x.id === p.id
                  );

                if (rp) {
                  rp.sitOuts += 1;
                  rp.lastSatRound =
                    round.index;
                }
              }
            );
          }
        }
      );

      const newSchedule = [];

      let roundIndex = 1;

      this.schedule.forEach(
        existingRound => {
          if (
            existingRound.closed
          ) {
            newSchedule.push({
              ...existingRound,
              index: roundIndex
            });
          } else {
            const newRound =
              buildRound(
                roster,
                roundIndex,
                this.courtCount,
                partnerCount,
                opponentCount,
                individualOpponentCount
              );

            newRound.sitOut.forEach(
              p => {
                const rp =
                  roster.find(
                    x =>
                      x.id === p.id
                  );

                if (rp) {
                  rp.sitOuts += 1;
                  rp.lastSatRound =
                    roundIndex;
                }
              }
            );

            newSchedule.push(
              newRound
            );
          }

          roundIndex++;
        }
      );

      this.schedule =
        newSchedule;

      this.showMessage(
        'Successfully regenerated open rounds with the current player roster!',
        'alert alert-success'
      );
    }
  }
};
</script>

<style scoped>
/* =========================================================
   BASE / OVERFLOW SAFETY
========================================================= */

.home-page {
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

.home-page *,
.home-page *::before,
.home-page *::after {
  box-sizing: border-box;
}

.app-eyebrow,
.section-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  color: #198754;
}

.app-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
}

.page-heading {
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: clamp(
    1.7rem,
    5vw,
    2.5rem
  );

  font-weight: 700;
  line-height: 1.15;

  overflow-wrap: anywhere;
}

.page-subtitle {
  font-size: 1rem;
  line-height: 1.5;
}

/* =========================================================
   GAME SETUP
========================================================= */

.setup-card {
  width: 100%;
  margin: 0;

  border-radius: 1rem;

  background: #ffffff;

  box-shadow:
    0 3px 14px
    rgba(0, 0, 0, 0.08);
}

.setup-card-content {
  padding: 1.5rem;
}

.setup-heading {
  display: flex;
  align-items: center;

  gap: 0.75rem;

  min-width: 0;

  border-bottom:
    1px solid #dee2e6;

  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.setup-heading-text {
  min-width: 0;
}

.setup-icon {
  width: 44px;
  height: 44px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 44px;

  border-radius: 50%;

  background: #e9f7ef;
  color: #0e4b2e;
}

.setup-icon ion-icon {
  font-size: 1.4rem;
}

.roster-section {
  min-width: 0;
  margin-bottom: 1.5rem;
}

.roster-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 1rem;

  min-width: 0;

  margin-bottom: 0.65rem;
}

.roster-heading-copy {
  min-width: 0;
}
  
.roster-heading-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 0.35rem;

  flex-shrink: 0;
}
  .roster-instruction {
  margin-top: 0.2rem;
  color: #495057;
  font-size: 0.95rem;
  font-weight: 600;
}

.roster-textarea {
  --background: #fbfdf8;
  --border-color: #0e4b2e;
  --border-width: 2px;
  --border-radius: 0.75rem;
  --highlight-color-focused: #198754;

  margin-top: 0.75rem;
}

.roster-textarea::part(native) {
  font-size: 1rem;
}

.clear-roster-button {
  --color: #6c757d;
  --padding-start: 0.45rem;
  --padding-end: 0.45rem;

  min-height: 44px;
  margin: 0;

  font-size: 0.85rem;
  font-weight: 600;
  text-transform: none;
}

.setting-label {
  display: block;

  font-size: 0.8rem;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.roster-label {
  margin-bottom: 0.15rem;
}

.player-count {
  flex-shrink: 0;

  white-space: nowrap;

  font-weight: 600;
  color: #6c757d;
}

.player-count-ready {
  color: #198754;
}

.roster-textarea {
  --background: #ffffff;
  --border-color: #8b949e;
  --border-width: 2px;
  --border-radius: 0.75rem;
  --highlight-color-focused: #198754;

  --padding-start: 0.9rem;
  --padding-end: 0.9rem;
  --padding-top: 0.85rem;
  --padding-bottom: 0.85rem;

  width: 100%;

  font-size: 1rem;
  line-height: 1.55;
}

.scan-button {
  --border-color: #198754;
  --color: #146c43;
  --border-radius: 0.75rem;
  --border-width: 1px;

  min-height: 50px;

  margin-top: 1rem;

  font-weight: 600;
  text-transform: none;
}

.settings-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1rem;

  margin-bottom: 1.5rem;
}

.setting-card {
  min-width: 0;

  border:
    1px solid #dee2e6;

  border-radius: 0.875rem;

  padding: 0.85rem;

  background: #ffffff;
}

.setting-select {
  --background: #ffffff;
  --border-color: #ced4da;
  --border-radius: 0.7rem;
  --highlight-color-focused: #198754;

  --padding-start: 0.8rem;
  --padding-end: 0.8rem;

  width: 100%;
  min-height: 52px;

  font-weight: 700;
}

.setting-helper {
  margin-top: 0.6rem;

  text-align: center;
}

.game-summary {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  width: 100%;

  border:
    1px solid #dee2e6;

  border-radius: 0.875rem;

  overflow: hidden;

  margin-bottom: 1rem;
}

.game-summary > div {
  min-width: 0;

  text-align: center;

  padding:
    0.85rem 0.25rem;
}

.game-summary > div + div {
  border-left:
    1px solid #dee2e6;
}

.game-summary strong,
.game-summary span {
  display: block;
}

.game-summary strong {
  font-size: 1.15rem;
}

.game-summary span {
  margin-top: 0.15rem;

  font-size: 0.72rem;
  color: #6c757d;

  overflow-wrap: anywhere;
}

.generate-button {
  --background: #0e4b2e;
  --background-hover: #0b3d26;
  --background-activated: #0b3d26;
  --color: #ffffff;
  --border-radius: 0.75rem;

  min-height: 56px;
  margin: 0;

  font-size: 1.05rem;
  font-weight: 700;

  text-transform: none;
}

.secondary-actions {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 0.75rem;

  margin-top: 0.75rem;
}

.secondary-action {
  --border-radius: 0.75rem;

  min-height: 50px;
  margin: 0;

  font-weight: 600;
  text-transform: none;
}

.secondary-action:not([color="medium"]) {
  --border-color: #198754;
  --color: #146c43;
}

/* =========================================================
   ASSIGNMENT CONTROLS
========================================================= */

.assignments-section {
  width: 100%;
  min-width: 0;

  margin-top: 1.75rem;
}

.assignments-heading {
  margin-bottom: 1rem;
}

.assignment-title-row {
  display: flex;
  align-items: flex-end;

  gap: 0.6rem;

  min-width: 0;
}

.assignments-title {
  min-width: 0;
  margin: 0;

  font-size: clamp(
    1.4rem,
    4vw,
    2rem
  );

  font-weight: 700;

  overflow-wrap: anywhere;
}

.round-count-text {
  flex-shrink: 0;

  padding-bottom: 0.15rem;

  font-size: 0.9rem;
  color: #6c757d;
}

.assignment-controls-card {
  width: 100%;

  margin:
    0 0 1rem 0;

  border-radius: 1rem;

  box-shadow:
    0 2px 10px
    rgba(0, 0, 0, 0.06);
}

.assignment-controls-content {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(220px, 0.75fr);

  align-items: end;

  gap: 1rem;

  padding: 1rem;
}

.view-control,
.number-control-copy {
  min-width: 0;
}

.control-label {
  margin-bottom: 0.4rem;

  font-size: 0.78rem;
  font-weight: 700;

  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: #495057;
}

.control-help {
  font-size: 0.82rem;
  line-height: 1.35;

  color: #6c757d;
}

.view-segment {
  --background: #eef2ef;

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
  min-height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding:
    0.5rem 0.25rem;
}

.number-control ion-toggle {
  --track-background-checked: #a8c735;
  --handle-background-checked: #0e4b2e;

  flex-shrink: 0;
}

/* =========================================================
   EMPTY STATE
========================================================= */

.empty-assignments {
  width: 100%;
  margin: 0;

  border:
    2px dashed #ced4da;

  border-radius: 1rem;

  box-shadow: none;

  background: #ffffff;
}

.empty-content {
  padding:
    2.5rem 1.25rem;

  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 0.8rem;

  border-radius: 50%;

  background: #e9f7ef;
  color: #0e4b2e;
}

.empty-icon ion-icon {
  font-size: 30px;
}

.empty-content h3 {
  margin:
    0 0 0.5rem;

  font-size: 1.2rem;
  font-weight: 700;
}

.empty-content p {
  max-width: 520px;

  margin: 0 auto;

  color: #6c757d;
  line-height: 1.5;
}

/* =========================================================
   ROUND CARDS
========================================================= */

.rounds-list {
  display: grid;

  gap: 1rem;

  width: 100%;
  min-width: 0;
}

.round-card {
  width: 100%;
  min-width: 0;

  margin: 0;

  border-radius: 1rem;

  overflow: hidden;

  background: #ffffff;

  box-shadow:
    0 3px 14px
    rgba(0, 0, 0, 0.07);
}

.round-card-completed {
  background: #fafafa;
}

.round-card-header {
  min-height: 76px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  min-width: 0;

  padding:
    1rem 1.1rem;

  border-bottom:
    1px solid #e9ecef;

  background: #f8faf9;
}

.round-card-completed
.round-card-header {
  background: #f1f3f2;
}

.round-heading {
  min-width: 0;
}

.round-label {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.1em;

  color: #6c757d;
}

.round-title {
  margin:
    0.1rem 0 0;

  font-size: 1.3rem;
  font-weight: 700;
}

.round-actions {
  display: flex;
  align-items: center;

  gap: 0.65rem;

  flex-shrink: 0;
}

.round-status {
  display: inline-flex;
  align-items: center;

  min-height: 32px;

  border-radius: 999px;

  padding:
    0.35rem 0.7rem;

  font-size: 0.76rem;
  font-weight: 700;

  white-space: nowrap;
}

.round-status-open {
  background: #e9f7ef;
  color: #146c43;
}

.round-status-closed {
  background: #e9ecef;
  color: #495057;
}

.round-action-button {
  --border-radius: 0.65rem;

  min-height: 44px;
  margin: 0;

  font-weight: 600;
  text-transform: none;
}

.round-content {
  min-width: 0;

  padding: 1rem;
}

.closed-round-summary {
  min-height: 68px;

  display: flex;
  align-items: center;

  gap: 0.6rem;

  padding: 1rem;

  color: #6c757d;

  font-size: 0.9rem;
  line-height: 1.4;
}

.closed-round-summary ion-icon {
  flex-shrink: 0;

  font-size: 22px;

  color: #198754;
}

/* =========================================================
   COURTS
========================================================= */

.courts-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1rem;

  min-width: 0;
}

.court-card {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid #dfe6e2;

  border-radius: 0.9rem;

  background: #ffffff;
}

.court-card-header {
  min-height: 54px;

  display: flex;
  align-items: center;

  gap: 0.6rem;

  min-width: 0;

  padding:
    0.75rem 0.9rem;

  border-bottom:
    1px solid #d1e7dd;

  background: #edf8f1;
}

.court-heading-icon {
  width: 32px;
  height: 32px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 32px;

  border-radius: 50%;

  background: #d9efdf;
  color: #0e4b2e;
}

.court-heading-icon ion-icon {
  font-size: 18px;
}

.court-title {
  min-width: 0;
  margin: 0;

  font-size: 1rem;
  font-weight: 700;

  color: #146c43;
}

/* =========================================================
   LIST VIEW
========================================================= */

.court-players {
  min-width: 0;

  padding: 0.4rem;
}

.player-row {
  width: 100%;
  min-width: 0;
  min-height: 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 0.5rem;

  padding:
    0.65rem 0.7rem;

  border: 0;
  border-radius: 0.6rem;

  background: transparent;
  color: #212529;

  font-family: inherit;
  font-size: 1rem;

  text-align: left;
}

.player-row + .player-row {
  border-top:
    1px solid #f1f3f5;
}

.player-row:disabled {
  opacity: 1;

  color: #212529;
}

.player-row-substitutable {
  cursor: pointer;
}

.player-row-substitutable:hover,
.player-row-substitutable:focus-visible {
  background: #f0f8f4;
}

.player-name {
  min-width: 0;

  display: flex;
  align-items: center;

  font-weight: 600;
}

.player-name-text,
.vs-player-name,
.sit-out-player-name,
.sub-player-option-name-text {
  min-width: 0;

  overflow-wrap: anywhere;
  word-break: normal;
}

.player-number {
  min-width: 30px;
  width: 30px;
  height: 30px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 30px;

  margin-right: 0.45rem;

  border-radius: 50%;

  background: #f1f3f5;
  color: #495057;

  font-size: 0.8rem;
  font-weight: 700;
}

.swap-indicator {
  flex-shrink: 0;

  margin-left: 0.25rem;

  font-size: 20px;

  color: #198754;
}

/* =========================================================
   VS VIEW
========================================================= */

.vs-matchup {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto
    minmax(0, 1fr);

  align-items: stretch;

  gap: 0.75rem;

  min-width: 0;

  padding: 0.75rem;
}

.vs-team {
  display: flex;
  flex-direction: column;

  min-width: 0;

  gap: 0.4rem;
}

.vs-team-label {
  margin-bottom: 0.1rem;

  text-align: center;

  font-size: 0.72rem;
  font-weight: 700;

  letter-spacing: 0.06em;
  text-transform: uppercase;

  color: #6c757d;
}

.vs-player {
  width: 100%;
  min-width: 0;
  min-height: 52px;

  display: flex;
  align-items: center;

  gap: 0.45rem;

  padding:
    0.65rem 0.7rem;

  border:
    1px solid #dee2e6;

  border-radius: 0.65rem;

  background: #ffffff;
  color: #212529;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  text-align: left;
}

.vs-player:not(:disabled):hover,
.vs-player:not(:disabled):focus-visible {
  border-color: #198754;

  background: #f0f8f4;
}

.vs-player:disabled {
  opacity: 1;
}

.vs-divider {
  align-self: center;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: #e9f7ef;
  color: #146c43;

  font-size: 0.8rem;
  font-weight: 800;
}

/* =========================================================
   SIT OUT / IDLE
========================================================= */

.idle-courts {
  display: flex;
  align-items: center;

  gap: 0.55rem;

  margin-top: 1rem;

  padding:
    0.8rem 1rem;

  border:
    1px solid #dee2e6;

  border-radius: 0.75rem;

  background: #f8f9fa;

  color: #495057;

  line-height: 1.4;
}

.idle-courts ion-icon {
  flex-shrink: 0;

  font-size: 20px;

  color: #6c757d;
}

.sit-out-card {
  margin-top: 1rem;
  margin-bottom: 1rem;

  padding: 1rem;

  border:
    1px solid #ffe69c;

  border-radius: 0.875rem;

  background: #fff8e1;
}

.sit-out-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 0.75rem;
}

.sit-out-label {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.09em;

  color: #997404;
}

.sit-out-title {
  margin: 0;

  font-size: 1.08rem;
  font-weight: 700;

  color: #664d03;
}

.sit-out-count {
  min-width: 34px;
  width: 34px;
  height: 34px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 34px;

  border-radius: 50%;

  background: #ffc107;
  color: #212529;

  font-weight: 700;
}

.sit-out-players {
  display: flex;
  flex-wrap: wrap;

  gap: 0.5rem;

  min-width: 0;
}

.sit-out-player {
  min-width: 0;
  min-height: 44px;
  max-width: 100%;

  display: inline-flex;
  align-items: center;

  padding:
    0.45rem 0.7rem;

  border:
    1px solid #ffe69c;

  border-radius: 999px;

  background: #ffffff;

  font-weight: 600;
}

.sit-out-player-number {
  flex-shrink: 0;

  margin-right: 0.35rem;

  font-size: 0.8rem;

  color: #997404;
}

.sit-out-help {
  display: flex;
  align-items: flex-start;

  gap: 0.45rem;

  margin-top: 0.8rem;

  color: #664d03;

  font-size: 0.9rem;
  line-height: 1.45;
}

.sit-out-help ion-icon {
  flex-shrink: 0;

  margin-top: 0.05rem;

  font-size: 18px;
}

/* =========================================================
   SUBSTITUTION MODAL
========================================================= */

.substitution-modal {
  --width: min(
    92vw,
    480px
  );

  --height: 70vh;
  --max-height: 700px;

  --border-radius: 1rem;

  --box-shadow:
    0 12px 40px
    rgba(0, 0, 0, 0.22);
}

.substitution-content {
  --background: #ffffff;
}

.sub-modal-shell {
  width: 100%;
  min-width: 0;

  padding:
    1.25rem
    1.25rem
    calc(
      1.25rem +
      env(safe-area-inset-bottom)
    );
}

.sub-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  min-width: 0;

  padding-bottom: 1rem;

  border-bottom:
    1px solid #e9ecef;
}

.sub-modal-heading-copy {
  min-width: 0;
}

.sub-modal-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.1em;

  color: #198754;
}

.sub-modal-title {
  margin:
    0.1rem 0 0;

  font-size: 1.4rem;
  font-weight: 700;
}

.sub-modal-close {
  --padding-start: 0;
  --padding-end: 0;

  width: 44px;
  height: 44px;

  flex: 0 0 44px;

  margin: 0;
}

.sub-modal-close ion-icon {
  font-size: 24px;
}

.sub-current-player {
  min-width: 0;

  margin-top: 1rem;

  padding: 1rem;

  border:
    1px solid #e9ecef;

  border-radius: 0.875rem;

  background: #f8f9fa;
}

.sub-current-player-name {
  font-size: 1.15rem;
  font-weight: 700;

  overflow-wrap: anywhere;
}

.sub-instruction {
  margin-top: 1.25rem;
  margin-bottom: 0.65rem;

  font-weight: 600;
  line-height: 1.4;
}

.sub-player-list {
  display: grid;

  gap: 0.6rem;

  min-width: 0;
}

.sub-player-option {
  width: 100%;
  min-width: 0;
  min-height: 58px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding:
    0.7rem 0.85rem;

  border:
    1px solid #ced4da;

  border-radius: 0.75rem;

  background: #ffffff;
  color: #212529;

  font-family: inherit;

  text-align: left;
}

.sub-player-option:hover,
.sub-player-option:focus-visible {
  border-color: #198754;

  background: #f0f8f4;
}

.sub-player-option-name {
  min-width: 0;

  display: flex;
  align-items: center;

  font-size: 1rem;
  font-weight: 600;
}

.sub-player-action {
  display: inline-flex;
  align-items: center;

  gap: 0.25rem;

  flex-shrink: 0;

  white-space: nowrap;

  color: #198754;

  font-size: 0.9rem;
  font-weight: 700;
}

.sub-player-action ion-icon {
  font-size: 18px;
}

.sub-modal-note {
  display: flex;
  align-items: flex-start;

  gap: 0.5rem;

  margin-top: 1rem;

  padding: 0.8rem;

  border-radius: 0.65rem;

  background: #fff8e1;

  color: #664d03;

  font-size: 0.88rem;
  line-height: 1.4;
}

.sub-modal-note ion-icon {
  flex-shrink: 0;

  margin-top: 0.05rem;

  font-size: 19px;
}

.sub-cancel-button {
  --border-radius: 0.75rem;

  min-height: 50px;

  margin:
    1rem 0 0;

  font-weight: 600;
  text-transform: none;
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

button,
select,
textarea,
input {
  font-family: inherit;
}

button {
  -webkit-tap-highlight-color:
    transparent;
}

button:focus-visible,
select:focus-visible,
textarea:focus-visible,
input:focus-visible {
  outline:
    3px solid
    rgba(25, 135, 84, 0.32);

  outline-offset: 2px;
}

.player-row:focus-visible,
.vs-player:focus-visible,
.sub-player-option:focus-visible {
  outline:
    3px solid
    rgba(25, 135, 84, 0.32);

  outline-offset: 2px;
}

.player-row,
.vs-player {
  line-height: 1.3;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;

    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}

/* =========================================================
   LARGE TABLETS / DESKTOP
========================================================= */

@media (min-width: 1100px) {
  .setup-card-content {
    padding: 1.75rem;
  }

  .round-content {
    padding: 1.25rem;
  }

  .courts-grid {
    gap: 1.25rem;
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {
  .assignment-controls-content {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(190px, 0.65fr);
  }

  .courts-grid {
    gap: 0.85rem;
  }
}

@media (max-width: 767.98px) {
  .courts-grid {
    grid-template-columns: 1fr;
  }

  .assignment-controls-content {
    grid-template-columns: 1fr;
  }

  .number-control {
    border-top:
      1px solid #e9ecef;

    padding-top: 1rem;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 575.98px) {
  .page-heading {
    margin-bottom: 1rem !important;
  }

  .page-title {
    font-size: 1.65rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .setup-card,
  .assignment-controls-card,
  .round-card,
  .empty-assignments {
    border-radius: 0.875rem;
  }

  .setup-card-content {
    padding: 1rem;
  }

  .setup-heading {
    align-items: flex-start;

    margin-bottom: 1.25rem;
  }

  .setup-icon {
    width: 42px;
    height: 42px;

    flex-basis: 42px;
  }

  .roster-heading {
    align-items: flex-start;

    gap: 0.75rem;
  }
  
  .roster-heading-actions {
  align-items: flex-end;
  flex-direction: column;

  gap: 0;
}

.clear-roster-button {
  min-height: 40px;
}

  .player-count {
    font-size: 0.9rem;
  }

  .roster-textarea {
    font-size: 16px;
  }

  .settings-grid {
    gap: 0.65rem;
  }

  .setting-card {
    padding: 0.65rem;
  }

  .setting-helper {
    font-size: 0.72rem !important;
  }

  .game-summary strong {
    font-size: 1rem;
  }

  .game-summary span {
    font-size: 0.66rem;
  }

  .game-summary > div {
    padding:
      0.75rem 0.15rem;
  }

  .generate-button {
    min-height: 58px;

    font-size: 1rem;
  }

  .secondary-actions {
    grid-template-columns: 1fr;
  }

  .assignment-title-row {
    flex-direction: column;
    align-items: flex-start;

    gap: 0.15rem;
  }

  .assignments-title {
    font-size: 1.55rem;
  }

  .round-count-text {
    padding-bottom: 0;
  }

  .assignment-controls-content {
    padding: 0.85rem;
  }

  .view-segment ion-segment-button {
    min-height: 50px;
  }

  .number-control {
    min-height: 62px;

    padding:
      1rem 0 0.35rem;
  }

  .round-card-header {
    flex-direction: column;
    align-items: stretch;

    gap: 0.75rem;

    padding: 1rem;
  }

  .round-actions {
    width: 100%;

    justify-content:
      space-between;
  }

  .round-title {
    font-size: 1.35rem;
  }

  .round-status {
    min-height: 34px;

    font-size: 0.8rem;

    padding:
      0.4rem 0.7rem;
  }

  .round-action-button {
    min-height: 48px;
  }

  .round-content {
    padding: 0.75rem;
  }

  .court-card-header {
    padding: 0.85rem;
  }

  .court-title {
    font-size: 1.08rem;
  }

  .court-players {
    padding: 0.35rem;
  }

  .player-row {
    min-height: 58px;

    padding: 0.75rem;

    font-size: 1.08rem;
  }

  .vs-matchup {
    gap: 0.4rem;

    padding: 0.6rem;
  }

  .vs-divider {
    width: 34px;
    height: 34px;

    font-size: 0.7rem;
  }

  .vs-player {
    min-height: 58px;

    padding:
      0.6rem 0.5rem;

    font-size: 1rem;
  }

  .player-number {
    min-width: 30px;
    width: 30px;
    height: 30px;

    font-size: 0.82rem;
  }

  .sit-out-card {
    padding: 0.9rem;
  }

  .sit-out-title {
    font-size: 1.15rem;
  }

  .sit-out-help {
    font-size: 0.95rem;
  }

  .substitution-modal {
  --width: 100%;
  --height: 72vh;
  --max-height: 72vh;

  --border-radius:
    1rem 1rem 0 0;

  align-items: flex-end;
}

  .sub-modal-shell {
    padding:
      1.1rem
      1rem
      calc(
        1rem +
        env(safe-area-inset-bottom)
      );
  }

  .sub-player-option {
    min-height: 60px;
  }

  .sub-player-option-name {
    font-size: 1.05rem;
  }
}

/* =========================================================
   EXTRA-NARROW PHONES
========================================================= */

@media (max-width: 390px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .game-summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .game-summary > div + div {
    border-left: 0;
  }

  .game-summary > div:nth-child(even) {
    border-left:
      1px solid #dee2e6;
  }

  .game-summary > div:nth-child(n + 3) {
    border-top:
      1px solid #dee2e6;
  }

  .round-actions {
    align-items: stretch;

    flex-direction: column;
  }

  .round-status {
    align-self: flex-start;
  }

  .round-action-button {
    width: 100%;
  }

  .vs-matchup {
    grid-template-columns: 1fr;

    gap: 0.55rem;
  }

  .vs-divider {
    width: auto;
    height: 30px;

    align-self: center;

    padding:
      0 0.75rem;

    border-radius: 999px;
  }

  .vs-team-label {
    text-align: left;
  }

  .vs-player {
    min-height: 56px;
  }

  .sub-player-option {
    align-items: flex-start;
  }
}

/* =========================================================
   SETTINGS MODAL (MOBILE ONLY)
========================================================= */

.settings-modal {
  --width: 100%;
  --height: auto;

  --border-radius:
    1rem 1rem 0 0;

  --box-shadow:
    0 12px 40px
    rgba(0, 0, 0, 0.22);

  align-items: flex-end;
}

.settings-modal::part(content) {
  border-radius:
    1rem 1rem 0 0;
}

.settings-content {
  display: block;

  max-height: 85vh;
  overflow-y: auto;

  background: #f5f5f5;
}

.settings-modal-shell {
  width: 100%;
  min-width: 0;

  padding:
    1.25rem
    1.25rem
    calc(
      1.25rem +
      env(safe-area-inset-bottom)
    );
}

.settings-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  min-width: 0;

  padding-bottom: 1rem;

  border-bottom:
    1px solid #e9ecef;
}

.settings-modal-heading-copy {
  min-width: 0;
}

.settings-modal-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.1em;

  color: #198754;
}

.settings-modal-title {
  margin:
    0.1rem 0 0;

  font-size: 1.4rem;
  font-weight: 700;
}

.settings-modal-subtitle {
  margin:
    0.25rem 0 0;

  font-size: 0.9rem;
  line-height: 1.4;

  color: #6c757d;
}

.settings-modal-close {
  --padding-start: 0;
  --padding-end: 0;

  width: 44px;
  height: 44px;

  flex: 0 0 44px;

  margin: 0;
}

.settings-modal-close ion-icon {
  font-size: 24px;
}

.settings-modal-shell .settings-card {
  margin:
    1rem 0 0;

  border-radius: 1rem;

  background: #ffffff;

  box-shadow:
    0 3px 14px
    rgba(0, 0, 0, 0.08);
}

.settings-modal-shell .settings-card-content {
  padding: 1.25rem;
}

.settings-modal-shell .setting-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 0.8rem;
}

.settings-modal-shell .setting-copy {
  min-width: 0;
}

.settings-modal-shell .setting-label {
  display: block;

  font-size: 0.9rem;
  font-weight: 700;

  letter-spacing: normal;
  text-transform: none;

  color: #1f2d23;
}

.settings-modal-shell .setting-help {
  margin-top: 0.3rem;

  font-size: 0.9rem;
  line-height: 1.35;

  color: #6c757d;
}

.settings-modal-shell .setting-row-icon {
  font-size: 1.15rem;
  color: #198754;
}

.settings-modal-shell .view-segment {
  --background: #eef2ef;
  --border-radius: 0.75rem;

  width: 100%;
  min-height: 48px;
}

.settings-modal-shell .view-segment ion-segment-button {
  --color: #495057;
  --color-checked: #ffffff;
  --indicator-color: #0e4b2e;

  min-width: 0;
  min-height: 48px;

  font-weight: 700;
}

.settings-modal-shell .view-segment ion-icon {
  margin-right: 0.35rem;

  font-size: 18px;
}

.settings-modal-shell .number-control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  min-height: auto;
  padding: 0;
}

.settings-modal-shell .number-control ion-toggle {
  --track-background-checked: #a8c735;
  --handle-background-checked: #0e4b2e;

  flex-shrink: 0;
}

.settings-done-button {
  --background: #0e4b2e;
  --background-hover: #0b3d26;
  --background-activated: #0b3d26;
  --color: #ffffff;
  --border-radius: 0.75rem;

  min-height: 56px;

  margin-top: 1.5rem;

  font-size: 1.05rem;
  font-weight: 700;

  text-transform: none;
}

/* =========================================================
   ASSIGNMENT CONTROLS (WEB ONLY)
========================================================= */

.assignment-controls-card {
  width: 100%;

  margin:
    0 0 1rem 0;

  border-radius: 1rem;

  box-shadow:
    0 2px 10px
    rgba(0, 0, 0, 0.06);
}

.assignment-controls-content {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(220px, 0.75fr);

  align-items: end;

  gap: 1rem;

  padding: 1rem;
}

.view-control,
.number-control-copy {
  min-width: 0;
}

.control-label {
  margin-bottom: 0.4rem;

  font-size: 0.78rem;
  font-weight: 700;

  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: #495057;
}

.control-help {
  font-size: 0.82rem;
  line-height: 1.35;

  color: #6c757d;
}

.view-segment {
  --background: #eef2ef;

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
  min-height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding:
    0.5rem 0.25rem;
}

.number-control ion-toggle {
  --track-background-checked: #a8c735;
  --handle-background-checked: #0e4b2e;

  flex-shrink: 0;
}

</style>
