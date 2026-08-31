<template>
  <div>
    <h1 class="text-center text-body mb-4 page-title">🏓Pickleball Court Assignments</h1>
    
    <div>
      <div class="row">
        <div class="col">
          <div class="form-floating">
            <textarea 
              class="form-control auto-resize-textarea mb-3" 
              v-model="namesText" 
              placeholder="Alice&#10;Bob&#10;Charlie" 
              id="peopleNames" 
              style="height: 100px;"
            ></textarea>
            <label for="peopleNames">Roster</label>
          </div>
          <div class="mb-3">
            <input 
              type="file" 
              ref="imageInput" 
              @change="handleImageUpload" 
              accept="image/*" 
              capture="environment"
              style="display: none;"
            />
            <button class="btn btn-outline-primary btn-sm" @click="$refs.imageInput.click()" :disabled="isProcessing">
              📷 {{ isProcessing ? 'Processing...' : 'Scan Names from Photo' }}
            </button>
            <div v-if="ocrProgress" class="small text-secondary mt-1">{{ ocrProgress }}</div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-12 col-sm-6">
          <div class="form-floating">
            <select class="form-select form-control mb-3" id="courts" v-model="courtCount" aria-label="Court(s)">
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
            <label for="courts">Court(s)</label>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="form-floating">
            <select class="form-select form-control mb-3" id="numRounds" v-model="roundCount" aria-label="Round(s)">
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
            <label for="numRounds">Round(s)</label>
          </div>
        </div>
      </div>

     <div class="row g-2 mt-1">
  <div class="col-12 col-md">
    <div class="d-grid d-sm-flex gap-2">
      <button
        class="btn btn-secondary"
        @click="clearAll()"
      >
        🗑️ Clear Results
      </button>

      <button
        v-if="schedule.length && hasOpenRounds"
        class="btn btn-warning"
        @click="regenerateRemaining()"
      >
        🔄 Regenerate Open Rounds
      </button>
    </div>
  </div>

  <div class="col-12 col-md-auto">
    <div class="d-grid">
      <button
        class="btn btn-primary"
        @click="generate()"
      >
       🏓 Generate Court Assignments
      </button>
    </div>
  </div>
</div>
    
    <div class="small text-secondary mt-2">
      Capacity: {{ courtCount * 4 }} &middot; Active Players: {{ players.length }}
    </div>
    
    <div id="message" class="mt-3"></div>
    
    <div class="mt-3 d-flex align-items-center gap-2">
      <h2 class="h5 m-0">Court Assignments</h2>
      <span v-if="schedule.length" class="small text-secondary">
        {{ schedule.length }} round{{ schedule.length===1?'':'s' }} generated
      </span>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="form-check form-check-inline">
          <input class="form-check-input small" type="checkbox" id="showNumbers" v-model="showNumbers">
          <label class="form-check-label small" for="showNumbers">Show player numbers</label>
        </div>
      </div>
    </div>

    <div v-if="!schedule.length" class="card card-rounded shadow-sm mt-2 p-4 text-center text-secondary border border-dashed">
      Enter at least <strong>8 players</strong> and click <em>Generate</em> to see court assignments here.
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
        console.log('OCR Result:', text);
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
        this.showMessage('Failed to process image. Please try again.', 'alert alert-danger');
      } finally {
        this.isProcessing = false;
        this.ocrProgress = '';
        // Reset file input
        event.target.value = '';
      }
    },
    generate() {
      if (!this.players || this.players.length < 8 || this.players.length > 24) {
        this.showMessage('Please enter between 8 - 24 people names.');
        return;
      }

      if (!this.courtCount || this.courtCount < 1) {
        this.showMessage('Please enter a valid number of maximum courts (at least 1).');
        return;
      }

      if (!this.roundCount || this.roundCount < 1) {
        this.showMessage('Please enter a valid number of rounds (at least 1).');
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

      this.showMessage('Successfully generated ' + this.roundCount + ' rounds of randomized groups!', 'alert alert-success');
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
      this.showMessage('Successfully regenerated open rounds with current roster!', 'alert alert-success');
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
}
.sub-modal-box {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 360px;
  width: 90%;
}
</style>
