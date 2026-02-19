import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChakraGuidance } from '../src/chakra-guidance';

describe('ChakraGuidance', () => {
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
        volume: 1.0
      };
      utterances.push(u);
      return u;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [{ name: 'Veena', lang: 'en-IN' }]),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should use moderate pauses (1.2s) between phrases', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    utterances[0].onend();
    
    vi.advanceTimersByTime(1000);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(200);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });

  it('should trigger final callback after 1.5s transition pause', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    const phrases = guidance.constructPhrases(chakra);
    
    guidance.speakChakra(chakra, onEnd);

    for(let i = 0; i < phrases.length; i++) {
        utterances[i].onend();
        vi.advanceTimersByTime(1200);
    }

    expect(onEnd).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1500);
    expect(onEnd).toHaveBeenCalled();
  });
});
