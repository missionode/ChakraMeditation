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
      voice: null,
      volume: 1.0
    };
    
    global.SpeechSynthesisUtterance = function(text) {
      mockUtterance.text = text;
      return mockUtterance;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Veena', lang: 'en-IN' }
      ]),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should construct slow meditative text for a chakra', () => {
    const chakra = {
      name: 'Root Chakra',
      mantra: 'Lam',
      location: 'Base of spine',
      feature: 'Stability',
      element: 'Earth',
      description: 'Foundation of our being.'
    };

    const text = guidance.constructText(chakra);
    expect(text).toContain('Now. . . Focus on your Root Chakra');
    // Check for pause markers
    expect(text).toMatch(/\. \. \. \./);
  });

  it('should set very slow meditative rate', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(mockUtterance.rate).toBeCloseTo(0.65);
  });

  it('should trigger callback after 2s pause', () => {
    const onEnd = vi.fn();
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    
    guidance.speakChakra(chakra, onEnd);
    mockUtterance.onend();
    
    vi.advanceTimersByTime(2000);
    expect(onEnd).toHaveBeenCalled();
  });
});
