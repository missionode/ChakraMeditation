import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MeditationSessionManager } from '../src/meditation-session-manager';

describe('MeditationSessionManager', () => {
  let manager;
  let mockGuidance;
  let mockTimer;
  let chakras;

  beforeEach(() => {
    chakras = [
      { name: 'Root', audio: 'audio/Lam.aac', timerDuration: 1 },
      { name: 'Sacral', audio: 'audio/Vam.aac', timerDuration: 1 }
    ];

    mockGuidance = {
      speakChakra: vi.fn((chakra, callback) => {
        // We will trigger the callback manually in tests to simulate async behavior
        this.lastCallback = callback;
      }),
      cancel: vi.fn()
    };

    mockTimer = {
      start: vi.fn((duration, onTick, onEnd) => {
        this.lastOnEnd = onEnd;
      })
    };

    manager = new MeditationSessionManager(chakras, mockGuidance, mockTimer);
  });

  it('should advance through chakras sequentially', () => {
    manager.startSession();
    
    // 1. Root Guidance starts
    expect(mockGuidance.speakChakra).toHaveBeenCalledWith(chakras[0], expect.any(Function));
    
    // 2. Root Guidance finishes
    const rootGuidanceCallback = mockGuidance.speakChakra.mock.calls[0][1];
    rootGuidanceCallback();
    
    // 3. Root Meditation starts
    expect(manager.status).toBe('meditating');
    expect(mockTimer.start).toHaveBeenCalledWith(1, expect.any(Function), expect.any(Function));
    
    // 4. Root Meditation finishes (bell rings in reality)
    const rootTimerEnd = mockTimer.start.mock.calls[0][2];
    rootTimerEnd();
    
    // 5. Sacral Guidance starts automatically
    expect(mockGuidance.speakChakra).toHaveBeenCalledTimes(2);
    expect(mockGuidance.speakChakra).toHaveBeenLastCalledWith(chakras[1], expect.any(Function));
  });
});
