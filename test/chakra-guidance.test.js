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

  it('should set extremely slow rate and low pitch', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].rate).toBe(0.4);
    expect(utterances[0].pitch).toBe(0.9);
  });

  it('should use long meditative pauses (3s) between phrases', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    utterances[0].onend();
    
    vi.advanceTimersByTime(2500);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(500);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });

  it('should trigger final callback after 3s transition pause', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    const phrases = guidance.constructPhrases(chakra);
    
    guidance.speakChakra(chakra, onEnd);

    for(let i = 0; i < phrases.length; i++) {
        utterances[i].onend();
        vi.advanceTimersByTime(3000);
    }

    expect(onEnd).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onEnd).toHaveBeenCalled();
  });
});
