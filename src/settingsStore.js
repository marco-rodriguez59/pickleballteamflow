import { reactive } from 'vue';

const STORAGE_KEY = 'pickleball-team-flow.settings.v1';

function loadSettings() {
  const defaults = {
    courtView: 'list',
    showNumbers: true
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw);

    return {
      courtView:
        parsed.courtView === 'vs'
          ? 'vs'
          : 'list',
      showNumbers:
        typeof parsed.showNumbers === 'boolean'
          ? parsed.showNumbers
          : true
    };
  } catch {
    return defaults;
  }
}

export const settings = reactive(loadSettings());

function persistSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      courtView: settings.courtView,
      showNumbers: settings.showNumbers
    })
  );
}

export function setCourtView(value) {
  settings.courtView =
    value === 'vs'
      ? 'vs'
      : 'list';

  persistSettings();
}

export function setShowNumbers(value) {
  settings.showNumbers = Boolean(value);
  persistSettings();
}
