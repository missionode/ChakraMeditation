import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredVoiceSettings, saveVoiceSettings, resetVoiceSettings, DEFAULT_VOICE_SETTINGS } from '../src/voice-settings';

describe('Voice Settings Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default settings when nothing is stored', () => {
    const settings = getStoredVoiceSettings();
    expect(settings).toEqual(DEFAULT_VOICE_SETTINGS);
  });

  it('should save and retrieve custom settings', () => {
    const custom = {
      voiceName: 'Lekha',
      rate: 0.8,
      pitch: 1.2,
      volume: 1.0
    };
    saveVoiceSettings(custom);
    
    const retrieved = getStoredVoiceSettings();
    expect(retrieved).toEqual(custom);
  });

  it('should reset to defaults', () => {
    const custom = { voiceName: 'Lekha', rate: 0.8, pitch: 1.2, volume: 1.0 };
    saveVoiceSettings(custom);
    resetVoiceSettings();
    
    expect(getStoredVoiceSettings()).toEqual(DEFAULT_VOICE_SETTINGS);
  });
});
