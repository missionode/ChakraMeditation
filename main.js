
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}


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


const chakras = [
  {
    name: "Root Chakra",
    image: "image/root.png",
    visualimage: "image/Recraft/Root/sense-of-smell-smelling-elixir-.png",
    visualname: "Sense of smell",
    mantra: "लं",
    audio: "audio/Lam.aac",
    location: "Base",
    associated:"Sense of Smell, Sense Of Security, Stability, Sense of responsibility",
    color: "red",
    colorcode: "#DC143C",
    element: "Earth",
    feature: "Sense of smell",
    description: "It is believed to be the foundation of our being and is responsible for our sense of security and stability",
  },
  // Repeat for other chakras
  {
      name: "Sacral chakra",
      image: "image/sacral.png",
      visualimage: "image/Recraft/Sacral/sense-of-pleasure-elixir.png",
      visualname: "Sense of sexuality",
      mantra: "वं",
      audio: "audio/Vam.aac",
      location: "below the navel",
      associated:"Sexuality, Sense of taste, Creativity, Emotions",
      color: "orange",
      colorcode: "#FF4500",
      element: "Water",
      feature: "Sense of taste",
      description: "It is believed to be the center of our creativity, sexuality, and emotions",
    },
    {
      name: "Solar plexus chakra",
      image: "image/solar.png",
      visualimage: "image/Recraft/Solar/sense-of-sight-elixir.png",
      visualname: "Sense of sight",
      mantra: "रं",
      audio: "audio/Ram.aac",
      location: "Abdomen",
      associated:"Sense of Sight, Personal Power, Will power, Self Esteem",
      color: "yellow",
      colorcode: "#FFD700",
      element: "Fire",
      feature: "Sense of sight",
      description: "It is believed to be the center of our personal power, willpower, and self-esteem",
    },
    {
      name: "Heart chakra",
      image: "image/heart.png",
      visualimage: "image/Recraft/Heart/sense-of-touch-elixir.png",
      visualname: "Sense of touch",
      mantra: "यं",
      audio: "audio/Yam.aac",
      location: "Chest",
      associated:"Sense of touch, Center of our Love, Compassion, Self Esteem",
      color: "green",
      colorcode: "#90EE90",
      element: "Air",
      feature: "Sense of touch",
      description: "It is believed to be the center of our love, compassion, and forgiveness",
    },
    {
      name: "Throat chakra",
      image: "image/throat.png",
      visualimage: "image/Recraft/Throat/-sense-of-sound-elixir.png",
      visualname: "Sense of hearing",
      mantra: "हं",
      audio: "audio/Ham.aac",
      location: "Throat",
      associated:"Sense of Hearing, Communication, Self Expression, Truth",
      color: "blue",
      colorcode: "#87CEFF",
      element: "Ether",
      feature: "Sense of hearing",
      description: "It is believed to be the center of our communication, self-expression, and truth",
    },
    {
      name: "Third eye chakra",
      image: "image/thirdeye.png",
      visualimage: "image/Recraft/Third-eye/the-sense-of-intuition-elixir.png",
      visualname: "Sense of Intuition",
      mantra: "शं",
      audio: "audio/Om.aac",
      location: "Between the eyebrows",
      associated:"Sense Of intuition, Inner vision, Wisdom, Insight",
      color: "indigo",
      colorcode: "#4B0082",
      element: "light",
      feature: "Sense of intuition",
      description: "It is believed to be the center of our inner vision, wisdom, and insight",
    },
    {
      name: "Crown chakra",
      image: "image/crown.png",
      visualimage: "image/Recraft/Crown/sense-of-knowing-elixir.png",
      visualname: "Transcendence",
      mantra: "ॐ",
      audio: "audio/Aum.aac",
      location: "Top of the head",
      associated:"Transcendence, Connection with divine, Higher Consciousness, Enlightenment",
      color: "violet",
      colorcode: "#D8BFD8",
      element: "thought",
      feature: "Sense of knowing",
      description: "It is believed to be the center of our connection to the divine, higher consciousness, and enlightenment",
    },
];

// toggle meditation
var details = document.getElementById("duet");
details.addEventListener("click", function() {
  this.classList.toggle("open");
});


document.getElementById("startSessionBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const progressValues = Array.from(document.querySelectorAll("input[type='range']")).map((input) => parseInt(input.value));
  const sortedChakras = chakras.slice().sort((a, b) => progressValues[chakras.indexOf(a)] - progressValues[chakras.indexOf(b)]);
  const chakraCardsContainer = document.getElementById("chakraCards");
  chakraCardsContainer.innerHTML = "";

  sortedChakras.forEach((chakra, index) => {
    const chakraCard = document.createElement("div");
    chakraCard.className = "chakra-card";
    chakraCard.style.borderTop = "10px solid" + chakra.colorcode;

    const progress = progressValues[chakras.indexOf(chakra)];
    console.log("progress",progress)
    var timer = 11 - progress
    if(timer == 0) {
      timer = 1
    }
    var point = index

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

    // Show the timer when meditation is over 
    
    Timer()

  const formChakr = document.getElementById('chakraForm');
  formChakr.style.display = "none"
    
  // Navigate to the chakra cards
  const section = document.getElementById('chakraCards');
  section.scrollIntoView({ behavior: 'smooth' });
  });
 


  
});


// lightbox Plugin 
function openLightbox(imageUrl) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');

  lightboxImage.src = imageUrl;
  lightbox.style.display = 'block';

  var audioFile = "audio/drink.mp3";

    // Create an audio element
    var audio = new Audio(audioFile);

    // Set the initial volume to 0
    audio.volume = 0.0;

    // Play the audio
    audio.play();

}

document.addEventListener('DOMContentLoaded', function() {
  var lightbox = document.getElementById('lightbox');
  var closeBtn = document.querySelector('.close-button');

  closeBtn.addEventListener('click', function() {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
});


// Timer Plug in
function Timer() {

    // Function to play the beep sound
    function playBeep() {
      var audio = document.getElementById("beep-sound");
      // Play the audio automatically when the page loads
      audio.play();
    }

    // Function to start the timer
    function startTimer(duration, button) {
      var timer = duration * 60; // Convert minutes to seconds
      // Audio player starts here
     // Duration in minutes
    var durationInMinutes = duration;

    // Convert duration to milliseconds
    var duration = durationInMinutes * 60 * 1000;

    // Fade-in duration in milliseconds
    var fadeInDuration = 2000;

    // Fade-out duration in milliseconds
    var fadeOutDuration = 2000;

    // Path to the audio file
    var audioFile = "audio/bell-ring-01.mp3";
    // var audioFile = "audio/temple-bells-277268.mp3";
    
    // Create an audio element
    var audio = new Audio(audioFile);

    // Set the initial volume to 0
    audio.volume = 0.3;

    audio.loop = false

    // Play the audio
    audio.play();

    // Calculate the volume step for fading in
    var fadeInVolumeStep = 0.5 / (fadeInDuration / 100);

    // Function to fade in the audio gradually
    function fadeInAudio() {
      if (audio.volume + fadeInVolumeStep < 1) {
        audio.volume += fadeInVolumeStep;
        setTimeout(fadeInAudio, 100);
      } else {
        audio.volume = 0.2;
      }
    }

    // Call the fadeInAudio function to start the fade-in process
    fadeInAudio();

    // Stop the audio and fade it out after the specified duration
    setTimeout(function() {
      var fadeOutVolumeStep = 10.5/ (fadeOutDuration / 100);

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
    }, duration);
  


      // Audio player done
      var interval = setInterval(function() {
        // Update the button text with remaining time
        button.innerHTML = timer + 's';

        // Check if the timer has reached 0
        if (--timer < 0) {
          // Stop the timer
          clearInterval(interval);

          // Play the beep sound
          playBeep();
          
          // Reset the button text
          button.innerHTML = 'Timer';

          // Enable the button again
          button.disabled = false;
        }
        if(timer == 5) {
          console.log("All fixed")
          // Get the audio element
          var audio = document.getElementById("beep-sound");

          // Play the audio automatically when the page loads
          audio.play();
        }
      }, 1000);
    }

    // Add click event listeners to each button
    var buttons = document.getElementsByTagName('button');

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      
      button.addEventListener('click', function() {
        
        var timerDuration = parseInt(this.getAttribute('data-timer'));
        this.innerHTML = timerDuration + 'm';
        this.disabled = true; // Disable the button while the timer is running
        startTimer(timerDuration, this);
        
      });
    }
}

const queryString = window.location.href;
var url = new URL(queryString);
var conscent = url.searchParams.get("private");
if(conscent == 'true') {
  document.getElementById("private").removeAttribute("hidden")
} else {
  // do nothing
}


function SetEnergy(energyvalue) {
  const ranges = document.querySelectorAll(".ival");
  for (const range of ranges) {
    range.value = energyvalue;
  }
  function friendship(word) {
    var convert = word.split('');
    var temp = convert[0];
    convert[0] = convert[2];
    convert[2] = temp;
    convert = convert.join('');
    return convert;
  }

  var friends = "dogs";
  var convert = friendship(friends);
  console.log("Converted into: " + convert);
  
}

// TO THE SESSION

document.addEventListener('DOMContentLoaded', () => {
  const startSessionBtn = document.getElementById('startSessionBtn');
  const endSessionBtn = document.getElementById('endSessionBtn');
  const elapsedTimeDisplay = document.getElementById('elapsedTime');

  let startTime = localStorage.getItem('startTime');
  let isSessionActive = localStorage.getItem('isSessionActive') === 'true';
  let timerInterval;

  if (startTime && isSessionActive) {
      startTime = parseInt(startTime);
      startSessionBtn.classList.add('hidden');
      endSessionBtn.classList.remove('hidden');

      timerInterval = setInterval(() => {
          const currentTime = Date.now();
          const elapsedMilliseconds = currentTime - startTime;
          const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
          const minutes = Math.floor(elapsedSeconds / 60);
          const seconds = elapsedSeconds % 60;

          elapsedTimeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }, 1000);
  }

  startSessionBtn.addEventListener('click', () => {
      startTime = Date.now();
      startSessionBtn.classList.add('hidden');
      endSessionBtn.classList.remove('hidden');
      localStorage.setItem('startTime', startTime);
      localStorage.setItem('isSessionActive', true);

      timerInterval = setInterval(() => {
          const currentTime = Date.now();
          const elapsedMilliseconds = currentTime - startTime;
          const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
          const minutes = Math.floor(elapsedSeconds / 60);
          const seconds = elapsedSeconds % 60;

          elapsedTimeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }, 1000);
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
  const isSessionActive = localStorage.getItem('isSessionActive') === 'true';

  if (isSessionActive) {
      rejoinSessionBtn.style.display = 'block';
  } else {
      rejoinSessionBtn.style.display = 'none';
  }

  rejoinSessionBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
  });
});



