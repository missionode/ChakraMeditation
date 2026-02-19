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
      getVoices: vi.fn(() => [{ name: 'Lekha', lang: 'hi-IN' }]),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should construct clear text phrases with meditative phrasing', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    const phrases = guidance.constructPhrases(chakra);
    expect(phrases[0]).toBe('Gently, focus your attention, on your, Root.');
  });

  it('should set the optimized meditative rate (0.72)', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].rate).toBe(0.72);
  });

  it('should use optimized meditative pauses (1.5s) between phrases', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    utterances[0].onend();
    
    vi.advanceTimersByTime(1400);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(200);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });
});
