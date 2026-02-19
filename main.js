import { chakras } from './src/chakras.js';
import { calculateTimer, sortChakrasByProgress } from './src/timer-logic.js';

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}

// Make toggleMenu available globally for the onclick handler in HTML
window.toggleMenu = toggleMenu;

// tabmennu 
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to the clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// toggle meditation
var details = document.getElementById("duet");
if (details) {
  details.addEventListener("click", function() {
    this.classList.toggle("open");
  });
}

document.getElementById("startSessionBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const progressValues = Array.from(document.querySelectorAll("input.ival")).map((input) => parseInt(input.value));
  const sortedChakras = sortChakrasByProgress(chakras, progressValues);
  const chakraCardsContainer = document.getElementById("chakraCards");
  chakraCardsContainer.innerHTML = "";

  sortedChakras.forEach((chakra, index) => {
    const chakraCard = document.createElement("div");
    chakraCard.className = "chakra-card";
    chakraCard.style.borderTop = "10px solid " + chakra.colorcode;

    const progress = progressValues[chakras.indexOf(chakra)];
    const timer = calculateTimer(progress);

    chakraCard.innerHTML = `
      <h2 style="color:${chakra.colorcode}">${chakra.name}</h2>
      <div class="figure-container">
      <figure>
        <img class="chakraImage"  src="${chakra.image}">
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
      <p> ${chakra.associated}</p>
      <div style="margin-top:20px;" class="audio-player-container">
        <audio controls="true" loop="true" class="mantra-audio">
          <source src="${chakra.audio}">
          Your browser does not support the audio element.
        </audio>
      </div>
      <button style="background:${chakra.colorcode}" class="timer-button" data-timer="${timer}">${timer} Minute Timer</button>
    `;

    chakraCardsContainer.appendChild(chakraCard);
  });

  // Re-initialize Timer events for the new buttons
  Timer();

  const formChakr = document.getElementById('chakraForm');
  formChakr.style.display = "none"
    
  // Navigate to the chakra cards
  const section = document.getElementById('chakraCards');
  section.scrollIntoView({ behavior: 'smooth' });
});

// lightbox Plugin 
function openLightbox(imageUrl) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');

  lightboxImage.src = imageUrl;
  lightbox.style.display = 'block';

  var audioFile = "audio/drink.mp3";
  var audio = new Audio(audioFile);
  audio.volume = 0.0;
  audio.play();
}
window.openLightbox = openLightbox;

document.addEventListener('DOMContentLoaded', function() {
  var lightbox = document.getElementById('lightbox');
  var closeBtn = document.querySelector('.close-button');

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      lightbox.style.display = 'none';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }
});

// Timer Plug in
function Timer() {
    function playBeep() {
      var audio = document.getElementById("beep-sound");
      if (audio) audio.play();
    }

    function startTimer(duration, button) {
      var timer = duration * 60;
      var durationInMinutes = duration;
      var totalMs = durationInMinutes * 60 * 1000;
      var fadeInDuration = 2000;
      var fadeOutDuration = 2000;

      var audioFile = "audio/bell-ring-01.mp3";
      var audio = new Audio(audioFile);
      audio.volume = 0.3;
      audio.loop = false;
      audio.play();

      var fadeInVolumeStep = 0.5 / (fadeInDuration / 100);
      function fadeInAudio() {
        if (audio.volume + fadeInVolumeStep < 1) {
          audio.volume += fadeInVolumeStep;
          setTimeout(fadeInAudio, 100);
        } else {
          audio.volume = 0.2;
        }
      }
      fadeInAudio();

      setTimeout(function() {
        var fadeOutVolumeStep = 0.5 / (fadeOutDuration / 100);
        function fadeOutAudio() {
          if (audio.volume - fadeOutVolumeStep > 0) {
            audio.volume -= fadeOutVolumeStep;
            setTimeout(fadeOutAudio, 100);
          } else {
            audio.pause();
            audio.currentTime = 0;
          }
        }
        fadeOutAudio();
      }, totalMs);

      var interval = setInterval(function() {
        button.innerHTML = timer + 's';
        if (--timer < 0) {
          clearInterval(interval);
          playBeep();
          button.innerHTML = 'Timer';
          button.disabled = false;
        }
        if (timer == 5) {
          var beepAudio = document.getElementById("beep-sound");
          if (beepAudio) beepAudio.play();
        }
      }, 1000);
    }

    var buttons = document.querySelectorAll('.timer-button');
    buttons.forEach(button => {
      // Use a flag to avoid multiple listeners if Timer() is called multiple times
      if (!button.dataset.listener) {
        button.addEventListener('click', function() {
          var timerDuration = parseInt(this.getAttribute('data-timer'));
          this.innerHTML = timerDuration + 'm';
          this.disabled = true;
          startTimer(timerDuration, this);
        });
        button.dataset.listener = 'true';
      }
    });
}

const queryString = window.location.href;
var url = new URL(queryString);
var conscent = url.searchParams.get("private");
if (conscent == 'true') {
  const privateEl = document.getElementById("private");
  if (privateEl) privateEl.removeAttribute("hidden");
}

function SetEnergy(energyvalue) {
  const ranges = document.querySelectorAll(".ival");
  for (const range of ranges) {
    range.value = energyvalue;
  }
}
window.SetEnergy = SetEnergy;

// TO THE SESSION
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
    const elapsedMilliseconds = currentTime - startTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
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
      clearInterval(timerInterval);
      const endTime = Date.now();
      const duration = endTime - startTime;
      localStorage.setItem('duration', duration);
      localStorage.removeItem('startTime');
      localStorage.removeItem('isSessionActive');
      window.location.href = `invoice.html?duration=${duration}`;
  });
});

// Rejoin session
document.addEventListener('DOMContentLoaded', () => {
  const rejoinSessionBtn = document.getElementById('rejoinSessionBtn');
  if (!rejoinSessionBtn) return;

  const isSessionActive = localStorage.getItem('isSessionActive') === 'true';

  if (isSessionActive) {
      rejoinSessionBtn.style.display = 'block';
  } else {
      rejoinSessionBtn.style.display = 'none';
  }

  rejoinSessionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
  });
});
