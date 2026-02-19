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

  it('should split guidance into multiple phrases', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    const phrases = guidance.constructPhrases(chakra);
    expect(phrases.length).toBeGreaterThan(3);
    expect(phrases[0]).toContain('Focus on your Root');
  });

  it('should speak phrases sequentially with pauses', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    
    guidance.speakChakra(chakra, onEnd);
    
    // First phrase spoken
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    expect(utterances[0].rate).toBe(0.5);

    // End first phrase
    utterances[0].onend();
    
    // Should NOT speak next phrase yet (needs 1.5s pause)
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(1500);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });

  it('should trigger final callback after all phrases and transition pause', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    const phrases = guidance.constructPhrases(chakra);
    
    guidance.speakChakra(chakra, onEnd);

    // Simulate completion of all phrases
    for(let i = 0; i < phrases.length; i++) {
        utterances[i].onend();
        vi.advanceTimersByTime(1500);
    }

    // After last phrase, needs 2s transition pause
    expect(onEnd).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(onEnd).toHaveBeenCalled();
  });
});
