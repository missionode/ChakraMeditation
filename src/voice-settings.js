export const VOICE_STORAGE_KEY = 'chakra_voice_settings';

export const DEFAULT_VOICE_SETTINGS = {
    voiceName: '',
    rate: 0.7,
    pitch: 1.0,
    volume: 1.0
};

export function getStoredVoiceSettings() {
    if (typeof localStorage === 'undefined') return DEFAULT_VOICE_SETTINGS;
    const stored = localStorage.getItem(VOICE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_VOICE_SETTINGS;
}

export function saveVoiceSettings(settings) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(settings));
}

export function resetVoiceSettings() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(VOICE_STORAGE_KEY);
}
