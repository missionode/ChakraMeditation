import { chakras } from './src/chakras.js';
import { calculateTimer, sortChakrasByProgress } from './src/timer-logic.js';
import { ChakraGuidance } from './src/chakra-guidance.js';
import { ChakraTimer } from './src/chakra-timer.js';
import { MeditationSessionManager } from './src/meditation-session-manager.js';

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

document.getElementById("startSessionBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const progressValues = Array.from(document.querySelectorAll("input.ival")).map((input) => parseInt(input.value));
  const sortedChakras = sortChakrasByProgress(chakras, progressValues);
  
  // Attach calculated durations to chakra objects for the manager
  sortedChakras.forEach(c => {
      const progress = progressValues[chakras.indexOf(c)];
      c.timerDuration = calculateTimer(progress);
  });

  const chakraCardsContainer = document.getElementById("chakraCards");
  chakraCardsContainer.innerHTML = "";

  // UI Setup: Hide form
  const formChakr = document.getElementById('chakraForm');
  if (formChakr) formChakr.style.display = "none";

  // Create cards in the DOM (hidden initially or styled appropriately)
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
        <audio loop class="mantra-audio" id="audio-${index}">
          <source src="${chakra.audio}">
        </audio>
      </div>
      <div class="timer-display" id="timer-display-${index}">${chakra.timerDuration} Minute Session</div>
    `;
    chakraCardsContainer.appendChild(chakraCard);
  });

  // Initialize Session Manager
  const manager = new MeditationSessionManager(sortedChakras, guidance, chakraTimer);

  manager.onChakraChange = (chakra, index) => {
      // Clear previous active states
      document.querySelectorAll('.chakra-card').forEach(c => c.classList.remove('active-chakra'));
      
      // Highlight current card
      const card = document.getElementById(`chakra-card-${index}`);
      if (card) {
          card.classList.add('active-chakra');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Handle Audio: Stop all, play current
      document.querySelectorAll('.mantra-audio').forEach(a => { a.pause(); a.currentTime = 0; });
      
      // Audio only plays during 'meditating' state, not 'guidance' state.
      // The manager calls startMeditation after guidance.
  };

  // Override startMeditation to handle music and visual polish
  const originalStartMeditation = manager._startMeditation.bind(manager);
  manager._startMeditation = (chakra) => {
      const index = manager.currentIndex;
      const audio = document.getElementById(`audio-${index}`);
      if (audio) audio.play().catch(e => console.log("Music play blocked:", e));
      
      const card = document.getElementById(`chakra-card-${index}`);
      if (card) card.classList.add('meditating-now');

      originalStartMeditation(chakra);
  };

  manager.onComplete = () => {
      document.querySelectorAll('.chakra-card').forEach(c => c.classList.remove('active-chakra', 'meditating-now'));
      alert("Spiritual Journey Complete.");
      
      // Trigger legacy session end logic if needed
      const endBtn = document.getElementById('endSessionBtn');
      if (endBtn) endBtn.click();
  };

  manager.startSession();
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

  // Note: We are hooking into the EXISTING click listener added above
  startSessionBtn.addEventListener('click', () => {
      startTime = Date.now();
      startSessionBtn.classList.add('hidden');
      endSessionBtn.classList.remove('hidden');
      localStorage.setItem('startTime', startTime);
      localStorage.setItem('isSessionActive', true);
      timerInterval = setInterval(updateDisplay, 1000);
  });

  endSessionBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      const duration = Date.now() - startTime;
      localStorage.setItem('duration', duration);
      localStorage.removeItem('startTime');
      localStorage.removeItem('isSessionActive');
      window.location.href = `invoice.html?duration=${duration}`;
  });
});
