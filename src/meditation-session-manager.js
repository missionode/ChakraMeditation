export class MeditationSessionManager {
  constructor(chakras, guidance, timer) {
    this.chakras = chakras;
    this.guidance = guidance;
    this.timer = timer;
    this.currentIndex = 0;
    this.status = 'idle'; // idle, guidance, meditating, completed
    this.onComplete = null;
    this.onChakraChange = null; // Callback for UI updates
  }

  startSession() {
    this.currentIndex = 0;
    this._processCurrentChakra();
  }

  _processCurrentChakra() {
    if (this.currentIndex >= this.chakras.length) {
      this.status = 'completed';
      if (this.onComplete) this.onComplete();
      return;
    }

    const currentChakra = this.chakras[this.currentIndex];
    this.status = 'guidance';
    
    if (this.onChakraChange) {
        this.onChakraChange(currentChakra, this.currentIndex);
    }

    this.guidance.speakChakra(currentChakra, () => {
      this._startMeditation(currentChakra);
    });
  }

  _startMeditation(chakra) {
    this.status = 'meditating';
    
    // Duration is provided by the chakra object (calculated earlier)
    const duration = chakra.timerDuration || 1; 

    this.timer.start(
      duration,
      (remaining) => {
        // Handle tick if needed
      },
      () => {
        this._moveToNext();
      }
    );
  }

  _moveToNext() {
    this.currentIndex++;
    this._processCurrentChakra();
  }

  stop() {
    this.guidance.cancel();
    // this.timer.stop(); // Assuming stop exists
    this.status = 'idle';
  }
}
