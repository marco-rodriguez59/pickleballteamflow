<template>
  <div class="about-page">
    <section class="about-section mb-4">
      <div class="page-heading text-center mb-4">
        <div class="section-eyebrow">
          PICKLEBALL TEAM FLOW
        </div>

        <h1 class="page-title mb-2">
          About Pickleball Team Flow
        </h1>

        <p class="page-subtitle text-secondary mb-0">
          Fair court assignments across multiple courts and rounds.
        </p>
      </div>

      <ion-card class="about-card">
        <ion-card-content class="about-card-content">
          <div class="about-block">
            <h2 class="about-heading">
              Pickleball Team Flow
            </h2>

            <p class="about-text">
              Quickly create fair pickleball court assignments across
              multiple courts and rounds. Pickleball Team Flow helps
              rotate players, vary partners and opponents, and distribute
              sit-out periods as evenly as possible.
            </p>
          </div>

          <div class="about-block">
            <h2 class="about-heading">
              How to Use
            </h2>

            <ol class="about-list">
              <li>
                <strong>Add your players.</strong>
                Enter one player name per line in the Player Roster, or use
                <em>Scan Names from Photo</em> to capture a list with your camera.
              </li>
              <li>
                <strong>Choose your courts and rounds.</strong>
                Select the number of available courts and how many rounds you want to generate.
              </li>
              <li>
                <strong>Generate court assignments.</strong>
                Tap <em>Generate Court Assignments</em> to create the schedule.
              </li>
              <li>
                <strong>Play each round.</strong>
                Players are assigned to courts, while any players not needed for that round appear
                in the Sit Out section.
              </li>
              <li>
                <strong>Make substitutions when needed.</strong>
                In an open round, tap a player on a court to swap them with a player who is sitting out.
              </li>
              <li>
                <strong>Close completed rounds.</strong>
                Close a round once it is finished. If your player roster changes, you can regenerate
                the remaining open rounds without changing completed rounds.
              </li>
            </ol>
          </div>

          <div class="about-tip">
            <ion-icon
              :icon="bulbOutline"
              aria-hidden="true"
            />

            <span>
              <strong>Tip:</strong>
              The app works best with 8–24 players. Each court supports four active players.
              If there are more players than available court positions, the remaining players
              will rotate through sit-out periods.
            </span>
          </div>

          <div class="about-block">
            <h2 class="about-heading">
              Features
            </h2>

            <ul class="about-list">
              <li>Smart player rotation designed to reduce repeat partnerships</li>
              <li>Varied opponents across rounds</li>
              <li>Fair distribution of sit-out periods</li>
              <li>Support for 2–12 courts and multiple rounds</li>
              <li>Player substitutions during open rounds</li>
              <li>Regeneration of remaining rounds when the roster changes</li>
              <li>Optional player numbers for easier court organization</li>
              <li>Camera-assisted player-name entry</li>
            </ul>
          </div>

          <div class="about-block">
            <h2 class="about-heading">
              Privacy
            </h2>

            <p class="about-text">
              Pickleball Team Flow does not require an account. Player names and photos
              used for name scanning are processed within the app and are not uploaded
              to a Pickleball Team Flow server. Photos are used only to recognize player
              names and are not stored by Pickleball Team Flow.
            </p>

            <a
              href="https://marco-rodriguez59.github.io/pickleballteamflow/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              class="about-link"
            >
              View Privacy Policy
            </a>
          </div>

          <div class="about-block">
            <h2 class="about-heading">
              Support
            </h2>

            <p class="about-text">
              Need help or have feedback? Visit our support page for assistance,
              troubleshooting, and contact information.
            </p>

            <a
              href="https://marco-rodriguez59.github.io/pickleballteamflow/support.html"
              target="_blank"
              rel="noopener noreferrer"
              class="about-link"
            >
              Visit Support
            </a>
          </div>

          <div class="about-block">
            <h2 class="about-heading">
              Development Team
            </h2>

            <div class="about-team-row">
              <div class="about-team-role">
                Developer:
              </div>

              <div class="about-team-name">
                Marco Rodriguez

                <a
                  href="https://www.linkedin.com/in/marco-rodriguez59"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="about-linkedin"
                  aria-label="Marco Rodriguez on LinkedIn"
                >
                  <ion-icon :icon="logoLinkedin" />
                </a>
              </div>
            </div>

            <div class="about-team-row">
              <div class="about-team-role">
                Project Manager:
              </div>

              <div class="about-team-name">
                Andrea Nigels

                <a
                  href="https://www.linkedin.com/in/andrea-nigels"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="about-linkedin"
                  aria-label="Andrea Nigels on LinkedIn"
                >
                  <ion-icon :icon="logoLinkedin" />
                </a>
              </div>
            </div>
          </div>

          <div class="about-footer">
            <small>Version {{ appVersion }}</small>
            <small>© 2026 Pickleball Team Flow. All rights reserved.</small>
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
  IonIcon
} from '@ionic/vue';

import {
  bulbOutline,
  logoLinkedin
} from 'ionicons/icons';

export default {
  name: 'About',

  components: {
    IonCard,
    IonCardContent,
    IonIcon
  },

  setup() {
    return {
      bulbOutline,
      logoLinkedin
    };
  },

  data() {
    return {
      appVersion: __APP_VERSION__
    };
  }
};
</script>

<style scoped>
.about-page {
  width: 100%;
  min-width: 0;
}

.about-page *,
.about-page *::before,
.about-page *::after {
  box-sizing: border-box;
}

.section-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  color: #198754;
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

.about-card {
  width: 100%;
  margin: 0;

  border-radius: 1rem;

  background: #ffffff;

  box-shadow:
    0 3px 14px
    rgba(0, 0, 0, 0.08);
}

.about-card-content {
  padding: 1.5rem;
}

.about-block {
  margin-bottom: 1.75rem;
}

.about-block:last-of-type {
  margin-bottom: 0;
}

.about-heading {
  margin: 0 0 0.75rem;

  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2d23;
}

.about-text {
  margin: 0 0 0.75rem;

  font-size: 0.95rem;
  line-height: 1.6;
  color: #6c757d;
}

.about-text:last-child {
  margin-bottom: 0;
}

.about-list {
  margin: 0;
  padding-left: 1.25rem;
}

.about-list li {
  margin-bottom: 0.6rem;

  font-size: 0.95rem;
  line-height: 1.55;
  color: #495057;
}

.about-list li:last-child {
  margin-bottom: 0;
}

.about-list strong {
  color: #1f2d23;
}

.about-tip {
  display: flex;
  align-items: flex-start;

  gap: 0.6rem;

  margin-bottom: 1.75rem;
  padding: 1rem;

  border-radius: 0.75rem;

  background: #e9f7ef;
  color: #1f2d23;

  font-size: 0.92rem;
  line-height: 1.5;
}

.about-tip ion-icon {
  flex-shrink: 0;

  margin-top: 0.1rem;

  font-size: 1.25rem;
  color: #0e4b2e;
}

.about-link {
  display: inline-block;

  font-size: 0.95rem;
  font-weight: 600;
  color: #198754;
  text-decoration: none;
}

.about-link:hover,
.about-link:focus {
  color: #0e4b2e;
  text-decoration: underline;
}

.about-team-row {
  display: flex;
  flex-wrap: wrap;

  gap: 0.25rem 0.75rem;

  margin-bottom: 0.75rem;
}

.about-team-row:last-child {
  margin-bottom: 0;
}

.about-team-role {
  font-weight: 700;
  color: #1f2d23;
}

.about-team-name {
  display: inline-flex;
  align-items: center;

  gap: 0.4rem;

  color: #495057;
}

.about-linkedin {
  display: inline-flex;
  align-items: center;

  color: #0a66c2;
}

.about-linkedin ion-icon {
  font-size: 1.15rem;
}

.about-footer {
  display: flex;
  flex-direction: column;

  gap: 0.25rem;

  margin-top: 1.75rem;
  padding-top: 1.25rem;

  border-top:
    1px solid #dee2e6;

  color: #6c757d;
}

@media (min-width: 576px) {
  .about-footer {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
