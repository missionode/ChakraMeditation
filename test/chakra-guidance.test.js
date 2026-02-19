import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChakraGuidance } from '../src/chakra-guidance';

describe('ChakraGuidance Voice Sync', () => {
  let guidance;
  let mockSpeechSynthesis;
  let utterances;

  beforeEach(() => {
    vi.useFakeTimers();
    utterances = [];
    
    global.SpeechSynthesisUtterance = function(text) {
      const u = {
        text: text,
        onend: null,
        rate: 1.0,
        pitch: 1.0,
        voice: null,
        lang: '',
        volume: 1.0
      };
      utterances.push(u);
      return u;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Lekha', lang: 'hi-IN' }
      ]),
      pending: false,
      speaking: false
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should match utterance lang to the selected voice lang (e.g. hi-IN for Lekha)', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].voice.name).toBe('Lekha');
    expect(utterances[0].lang).toBe('hi-IN');
  });

  it('should use en-IN fallback if no voice is selected', () => {
    mockSpeechSynthesis.getVoices = vi.fn(() => []);
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].lang).toBe('en-IN');
  });
});
