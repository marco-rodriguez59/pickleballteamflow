<template>
  <div>
<section class="setup-section mb-4">
  <div class="text-center mb-4">
    <div class="app-eyebrow">PICKLEBALL TEAM FLOW</div>
    <h1 class="page-title mb-2">Pickleball Court Assignments</h1>
    <p class="text-secondary mb-0">
      Set up your players, courts, and rounds.
    </p>
  </div>

  <div class="card setup-card shadow-sm">
    <div class="card-body p-3 p-sm-4">

      <div class="setup-heading d-flex align-items-center gap-2 mb-4">
        <div class="setup-icon" aria-hidden="true">👥</div>
        <div>
          <h2 class="h5 mb-0">Game Setup</h2>
          <div class="small text-secondary">
            Everything you need to create your court assignments.
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-end gap-2 mb-2">
          <div>
            <label for="peopleNames" class="form-label fw-semibold mb-1">
              Player Roster
            </label>
            <div class="small text-secondary">
              Enter one player per line.
            </div>
          </div>

          <div
            class="player-count"
            :class="{ 'player-count-ready': players.length >= 8 && players.length <= 24 }"
          >
            {{ players.length }} player{{ players.length === 1 ? '' : 's' }}
          </div>
        </div>

        <textarea
          class="form-control roster-textarea"
          v-model="namesText"
          placeholder="John Smith&#10;Sarah Johnson&#10;Mike Davis"
          id="peopleNames"
          aria-describedby="rosterHelp"
        ></textarea>

        <div id="rosterHelp" class="form-text">
          8–24 players are supported.
        </div>

        <input
          type="file"
          ref="imageInput"
          @change="handleImageUpload"
          accept="image/*"
          capture="environment"
          style="display: none;"
        />

        <div class="d-grid mt-3">
          <button
            class="btn btn-outline-success scan-button"
            @click="$refs.imageInput.click()"
            :disabled="isProcessing"
          >
            <span aria-hidden="true">📷</span>
            {{ isProcessing ? 'Processing Photo...' : 'Scan Names from Photo' }}
          </button>
        </div>

        <div
          v-if="ocrProgress"
          class="small text-secondary mt-2"
          aria-live="polite"
        >
          {{ ocrProgress }}
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-6">
          <div class="setting-card h-100">
            <label for="courts" class="setting-label">
              Courts
            </label>

            <select
              class="form-select setting-select"
              id="courts"
              v-model="courtCount"
              aria-label="Number of Courts"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>

            <div class="small text-secondary mt-2">
              {{ courtCount * 4 }} playing spots
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="setting-card h-100">
            <label for="numRounds" class="setting-label">
              Rounds
            </label>

            <select
              class="form-select setting-select"
              id="numRounds"
              v-model="roundCount"
              aria-label="Number of Rounds"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>

            <div class="small text-secondary mt-2">
              Planned games
            </div>
          </div>
        </div>
      </div>

      <div class="game-summary mb-3">
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
          <strong>{{ Math.min(players.length, courtCount * 4) }}</strong>
          <span>Playing</span>
        </div>
      </div>

      <div class="d-grid">
        <button
          class="btn btn-success generate-button"
          @click="generate()"
        >
          <span aria-hidden="true">🏓</span>
          Generate Court Assignments
        </button>
      </div>

      <div
        v-if="schedule.length"
        class="d-flex flex-column flex-sm-row gap-2 mt-3"
      >
        <button
          class="btn btn-outline-secondary flex-fill secondary-action"
          @click="clearAll()"
        >
          🗑️ Clear Assignments
        </button>

        <button
          v-if="hasOpenRounds"
          class="btn btn-outline-warning flex-fill secondary-action"
          @click="regenerateRemaining()"
        >
          🔄 Regenerate Open Rounds
        </button>
      </div>
    </div>
  </div>
</section>
    
    <div id="message" class="mt-3"></div>
    
<section class="assignments-section mt-4">

  <div class="assignments-heading mb-3">
    <div>
      <div class="section-eyebrow">YOUR GAME</div>

      <div class="d-flex flex-column flex-sm-row align-items-sm-end gap-1 gap-sm-2">
        <h2 class="assignments-title mb-0">Court Assignments</h2>

        <span v-if="schedule.length" class="round-count-text">
          {{ schedule.length }} round{{ schedule.length === 1 ? '' : 's' }}
        </span>
      </div>
    </div>

<div class="assignment-controls mt-2 mt-sm-0">
  <div
    class="btn-group view-toggle"
    role="group"
    aria-label="Court assignment view"
  >
    <button
      type="button"
      class="btn"
      :class="courtView === 'list' ? 'btn-success' : 'btn-outline-success'"
      :aria-pressed="courtView === 'list'"
      @click="courtView = 'list'"
    >
      ☰ List
    </button>

    <button
      type="button"
      class="btn"
      :class="courtView === 'vs' ? 'btn-success' : 'btn-outline-success'"
      :aria-pressed="courtView === 'vs'"
      @click="courtView = 'vs'"
    >
      VS
    </button>
  </div>

  <div class="form-check player-number-toggle">
    <input
      class="form-check-input"
      type="checkbox"
      id="showNumbers"
      v-model="showNumbers"
    >
    <label class="form-check-label" for="showNumbers">
      Show player numbers
    </label>
  </div>
</div>
  </div>

  <div
    v-if="!schedule.length"
    class="empty-assignments text-center"
  >
    <div class="empty-icon" aria-hidden="true">🏓</div>

    <h3 class="h5 mb-2">Ready when you are</h3>

    <p class="text-secondary mb-0">
      Enter at least <strong>8 players</strong>, choose your courts and rounds,
      then select <strong>Generate Court Assignments</strong>.
    </p>
  </div>

  <div v-if="schedule.length > 0" class="rounds-list">

    <article
      v-for="round in schedule"
      :key="round.index"
      class="round-card card shadow-sm mb-3"
    >
      <div
        class="round-card-header"
        :class="{ 'round-closed': round.closed }"
      >
        <div>
          <div class="round-label">
            ROUND
          </div>

          <h3 class="round-title mb-0">
            Round {{ round.index }}
          </h3>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span
            class="round-status"
            :class="round.closed ? 'round-status-closed' : 'round-status-open'"
          >
            {{ round.closed ? 'Completed' : 'Open' }}
          </span>

          <button
            class="btn round-close-button"
            :class="round.closed ? 'btn-outline-secondary' : 'btn-outline-success'"
            data-bs-toggle="collapse"
            :data-bs-target="'#round-' + round.index"
            @click="toggleRoundClosed(round)"
          >
            {{ round.closed ? '↻ Reopen' : '✓ Close Round' }}
          </button>
        </div>
      </div>

      <div
        :id="'round-' + round.index"
        class="collapse"
        :class="{ show: !round.closed }"
      >
        <div class="card-body round-card-body">

          <div class="courts-grid">

            <div
              v-for="court in round.courts"
              :key="court.courtNumber"
              class="court-card"
            >
              <div class="court-card-header">
                <span class="court-icon" aria-hidden="true">🏓</span>

                <h4 class="court-title mb-0">
                  Court {{ court.courtNumber }}
                </h4>
              </div>

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
        !round.closed && round.sitOut.length > 0
    }"
    :disabled="round.closed || round.sitOut.length === 0"
    :aria-label="
      !round.closed && round.sitOut.length > 0
        ? 'Substitute ' + player.name
        : player.name
    "
    @click="
      !round.closed &&
      round.sitOut.length > 0 &&
      openSubModal(round, court, player)
    "
  >
    <span class="player-name">
      <span
        v-if="showNumbers"
        class="player-number"
      >
        {{ player.id }}
      </span>

      {{ player.name }}
    </span>

    <span
      v-if="!round.closed && round.sitOut.length > 0"
      class="swap-indicator"
      aria-hidden="true"
    >
      ↕
    </span>
  </button>
</div>

<div
  v-else
  class="vs-matchup"
>
  <div class="vs-team">
    <div class="vs-team-label">Team 1</div>

    <button
      v-for="player in court.players.slice(0, 2)"
      :key="player.id"
      type="button"
      class="vs-player"
      :disabled="round.closed || round.sitOut.length === 0"
      :aria-label="
        !round.closed && round.sitOut.length > 0
          ? 'Substitute ' + player.name
          : player.name
      "
      @click="
        !round.closed &&
        round.sitOut.length > 0 &&
        openSubModal(round, court, player)
      "
    >
      <span
        v-if="showNumbers"
        class="player-number"
      >
        {{ player.id }}
      </span>

      <span>{{ player.name }}</span>
    </button>
  </div>

  <div
    class="vs-divider"
    aria-hidden="true"
  >
    VS
  </div>

  <div class="vs-team">
    <div class="vs-team-label">Team 2</div>

    <button
      v-for="player in court.players.slice(2, 4)"
      :key="player.id"
      type="button"
      class="vs-player"
      :disabled="round.closed || round.sitOut.length === 0"
      :aria-label="
        !round.closed && round.sitOut.length > 0
          ? 'Substitute ' + player.name
          : player.name
      "
      @click="
        !round.closed &&
        round.sitOut.length > 0 &&
        openSubModal(round, court, player)
      "
    >
      <span
        v-if="showNumbers"
        class="player-number"
      >
        {{ player.id }}
      </span>

      <span>{{ player.name }}</span>
    </button>
  </div>
</div>

          </div>
        </div>

          <div
            v-if="round.courts.length < courtCount"
            class="idle-courts mt-3"
          >
            <span aria-hidden="true">ℹ️</span>

            {{ courtCount - round.courts.length }}
            court{{ courtCount - round.courts.length === 1 ? '' : 's' }}
            idle this round.
          </div>

          <div
            v-if="round.sitOut.length"
            class="sit-out-card mt-3"
          >
            <div class="sit-out-heading">
              <div>
                <div class="sit-out-label">
                  THIS ROUND
                </div>

                <h4 class="sit-out-title mb-0">
                  Sit Out
                </h4>
              </div>

              <span class="sit-out-count">
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
                >
                  {{ player.id }}
                </span>

                {{ player.name }}
              </span>
            </div>

            <div
              v-if="!round.closed"
              class="sit-out-help"
            >
              Need to make a change? Tap any court player to swap them with someone sitting out.
            </div>
          </div>

        </div>
      </div>
    </article>

  </div>
</section>
    <!-- Sub-out modal -->
<!-- Substitution modal -->
<div
  v-if="subModal.show"
  class="sub-modal-overlay"
  role="presentation"
  @click.self="closeSubModal"
>
  <div
    class="sub-modal-box shadow-lg"
    role="dialog"
    aria-modal="true"
    aria-labelledby="subModalTitle"
    aria-describedby="subModalDescription"
  >
    <div class="sub-modal-header">
      <div>
        <div class="sub-modal-eyebrow">PLAYER SUBSTITUTION</div>
        <h2 id="subModalTitle" class="sub-modal-title mb-0">
          Swap Player
        </h2>
      </div>

      <button
        type="button"
        class="btn sub-modal-close"
        aria-label="Close substitution window"
        @click="closeSubModal"
      >
        ✕
      </button>
    </div>

    <div
      id="subModalDescription"
      class="sub-current-player"
    >
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
        @click="confirmSubstitution(p)"
      >
        <span class="sub-player-option-name">
          <span
            v-if="showNumbers"
            class="player-number"
          >
            {{ p.id }}
          </span>

          {{ p.name }}
        </span>

        <span class="sub-player-action">
          Swap
          <span aria-hidden="true">→</span>
        </span>
      </button>
    </div>

    <div class="sub-modal-note">
      <span aria-hidden="true">ℹ️</span>
      {{ subModal.player?.name }} will move to Sit Out for this round.
    </div>

    <div class="d-grid mt-3">
      <button
        type="button"
        class="btn btn-outline-secondary sub-cancel-button"
        @click="closeSubModal"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

</div>
</template>

<script>
import { buildRound, keyPair, keyMatchup } from '../utils.js';
import { createWorker } from 'tesseract.js';

export default {
  name: 'Home',
  data() {
    return {
      namesText: '',
      courtCount: 2,
      showNumbers: true,
      courtView: 'list',
      roundCount: 7,
      schedule: [],
      isProcessing: false,
      ocrProgress: '',
      subModal: { show: false, round: null, court: null, player: null },
    }
  },
  computed: {
    players() {
      return this.namesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: i + 1, name, sitOuts: 0, lastSatRound: Number.NEGATIVE_INFINITY }));
    },
    hasOpenRounds() {
      return this.schedule.some(round => !round.closed);
    }
  },
  methods: {
    showMessage(text, type = 'alert alert-danger') {
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = '<div class="' + type + '">' + text + '</div>';
      setTimeout(() => {
        messageDiv.innerHTML = '';
      }, 5000);
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.isProcessing = true;
      this.ocrProgress = 'Initializing OCR...';

      try {
        const worker = await createWorker('eng');
        
        this.ocrProgress = 'Processing image...';
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        // Extract names (lines with text, clean up)
        const extractedNames = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && line.length < 50) // Filter reasonable name lengths
          .join('\n');

        if (extractedNames) {
          // Append to existing names or replace if empty
          if (this.namesText.trim()) {
            this.namesText += '\n' + extractedNames;
          } else {
            this.namesText = extractedNames;
          }
          this.showMessage(`Successfully extracted ${extractedNames.split('\n').length} names from image!`, 'alert alert-success');
        } else {
          this.showMessage('No text found in image. Please try a clearer photo.', 'alert alert-warning');
        }
      } catch (error) {
        console.error('OCR Error:', error);

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
      if (!this.players || this.players.length < 8 || this.players.length > 24) {
        this.showMessage('Please enter between 8 and 24 player names.');
        return;
      }

      if (!this.courtCount || this.courtCount < 1) {
        this.showMessage('Please select a valid number of courts.');
        return;
      }

      if (!this.roundCount || this.roundCount < 1) {
        this.showMessage('Please select a valid number of rounds.');
        return;
      }

      const people = this.namesText.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (people.length === 0) {
        this.showMessage('Please enter valid names.');
        return;
      }

      const uniquePeople = [...new Set(people)];
      if (uniquePeople.length !== people.length) {
        this.showMessage('Warning: Duplicate names detected. Using unique names only.', 'alert alert-warning');
      }

      const roster = this.players.map(p => ({ ...p }));
      const partnerCount = new Map();
      const opponentCount = new Map();
      const individualOpponentCount = new Map();
      const rounds = [];

      for (let r = 1; r <= this.roundCount; r++) {
        const round = buildRound(roster, r, this.courtCount, partnerCount, opponentCount, individualOpponentCount);
        round.sitOut.forEach(p => {
          const rp = roster.find(x => x.id === p.id);
          if (rp) {
            rp.sitOuts += 1;
            rp.lastSatRound = r;
          }
        });
        rounds.push(round);
      }

      this.showMessage('Successfully generated ' + this.roundCount + ' rounds of court assignments!', 'alert alert-success');
      this.schedule = rounds;
    },
    clearAll() {
      this.schedule = [];
    },
    toggleRoundClosed(round) {
      round.closed = !round.closed;
    },
    openSubModal(round, court, player) {
      this.subModal = { show: true, round, court, player };
    },
    closeSubModal() {
      this.subModal = { show: false, round: null, court: null, player: null };
    },
    confirmSubstitution(sitOutPlayer) {
      const { round, court, player } = this.subModal;

      // Swap player into sit-out and sit-out player onto court
      const playerIdx = court.players.findIndex(p => p.id === player.id);
      court.players.splice(playerIdx, 1, { ...sitOutPlayer });

      // Keep team1Ids / team2Ids in sync
      if (court.team1Ids) {
        const t1idx = court.team1Ids.indexOf(player.id);
        if (t1idx !== -1) court.team1Ids[t1idx] = sitOutPlayer.id;
      }
      if (court.team2Ids) {
        const t2idx = court.team2Ids.indexOf(player.id);
        if (t2idx !== -1) court.team2Ids[t2idx] = sitOutPlayer.id;
      }

      // Move sit-out player onto court, move active player to sit-out
      const sitOutIdx = round.sitOut.findIndex(p => p.id === sitOutPlayer.id);
      round.sitOut.splice(sitOutIdx, 1);
      round.sitOut.push({ ...player });

      this.closeSubModal();
      this.showMessage(`${player.name} subbed out → ${sitOutPlayer.name} subbed in.`, 'alert alert-success');
    },
    regenerateRemaining() {
      if (!this.players || this.players.length < 8) {
        this.showMessage('Please enter at least 8 players to regenerate rounds.');
        return;
      }

      const partnerCount = new Map();
      const opponentCount = new Map();
      const individualOpponentCount = new Map();
      const roster = this.players.map(p => ({ ...p, sitOuts: 0, lastSatRound: Number.NEGATIVE_INFINITY }));

      this.schedule.forEach(round => {
        if (round.closed) {
          round.courts.forEach(court => {
            if (court.players.length >= 4) {
              if (court.team1Ids && court.team2Ids) {
                const [a, b] = court.team1Ids;
                const [c, d] = court.team2Ids;
                const pk1 = keyPair(a, b), pk2 = keyPair(c, d);
                partnerCount.set(pk1, (partnerCount.get(pk1) || 0) + 1);
                partnerCount.set(pk2, (partnerCount.get(pk2) || 0) + 1);
                const mk = keyMatchup([{id: a}, {id: b}], [{id: c}, {id: d}]);
                opponentCount.set(mk, (opponentCount.get(mk) || 0) + 1);
                [[a,c],[a,d],[b,c],[b,d]].forEach(([x, y]) => {
                  const ik = keyPair(x, y);
                  individualOpponentCount.set(ik, (individualOpponentCount.get(ik) || 0) + 1);
                });
              } else {
                // Fallback for old data without stored team IDs: record best-guess partnerships
                const p = court.players;
                const pk1 = keyPair(p[0].id, p[1].id);
                const pk2 = keyPair(p[2].id, p[3].id);
                partnerCount.set(pk1, (partnerCount.get(pk1) || 0) + 1);
                partnerCount.set(pk2, (partnerCount.get(pk2) || 0) + 1);
              }
            }
          });
          round.sitOut.forEach(p => {
            const rp = roster.find(x => x.id === p.id);
            if (rp) {
              rp.sitOuts += 1;
              rp.lastSatRound = round.index;
            }
          });
        }
      });

      const newSchedule = [];
      let roundIndex = 1;

      this.schedule.forEach(existingRound => {
        if (existingRound.closed) {
          newSchedule.push({ ...existingRound, index: roundIndex });
        } else {
          const newRound = buildRound(roster, roundIndex, this.courtCount, partnerCount, opponentCount, individualOpponentCount);
          newRound.sitOut.forEach(p => {
            const rp = roster.find(x => x.id === p.id);
            if (rp) {
              rp.sitOuts += 1;
              rp.lastSatRound = roundIndex;
            }
          });
          newSchedule.push(newRound);
        }
        roundIndex++;
      });

      this.schedule = newSchedule;
      this.showMessage('Successfully regenerated open rounds with the current player roster!', 'alert alert-success');
    }
  }
};
</script>

<style scoped>
  .page-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}
.clickable-player {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  transition: background-color 0.15s;
}
.clickable-player:hover {
  background-color: #fff3cd;
}
.sub-out-badge {
  font-size: 0.7em;
  color: #6c757d;
  margin-left: 4px;
}
.sub-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;

  padding-top: calc(16px + env(safe-area-inset-top));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  padding-left: calc(16px + env(safe-area-inset-left));
}

.sub-modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 420px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}
  .app-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #198754;
}

.page-title {
  font-size: clamp(1.7rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
}

.setup-card {
  border: 0;
  border-radius: 1rem;
}

.setup-heading {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem;
}

.setup-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e9f7ef;
  font-size: 1.25rem;
}

.player-count {
  white-space: nowrap;
  font-weight: 600;
  color: #6c757d;
}

.player-count-ready {
  color: #198754;
}

.roster-textarea {
  min-height: 210px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.55;
  border-radius: 0.75rem;
}

.scan-button,
.generate-button,
.secondary-action {
  min-height: 50px;
  border-radius: 0.75rem;
  font-weight: 600;
}

.generate-button {
  font-size: 1.05rem;
  min-height: 56px;
}

.setting-card {
  border: 1px solid #dee2e6;
  border-radius: 0.875rem;
  padding: 1rem;
  text-align: center;
  background: #fff;
}

.setting-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
}

.setting-select {
  min-height: 52px;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

.game-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid #dee2e6;
  border-radius: 0.875rem;
  overflow: hidden;
}

.game-summary > div {
  text-align: center;
  padding: 0.85rem 0.25rem;
}

.game-summary > div + div {
  border-left: 1px solid #dee2e6;
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
}

@media (max-width: 575.98px) {
  .setup-card .card-body {
    padding: 1rem;
  }

  .roster-textarea {
    min-height: 190px;
    font-size: 16px;
  }

  .setting-card {
    padding: 0.85rem 0.65rem;
  }

  .game-summary strong {
    font-size: 1rem;
  }

  .game-summary span {
    font-size: 0.68rem;
  }
}

.section-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  color: #198754;
}

.assignments-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.assignments-title {
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
}

.round-count-text {
  font-size: 0.9rem;
  color: #6c757d;
  padding-bottom: 0.15rem;
}

.player-number-toggle {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.player-number-toggle .form-check-input {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0;
}

.player-number-toggle .form-check-label {
  font-size: 0.95rem;
}

.empty-assignments {
  border: 2px dashed #ced4da;
  border-radius: 1rem;
  padding: 2.5rem 1.25rem;
  background: #fff;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.round-card {
  border: 0;
  border-radius: 1rem;
  overflow: hidden;
}

.round-card-header {
  min-height: 72px;
  padding: 1rem 1.1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.round-card-header.round-closed {
  background: #f1f3f5;
}

.round-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #6c757d;
}

.round-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.round-status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.round-status-open {
  background: #e9f7ef;
  color: #146c43;
}

.round-status-closed {
  background: #e9ecef;
  color: #495057;
}

.round-close-button {
  min-height: 44px;
  border-radius: 0.65rem;
  font-weight: 600;
}

.round-card-body {
  padding: 1rem;
}

.courts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.court-card {
  border: 1px solid #dee2e6;
  border-radius: 0.875rem;
  overflow: hidden;
  background: #fff;
}

.court-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.8rem 1rem;

  background: #e9f7ef;
  border-bottom: 1px solid #d1e7dd;
}

.court-icon {
  font-size: 1rem;
}

.court-title {
  font-size: 1rem;
  font-weight: 700;
  color: #146c43;
}

.court-players {
  padding: 0.45rem;
}
  .assignment-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.view-toggle .btn {
  min-height: 44px;
  min-width: 76px;
  font-weight: 600;
}

.vs-matchup {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0.75rem;
  padding: 0.75rem;
}

.vs-team {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.vs-team-label {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6c757d;
  margin-bottom: 0.1rem;
}

.vs-player {
  min-height: 50px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 0.45rem;

  padding: 0.65rem 0.7rem;

  border: 1px solid #dee2e6;
  border-radius: 0.65rem;

  background: #fff;
  color: #212529;

  font-size: 1rem;
  font-weight: 600;
  text-align: left;
}

.vs-player:not(:disabled):hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.vs-player:focus-visible {
  outline: 3px solid rgba(25, 135, 84, 0.25);
  outline-offset: 2px;
}

.vs-divider {
  align-self: center;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border-radius: 50%;
  background: #e9f7ef;
  color: #146c43;

  font-size: 0.8rem;
  font-weight: 800;
}

@media (max-width: 575.98px) {
  .assignment-controls {
    width: 100%;
    align-items: stretch;
  }

  .view-toggle {
    width: 100%;
  }

  .view-toggle .btn {
    flex: 1;
  }

  .player-number-toggle {
    justify-content: flex-start;
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
    min-height: 52px;
    padding: 0.55rem;
    font-size: 1rem;
  }
}

.player-row {
  width: 100%;
  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.65rem 0.7rem;

  border: 0;
  border-radius: 0.6rem;

  background: transparent;
  color: #212529;

  font-size: 1rem;
  text-align: left;
}

.player-row + .player-row {
  border-top: 1px solid #f1f3f5;
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

.player-row:focus-visible {
  outline: 3px solid rgba(25, 135, 84, 0.25);
  outline-offset: 1px;
}

.player-name {
  font-weight: 600;
}

.player-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 28px;
  height: 28px;

  margin-right: 0.45rem;

  border-radius: 50%;

  background: #f1f3f5;
  color: #495057;

  font-size: 0.78rem;
  font-weight: 700;
}

.swap-indicator {
  margin-left: 0.5rem;

  font-size: 1.1rem;
  font-weight: 700;

  color: #198754;
}

.idle-courts {
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;

  padding: 0.8rem 1rem;

  background: #f8f9fa;

  color: #495057;
}

.sit-out-card {
  border: 1px solid #ffe69c;
  border-radius: 0.875rem;

  padding: 1rem;

  background: #fff8e1;
}

.sit-out-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 0.75rem;
}

.sit-out-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;

  color: #997404;
}

.sit-out-title {
  font-size: 1.05rem;
  font-weight: 700;

  color: #664d03;
}

.sit-out-count {
  min-width: 32px;
  height: 32px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffc107;
  color: #212529;

  font-weight: 700;
}

.sit-out-players {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sit-out-player {
  display: inline-flex;
  align-items: center;

  min-height: 40px;

  padding: 0.45rem 0.7rem;

  border: 1px solid #ffe69c;
  border-radius: 999px;

  background: #fff;

  font-weight: 600;
}

.sit-out-player-number {
  margin-right: 0.35rem;
  color: #997404;
  font-size: 0.8rem;
}

.sit-out-help {
  margin-top: 0.75rem;

  font-size: 0.85rem;
  color: #664d03;
}

@media (max-width: 767.98px) {
  .courts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .assignments-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .round-card-header {
    align-items: flex-start;
  }

  .round-card-header > div:last-child {
    flex-direction: column;
    align-items: flex-end !important;
  }

  .round-close-button {
    font-size: 0.85rem;
  }

  .round-card-body {
    padding: 0.75rem;
  }

.player-row {
  min-height: 52px;
  font-size: 1.05rem;
}
}
  .sub-modal-box {
  background: #fff;
  border-radius: 1rem;
  padding: 1.25rem;
  max-width: 460px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}

.sub-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.sub-modal-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #198754;
}

.sub-modal-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.sub-modal-close {
  width: 44px;
  height: 44px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border-radius: 50%;
  background: #f1f3f5;

  font-size: 1.1rem;
}

.sub-current-player {
  margin-top: 1rem;
  padding: 1rem;

  border-radius: 0.875rem;

  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.sub-current-player-name {
  font-size: 1.15rem;
  font-weight: 700;
}

.sub-instruction {
  margin-top: 1.25rem;
  margin-bottom: 0.65rem;

  font-weight: 600;
}

.sub-player-list {
  display: grid;
  gap: 0.6rem;
}

.sub-player-option {
  width: 100%;
  min-height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.7rem 0.85rem;

  border: 1px solid #ced4da;
  border-radius: 0.75rem;

  background: #fff;
  color: #212529;

  text-align: left;
}

.sub-player-option:hover,
.sub-player-option:focus-visible {
  border-color: #198754;
  background: #f0f8f4;
}

.sub-player-option:focus-visible {
  outline: 3px solid rgba(25, 135, 84, 0.25);
  outline-offset: 1px;
}

.sub-player-option-name {
  font-size: 1rem;
  font-weight: 600;
}

.sub-player-action {
  white-space: nowrap;

  color: #198754;

  font-size: 0.9rem;
  font-weight: 700;
}

.sub-modal-note {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;

  margin-top: 1rem;
  padding: 0.75rem;

  border-radius: 0.65rem;

  background: #fff8e1;

  color: #664d03;
  font-size: 0.85rem;
}

.sub-cancel-button {
  min-height: 48px;
  border-radius: 0.75rem;
  font-weight: 600;
}

@media (max-width: 575.98px) {
  .sub-modal-overlay {
    align-items: flex-end;
  }

  .sub-modal-box {
    max-width: none;
    max-height: 88vh;

    border-radius: 1rem 1rem 0 0;

    padding-bottom: calc(
      1.25rem + env(safe-area-inset-bottom)
    );
  }

  .sub-player-option {
    min-height: 60px;
  }

  .sub-player-option-name {
    font-size: 1.05rem;
  }
}
</style>
