/**
 * MeditationSessionManager - Lite Version
 * Manages the flow of a chakra meditation session, including guidance,
 * meditation phases, and transitions between chakras.
 */
export class MeditationSessionManager {
  constructor(chakras, guidance, timer, localizedContent = null) {
    this.chakras = chakras;
    this.guidance = guidance;
    this.timer = timer;
    this.localizedContent = localizedContent;
    this.currentIndex = 0;
    this.status = 'idle'; // idle, guidance, meditating, completed
    this.onComplete = null;
    this.onChakraChange = null; // Callback for UI updates
    this.transitionTimeout = null;
  }

  /**
   * Starts a new meditation session from the first chakra.
   */
  startSession() {
    this.stop(); 
    this.currentIndex = 0;
    this._processCurrentChakra();
  }

  /**
   * Internal method to handle the guidance phase of the current chakra.
   */
  _processCurrentChakra() {
    if (this.currentIndex >= this.chakras.length) {
      this.status = 'completed';
      if (this.onComplete) this.onComplete();
      return;
    }

    const currentChakra = this.chakras[this.currentIndex];
    this.status = 'guidance';
    
    // Notify UI that a new chakra guidance phase has started
    if (this.onChakraChange) {
        this.onChakraChange(currentChakra, this.currentIndex);
    }

    // Trigger the voice guidance using localized JSON content
    this.guidance.speakChakra(currentChakra, () => {
      this._startMeditation(currentChakra);
    }, this.localizedContent);
  }

  /**
   * Internal method to handle the actual meditation (drone/timer) phase.
   */
  _startMeditation(chakra) {
    this.status = 'meditating';
    
    // Duration is provided by the chakra object (pre-calculated in main.js)
    const duration = chakra.timerDuration || 1; 

    this.timer.start(
      duration,
      (remaining) => {
        // UI tick is handled by the timer wrapper in main.js
      },
      () => {
        this._moveToNext();
      }
    );
  }

  /**
   * Handles the transition gap between chakras.
   */
  _moveToNext() {
    this.currentIndex++;
    if (this.currentIndex >= this.chakras.length) {
        this.status = 'completed';
        if (this.onComplete) this.onComplete();
        return;
    }

    this.status = 'transition';
    
    // Notify UI to show transition state
    if (this.onChakraChange) {
        this.onChakraChange(this.chakras[this.currentIndex], this.currentIndex, true);
    }
    
    // 5-second preparation gap before the next chakra guidance starts
    this.transitionTimeout = setTimeout(() => {
        this._processCurrentChakra();
    }, 5000);
  }

  /**
   * Stops the current session and clears all active timers and speech.
   */
  stop() {
    if (this.guidance) this.guidance.cancel();
    if (this.timer && typeof this.timer.stop === 'function') {
        this.timer.stop();
    }
    if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
        this.transitionTimeout = null;
    }
    this.status = 'idle';
  }
}
