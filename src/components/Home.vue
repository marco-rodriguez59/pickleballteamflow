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
    
    <div class="mt-3 d-flex flex-column flex-sm-row align-items-sm-center gap-1 gap-sm-2">
      <h2 class="h5 m-0">Court Assignments</h2>
      <span v-if="schedule.length" class="small text-secondary">
        {{ schedule.length }} round{{ schedule.length===1?'':'s' }} generated
      </span>
    </div>
    
    <div class="row mt-2">
      <div class="col">
        <div class="form-check form-check-inline">
          <input class="form-check-input small" type="checkbox" id="showNumbers" v-model="showNumbers">
          <label class="form-check-label small" for="showNumbers">Show player numbers</label>
        </div>
      </div>
    </div>

    <div v-if="!schedule.length" class="card card-rounded shadow-sm mt-2 p-4 text-center text-secondary border border-dashed">
      Enter at least <strong>8 players</strong> and select <em>Generate Court Assignments</em> to get started.
    </div>

    <div class="round" v-if="schedule.length > 0">
      <div class="row">
        <div class="col-md-6" v-show="!round.closed" v-for="round in schedule" :key="round.index">
          <div class="card card-rounded shadow-sm mb-3">
            <div class="card-header round-header" :class="{closed: round.closed}">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="m-0">Round {{ round.index }}</h3>
                <button 
                  class="btn btn-sm btn-close-round" 
                  :class="round.closed ? 'btn-outline-secondary' : 'btn-success'"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#round-' + round.index"
                  @click="toggleRoundClosed(round)"
                >
                  {{ round.closed ? '↻ Reopen' : '✓ Close' }}
                </button>
              </div>
            </div>
            <div :id="'round-' + round.index" class="collapse" :class="{show: !round.closed}">
              <div class="card-body">
                <div class="groups-container" v-for="court in round.courts" :key="court.courtNumber">
                  <div class="group regular">
                    <h4>Court {{ court.courtNumber }}</h4>
                    <div class="card">
                      <div class="card-body">
                        <ul>
                          <li
                            v-for="player in court.players"
                            :key="player.id"
                            :class="{ 'clickable-player': !round.closed && round.sitOut.length > 0 }"
                            :title="!round.closed && round.sitOut.length > 0 ? 'Click to sub out ' + player.name : ''"
                            @click="!round.closed && round.sitOut.length > 0 && openSubModal(round, court, player)"
                          >
                            {{ showNumbers ? '(' + player.id + ') ' : '' }}{{ player.name }}
                            <span v-if="!round.closed && round.sitOut.length > 0" class="sub-out-badge">↕</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="round.courts.length < courtCount" class="alert alert-light border mt-3">
                  {{ courtCount - round.courts.length }} court(s) idle this round.
                </div>
                <div v-if="round.sitOut.length" class="bg-warning-subtle mt-3 p-3">
                  <h4>Sit Out</h4>
                  <div>
                    <span v-for="(player, index) in round.sitOut" :key="player.id">
                      {{ showNumbers ? '(' + player.id + ') ' : '' }}{{ player.name }}<span v-if="index < round.sitOut.length - 1">, </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sub-out modal -->
    <div v-if="subModal.show" class="sub-modal-overlay" @click.self="closeSubModal">
      <div class="sub-modal-box shadow-lg">
        <h5 class="mb-3">Sub Out Player</h5>
        <p class="mb-3">
          Select a <strong>Sit Out</strong> player to replace
          <strong>{{ subModal.player?.name }}</strong> on Court {{ subModal.court?.courtNumber }}:
        </p>
        <ul class="list-group mb-3">
          <li
            v-for="p in subModal.round.sitOut"
            :key="p.id"
            class="list-group-item list-group-item-action"
            style="cursor: pointer;"
            @click="confirmSubstitution(p)"
          >
            {{ showNumbers ? '(' + p.id + ') ' : '' }}{{ p.name }}
          </li>
        </ul>
           <button class="btn btn-secondary btn-sm" @click="closeSubModal">Cancel</button>
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
</style>
