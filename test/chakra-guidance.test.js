import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
      pitch: 1.0,
      voice: null
    };
    
    global.SpeechSynthesisUtterance = function(text) {
      mockUtterance.text = text;
      return mockUtterance;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Veena', lang: 'en-IN' },
        { name: 'Alex', lang: 'en-US' }
      ]),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should select an Indian voice if available', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(mockUtterance.voice.name).toBe('Veena');
  });

  it('should set a calm rate and sweet pitch', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(mockUtterance.rate).toBeLessThan(1.0);
    expect(mockUtterance.pitch).toBeGreaterThan(1.0);
  });

  it('should trigger a callback after a 2-second pause when narration ends', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    
    guidance.speakChakra(chakra, onEnd);
    mockUtterance.onend();
    
    expect(onEnd).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(onEnd).toHaveBeenCalled();
  });
});
