import { Capacitor } from '@capacitor/core';

const IOS_APP_ID    = '6804800516';
const ANDROID_APP_ID = 'com.pickleballteamflow.app';
const PROMPT_KEY     = 'ptf.ratePrompt.v1';   // stored value: 'rated' | 'declined' | number (games completed)

function storeGet() {
  try { return localStorage.getItem(PROMPT_KEY); } catch { return null; }
}

function storeSet(value) {
  try { localStorage.setItem(PROMPT_KEY, value); } catch { /* ignore */ }
}

/** Open the platform-appropriate store review page. */
export function openRateApp() {
  const platform = Capacitor.getPlatform();
  let url;

  if (platform === 'ios') {
    url = `https://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`;
  } else if (platform === 'android') {
    url = `https://play.google.com/store/apps/details?id=${ANDROID_APP_ID}&showAllReviews=true`;
  } else {
    url = `https://apps.apple.com/app/id${IOS_APP_ID}`;
  }

  window.open(url, '_system', 'noreferrer');
}

/**
 * Called each time the user completes a full game (all rounds done).
 * Returns true when the prompt should be shown.
 * Shows on the 1st completion, then suppresses until the user acts.
 */
export function recordGameCompleted() {
  const state = storeGet();
  if (state === 'rated' || state === 'declined') return false;

  const count = parseInt(state, 10) || 0;
  const next = count + 1;
  storeSet(String(next));

  // Prompt on 1st completion, then every 5th after that if they kept picking "Later".
  return next === 1 || next % 5 === 0;
}

/** User tapped "Rate Now" — suppress future prompts. */
export function markRated() {
  storeSet('rated');
}

/** User tapped "No Thanks" — suppress future prompts. */
export function markDeclined() {
  storeSet('declined');
}
// "Maybe Later" leaves the counter in place so the next milestone can fire.
