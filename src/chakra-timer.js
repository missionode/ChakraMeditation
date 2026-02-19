export class ChakraTimer {
  constructor() {
    this.interval = null;
  }

  /**
   * Starts a timer for the given duration.
   * @param {number} durationInMinutes 
   * @param {function} onTick (remainingSeconds)
   * @param {function} onEnd 
   */
  start(durationInMinutes, onTick, onEnd) {
    this.stop();

    let timer = Math.round(durationInMinutes * 60);
    
    // Play initial bell
    this._playBell();

    this.interval = setInterval(() => {
      if (onTick) onTick(timer);

      if (--timer < 0) {
        this.stop();
        this._playBell();
        if (onEnd) onEnd();
      }

      // Signal "5 seconds left" if needed (legacy behavior)
      if (timer === 5) {
        this._playBell();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  _playBell() {
    const audio = document.getElementById("beep-sound");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play blocked:", e));
    }
  }
}
