import { chakras } from './src/chakras.js';
import { calculateTimer, sortChakrasByProgress } from './src/timer-logic.js';
import { ChakraGuidance } from './src/chakra-guidance.js';
import { ChakraTimer } from './src/chakra-timer.js';
import { MeditationSessionManager } from './src/meditation-session-manager.js';

/**
 * Screen Wake Lock Management
 */
class WakeLockManager {
    constructor() {
        this.wakeLock = null;
    }

    async request() {
        if ('wakeLock' in navigator) {
            try {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake Lock active: Screen will not sleep');
                this.wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock released');
                });
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    }

    release() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
        }
    }
}

const wakeLockManager = new WakeLockManager();

// Re-acquire wake lock if page becomes visible again
document.addEventListener('visibilitychange', async () => {
    if (wakeLockManager.wakeLock !== null && document.visibilityState === 'visible') {
        await wakeLockManager.request();
    }
});

function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) menu.classList.toggle('open');
}
window.toggleMenu = toggleMenu;

// tabmenu
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        const content = document.getElementById(tabId);
        if (content) content.classList.add('active');
    });
});

// Initialize Guidance and Timer
const guidance = new ChakraGuidance();
const chakraTimer = new ChakraTimer();

/**
 * Utility to fade in audio
 */
function fadeInAudio(audio, duration = 3000) {
    audio.volume = 0;
    audio.play().catch(e => console.log("Audio play blocked:", e));
    let start = Date.now();
    const interval = setInterval(() => {
        let elapsed = Date.now() - start;
        audio.volume = Math.min(elapsed / duration, 1);
        if (audio.volume >= 1) {
            audio.volume = 1;
            clearInterval(interval);
        }
    }, 100);
}

/**
 * Utility to fade out audio
 */
function fadeOutAudio(audio, duration = 3000, callback) {
    let start = Date.now();
    const startVolume = audio.volume;
    const interval = setInterval(() => {
        let elapsed = Date.now() - start;
        audio.volume = Math.max(startVolume * (1 - elapsed / duration), 0);
        if (audio.volume <= 0) {
            audio.volume = 0;
            clearInterval(interval);
            audio.pause();
            if (callback) callback();
        }
    }, 100);
}

document.getElementById("startSessionBtn").addEventListener("click", function (event) {
  event.preventDefault();
  const btn = event.target;
  const originalText = btn.value;

  // PRIME SPEECH FOR MOBILE: Unlocks TTS by playing silence immediately on tap
  if ('speechSynthesis' in window) {
      const silentUtterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(silentUtterance);
  }
  
  // 1. Preparation Phase: 4-second countdown
  let countdown = 4;
  btn.disabled = true;
  btn.style.backgroundColor = "#ffa500"; 
  
  const countdownInterval = setInterval(() => {
      btn.value = `Prepare yourself... ${countdown}`;
      countdown--;
      
      if (countdown < 0) {
          clearInterval(countdownInterval);
          btn.value = originalText;
          btn.style.backgroundColor = ""; 
          btn.disabled = false;
          runSessionFlow();
      }
  }, 1000);

  async function runSessionFlow() {
    // Request Wake Lock as soon as meditation logic begins
    await wakeLockManager.request();

    const progressValues = Array.from(document.querySelectorAll("input.ival")).map((input) => parseInt(input.value));
    const sortedChakras = sortChakrasByProgress(chakras, progressValues);
    
    sortedChakras.forEach(c => {
        const progress = progressValues[chakras.indexOf(c)];
        c.timerDuration = calculateTimer(progress);
    });

    const chakraCardsContainer = document.getElementById("chakraCards");
    chakraCardsContainer.innerHTML = "";

    const formChakr = document.getElementById('chakraForm');
    if (formChakr) formChakr.style.display = "none";

    sortedChakras.forEach((chakra, index) => {
      const chakraCard = document.createElement("div");
      chakraCard.className = "chakra-card";
      chakraCard.id = `chakra-card-${index}`;
      chakraCard.style.borderTop = "10px solid " + chakra.colorcode;

      chakraCard.innerHTML = `
        <h2 style="color:${chakra.colorcode}">${chakra.name}</h2>
        <div class="figure-container">
        <figure>
          <img class="chakraImage" src="${chakra.image}">
          <figcaption>${chakra.name}</figcaption>
        </figure>
        <figure>
          <img src="${chakra.visualimage}" alt="${chakra.visualname}">
          <figcaption>${chakra.visualname}</figcaption>
          </figure>
        </div>
        <p><strong>Mantra: ${chakra.mantra}</strong></p>
        <p><strong>Location: ${chakra.location}</strong></p>
        <p><strong>Power: ${chakra.feature}</strong></p>
        <p><strong>Element: ${chakra.element}</strong></p>
        <p><strong>Description: ${chakra.description}</strong></p>
        <p>${chakra.associated}</p>
        <div style="margin-top:20px;" class="audio-player-container">
          <audio loop class="mantra-audio" id="audio-${index}" src="${chakra.audio}" preload="auto" 
            onplay="console.log('Successfully playing: ${chakra.audio}')" 
            onerror="alert('Error loading audio for ' + '${chakra.name}' + ': ' + '${chakra.audio}'); console.error('Audio Error:', this.error)">
          </audio>
        </div>
        <div class="timer-display" id="timer-display-${index}">${chakra.timerDuration} Minute Session</div>
      `;
      chakraCardsContainer.appendChild(chakraCard);
    });

    const manager = new MeditationSessionManager(sortedChakras, guidance, chakraTimer);

    manager.onChakraChange = (chakra, index, isTransition) => {
        document.querySelectorAll('.chakra-card').forEach(c => c.classList.remove('active-chakra', 'meditating-now', 'preparing-chakra'));
        const card = document.getElementById(`chakra-card-${index}`);
        if (card) {
            card.classList.add('active-chakra');
            if (isTransition) {
                card.classList.add('preparing-chakra');
                const timerDisplay = document.getElementById(`timer-display-${index}`);
                if (timerDisplay) timerDisplay.innerText = "Preparing... 5s";
            }
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    manager._startMeditation = (chakra) => {
        manager.status = 'meditating';
        const index = manager.currentIndex;
        const audio = document.getElementById(`audio-${index}`);
        const card = document.getElementById(`chakra-card-${index}`);
        
        if (card) card.classList.remove('preparing-chakra');
        if (audio) fadeInAudio(audio, 3000);
        if (card) card.classList.add('meditating-now');

        chakraTimer.start(
            chakra.timerDuration || 1,
            (remaining) => {
                const display = document.getElementById(`timer-display-${index}`);
                if (display) {
                    const mins = Math.floor(remaining / 60);
                    const secs = remaining % 60;
                    display.innerText = `${mins}:${secs.toString().padStart(2, '0')} Remaining`;
                }
            },
            () => {
                if (audio) {
                    fadeOutAudio(audio, 3000, () => {
                        if (card) card.classList.remove('meditating-now');
                        manager._moveToNext();
                    });
                } else {
                    if (card) card.classList.remove('meditating-now');
                    manager._moveToNext();
                }
            }
        );
    };

    manager.onComplete = () => {
        // Release Wake Lock
        wakeLockManager.release();

        document.querySelectorAll('.chakra-card').forEach(c => c.classList.remove('active-chakra', 'meditating-now'));
        
        // Show a nice completion overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(13,1,42,0.9); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#b5e48c; text-align:center; padding:20px;';
        overlay.innerHTML = `
            <h1 style="font-size:2.5rem; margin-bottom:20px;">Journey Complete</h1>
            <p style="font-size:1.2rem; color:white; margin-bottom:30px;">Your energy centers are now aligned and balanced.</p>
            <button id="closeCompleteBtn" style="background:#674aeb; color:white; border:none; padding:15px 40px; border-radius:30px; font-size:1.1rem; cursor:pointer; font-weight:600;">Namaste</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('closeCompleteBtn').onclick = () => {
            overlay.remove();
            const endBtn = document.getElementById('endSessionBtn');
            if (endBtn) endBtn.click();
        };
    };

    manager.startSession();
  }
});

// Lightbox
function openLightbox(imageUrl) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  if (lightbox && lightboxImage) {
    lightboxImage.src = imageUrl;
    lightbox.style.display = 'block';
  }
}
window.openLightbox = openLightbox;

document.addEventListener('DOMContentLoaded', function() {
  var lightbox = document.getElementById('lightbox');
  var closeBtn = document.querySelector('.close-button');
  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });
  }
});

// Energy Level
function SetEnergy(energyvalue) {
  const ranges = document.querySelectorAll(".ival");
  ranges.forEach(range => range.value = energyvalue);
}
window.SetEnergy = SetEnergy;

// Session Timer (Legacy tracking)
document.addEventListener('DOMContentLoaded', () => {
  const startSessionBtn = document.getElementById('startSessionBtn');
  const endSessionBtn = document.getElementById('endSessionBtn');
  const elapsedTimeDisplay = document.getElementById('elapsedTime');

  if (!startSessionBtn || !endSessionBtn) return;

  let startTime = localStorage.getItem('startTime');
  let isSessionActive = localStorage.getItem('isSessionActive') === 'true';
  let timerInterval;

  const updateDisplay = () => {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    elapsedTimeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (startTime && isSessionActive) {
      startTime = parseInt(startTime);
      startSessionBtn.classList.add('hidden');
      endSessionBtn.classList.remove('hidden');
      timerInterval = setInterval(updateDisplay, 1000);
  }

  startSessionBtn.addEventListener('click', () => {
      startTime = Date.now();
      startSessionBtn.classList.add('hidden');
      endSessionBtn.classList.remove('hidden');
      localStorage.setItem('startTime', startTime);
      localStorage.setItem('isSessionActive', true);
      timerInterval = setInterval(updateDisplay, 1000);
  });

  endSessionBtn.addEventListener('click', () => {
      // Release wake lock just in case the end button is clicked manually
      wakeLockManager.release();
      
      clearInterval(timerInterval);
      const duration = Date.now() - startTime;
      localStorage.setItem('duration', duration);
      localStorage.removeItem('startTime');
      localStorage.removeItem('isSessionActive');
      window.location.href = `invoice.html?duration=${duration}`;
  });
});
