<template>
  <div>
    <h1 class="text-center mb-4 page-title">About Pickleball Team Flow</h1>

    <div class="card shadow-sm">
      <div class="card-body p-3 p-sm-4">
        <h5 class="card-title">Pickleball Team Flow</h5>
        <p class="text-muted mb-4">
          Quickly create fair pickleball court assignments across multiple courts and rounds.
          Pickleball Team Flow helps rotate players, vary partners and opponents, and distribute
          sit-out periods as evenly as possible.
        </p>

        <h5 class="card-title mt-4">How to Use</h5>
        <ol class="mb-4 ps-3 ps-sm-4">
          <li class="mb-2">
            <strong>Add your players.</strong>
            Enter one player name per line in the Player Roster, or use
            <em>Scan Names from Photo</em> to capture a list with your camera.
          </li>
          <li class="mb-2">
            <strong>Choose your courts and rounds.</strong>
            Select the number of available courts and how many rounds you want to generate.
          </li>
          <li class="mb-2">
            <strong>Generate court assignments.</strong>
            Tap <em>Generate Court Assignments</em> to create the schedule.
          </li>
          <li class="mb-2">
            <strong>Play each round.</strong>
            Players are assigned to courts, while any players not needed for that round appear
            in the Sit Out section.
          </li>
          <li class="mb-2">
            <strong>Make substitutions when needed.</strong>
            In an open round, tap a player on a court to swap them with a player who is sitting out.
          </li>
          <li>
            <strong>Close completed rounds.</strong>
            Close a round once it is finished. If your player roster changes, you can regenerate
            the remaining open rounds without changing completed rounds.
          </li>
        </ol>

        <div class="alert alert-light border mb-4">
          <strong>Tip:</strong>
          The app works best with 8–24 players. Each court supports four active players.
          If there are more players than available court positions, the remaining players
          will rotate through sit-out periods.
        </div>

        <h5 class="card-title mt-4">Features</h5>
        <ul class="mb-4 ps-3 ps-sm-4">
          <li>Smart player rotation designed to reduce repeat partnerships</li>
          <li>Varied opponents across rounds</li>
          <li>Fair distribution of sit-out periods</li>
          <li>Support for 2–12 courts and multiple rounds</li>
          <li>Player substitutions during open rounds</li>
          <li>Regeneration of remaining rounds when the roster changes</li>
          <li>Optional player numbers for easier court organization</li>
          <li>Camera-assisted player-name entry</li>
        </ul>

        <h5 class="card-title mt-4">Development Team</h5>
        <div class="mb-4">
          <div class="row g-1 mb-3">
            <div class="col-12 col-sm-4 col-md-3 fw-bold">Developer:</div>
            <div class="col-12 col-sm-8 col-md-9">
              Marco Rodriguez
              <a
                href="https://www.linkedin.com/in/marco-rodriguez59"
                target="_blank"
                rel="noopener noreferrer"
                class="ms-2"
                aria-label="Marco Rodriguez on LinkedIn"
              >
                <i class="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div class="row g-1">
            <div class="col-12 col-sm-4 col-md-3 fw-bold">Project Manager:</div>
            <div class="col-12 col-sm-8 col-md-9">
              Andrea Nigels
              <a
                href="https://www.linkedin.com/in/andrea-nigels"
                target="_blank"
                rel="noopener noreferrer"
                class="ms-2"
                aria-label="Andrea Nigels on LinkedIn"
              >
                <i class="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <hr>

        <div class="d-flex flex-column flex-sm-row justify-content-between gap-1 text-secondary">
          <small>Version 3.0</small>
          <small>© 2026 Pickleball Team Flow. All rights reserved.</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
};
</script>

<style scoped>
.page-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}

li {
  line-height: 1.5;
}
</style>
