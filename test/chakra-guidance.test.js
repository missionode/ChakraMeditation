import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChakraGuidance } from '../src/chakra-guidance';

describe('ChakraGuidance', () => {
  let guidance;
  let mockSpeechSynthesis;
  let mockUtterance;

  beforeEach(() => {
    vi.useFakeTimers();
    mockUtterance = {
      text: '',
      onend: null,
      rate: 1.0,
      pitch: 1.0
    };
    
    global.SpeechSynthesisUtterance = function(text) {
      mockUtterance.text = text;
      return mockUtterance;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set a calm rate and pitch', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(mockUtterance.rate).toBeLessThan(1.0);
    expect(mockUtterance.pitch).toBe(1.0);
  });

  it('should trigger a callback after a 2-second pause when narration ends', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    
    guidance.speakChakra(chakra, onEnd);
    
    // Simulate end of speech
    mockUtterance.onend();
    
    // Should NOT have been called yet because of the pause
    expect(onEnd).not.toHaveBeenCalled();

    // Fast-forward 2 seconds
    vi.advanceTimersByTime(2000);
    expect(onEnd).toHaveBeenCalled();
  });
});
