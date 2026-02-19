import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MeditationSessionManager } from '../src/meditation-session-manager';

describe('Guided Meditation Integration', () => {
  let manager;
  let mockGuidance;
  let mockTimer;
  let chakras;

  beforeEach(() => {
    chakras = [
      { name: 'Root', timerDuration: 1 },
      { name: 'Sacral', timerDuration: 1 }
    ];

    mockGuidance = {
      speakChakra: vi.fn((chakra, callback) => {
        if (callback) callback();
      }),
      cancel: vi.fn()
    };

    mockTimer = {
      start: vi.fn((duration, onTick, onEnd) => {
        if (onEnd) onEnd();
      })
    };

    manager = new MeditationSessionManager(chakras, mockGuidance, mockTimer);
  });

  it('should complete a session with multiple chakras', () => {
    const onComplete = vi.fn();
    manager.onComplete = onComplete;

    manager.startSession();

    expect(mockGuidance.speakChakra).toHaveBeenCalledTimes(2);
    expect(mockTimer.start).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenCalled();
    expect(manager.status).toBe('completed');
  });
});
