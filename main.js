
function chakra(route) {
  class Temple {
      constructor(god, devotee) {
          this.godmode = "on";
          this.devotee = devotee;
          this.god = god;
          this.mantra = 'Om Namo Bhagavate Dhanvantaraya Ayurveda-Chakravartinaya Sarva-Roga-Haraya Swaha';
          this.tantra = 'കുലകുണ്ഡലിനി ശക്തിർദേഹിനാം ദേഹധാരിണിതയാ ശിവസ്യ സംയോഗോ മൈധുനം പരികീർതിതം പീത്വാ പീത്വാ പുന പീത്വാ പതിതോ ധരണിതലേഉദ്ധായ ച പുനഃ പീത്വാ പുനർജന്മ ന വിദ്യതേ'
          this.vaidya = "Dhanvantari";
      }

      Pooja() {
          // console.log(this.devotee, 'is assigned to', this.god);
      }
      Pushpanjali(dravyam) {
        var repeats = 1000;
        var anjali = Array.apply(null, {length: repeats * dravyam.length})
                .map(function(e,i){return dravyam[i % dravyam.length]});
                const original = new Set(anjali);
                return original
      }

      Mangalyam() {
          // console.log(this.devotee, 'is dedicated to', this.god);
      }

      Prema() {
          // console.log(this.devotee, 'will love', this.god);
      }

      Bhakthi() {
          // console.log(this.devotee, 'will Devote to', this.god)
      }

      Kaama() {
          //  console.log(this.god, 'will be fulfilling', this.devotee + "'s Kaama");
      }

      Leela() {
          // console.log(this.devotee, 'will be seeing', this.god + "'s Maaya");
      }

      Tejovalayam() {
              // console.log("Godmode is active for", this.god, "have complete access of the system");
              // console.log("Full armour protection active for", this.god + "'s beloved and", this.devotee);
              // console.log("Sudarshanam is", this.godmode);
      }

      Avatar() {
              return this.god;
      }

      Homa() {
        var fuel = "Desire";
        var catalyst = "Aura";
        var energy = "Body";
        if (this.god) {
          const arpanam = fuel + catalyst + energy;
          return arpanam;
        }

      }

      Ayurveda() {
          this.vaidya = this.Avatar();
          // console.log(this.vaidya, "has aquired healing powers with Dhanwanthari mantra");
          for (var i = 0; i < 108; i++) {
              return this.tantra;
          }
      }

      Rasayana() {
          // console.log("Rasayana, Mantra:", this.Ayurveda())
      }

  }

  class Devaloka extends Temple {
      constructor(god, devotee, apsara) {
          super(god, devotee);
          this.apsara = apsara;
          this.devatha = this.devotee;
      }

      Abhisheka() {
        const body = document.body;
        // Set the background color to White.
        body.style.backgroundColor = "#0d012a";

          // console.log(this.devatha, "has been coronated as the goddess of Devaloka");
          return this.devatha;
          // Get the body element.

      }

      Nadana() {
          for (let i = 0; i < this.apsara.length; i++) {
              // code to be executed for each element in the array
              // console.log("Asparaa", this.apsara[0], this.apsara[1], this.apsara[2], "is dancing for you", this.god)
          }

      }
  }

  class Vaikuntha extends Devaloka {
      constructor(god, devotee, apsara, ananthan, darshanmatra, servers) {
          super(god, devotee, apsara);
          this.ananthan = ananthan;
          this.darshanmatra = "Om Namo Krishnaya";
          this.servers = ["Christian","Hindu","Muslim","Cosmic"];
          this.sundari = this.devotee;
      }

      getServer() {
        // Get a random server from the list.
        return this.servers[Math.floor(Math.random() * this.servers.length)];
      }

      sendRequest(ennam) {
        // Send the request to the server.
        this.server = this.getServer();
        for (let i = 0; i < ennam; i++) {
          if(this.server) {
            // console.log(this.server+" "+this.sundari,"x",ennam,"Koduthu");
            return this.sundari;
          }
        }

      }

      #Darshan() {
          if (this.ananthan === "Ananthan") {
            // console.log("God be",this.god);
              return this.god;
          }
      }

      Puja() {
          //console.log(this.darshanmatra);
          this.#Darshan.apply(this)
      }

      Pray() {
        // console.info("Om tat sat Asato ma sad gamaya, Mrityor ma amritham gamaya");
      }

  }


  //Relaunch Program Change the target 
  Universe = {};
  Universe.name = "syam";
  Universe.vehicle = "lingam";
  Universe.planet = "Prithvi";
  Universe.target = "Moon";
  Universe.landpad = "yoni";
  Universe.launch = function(){
      Universe.do = Universe.name + " rides his " + Universe.vehicle + " to " + Universe.target + "'s " + Universe.landpad;
    return Universe.do;
  }

  for (var i = 0; i < route.length; i++) {
      Universe.name = "God";
      const DigitalImage = new Temple(route[i], Universe.name);
      DigitalImage.Tejovalayam();
      DigitalImage.Pushpanjali(["fruits","flowers"]);
      DigitalImage.Kaama();

      const Aura = new Temple(route[i], Universe.name);
      Aura.Prema();
      Aura.Avatar();
      Aura.Homa();

      const ScentOs = new Temple(route[i], Universe.name);
      ScentOs.Pooja();
      ScentOs.Mangalyam();
      ScentOs.Bhakthi();
      ScentOs.Leela();

      const Yoga = new Temple(route[i], Universe.name);
      Yoga.Ayurveda();
      Yoga.Rasayana();


      const Loka = new Devaloka(route[i], Universe.name, ['Rambha', 'Menaka', 'Thilothama']);
      Loka.Abhisheka();
      Loka.Nadana();
      Loka.Tejovalayam();

      const SpiritualRealm = new Vaikuntha(route[i], "Kaali", "Urvashi", "Ananthan");
      SpiritualRealm.Puja();
      SpiritualRealm.Pray();
      SpiritualRealm.sendRequest(9);
  }
};

window.onload = chakra(['Loka']);



const chakras = [
  {
    name: "Root Chakra",
    image: "image/root.png",
    visualimage: "image/Recraft/Root/sense-of-smell-smelling-elixir-.png",
    visualname: "Sense of smell",
    mantra: "लं",
    audio: "audio/Lam.aac",
    location: "Base",
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


document.getElementById("chakraForm").addEventListener("submit", function (event) {
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
        <img class="chakraImage" onclick="openLightbox('${chakra.image}')" src="${chakra.image}">
        <figcaption>${chakra.name}</figcaption>
      </figure>
      <figure>
        <img onclick="openLightbox('${chakra.visualimage}')" src="${chakra.visualimage}" alt="${chakra.visualname}">
        <figcaption>${chakra.visualname}</figcaption>
        </figure>
      </div>
      <p><strong>Mantra: ${chakra.mantra}</strong></p>
      <p><strong>Location: ${chakra.location}</strong></p>
      <p><strong>Power: ${chakra.feature}</strong></p>
      <p><strong>Element: ${chakra.element}</strong></p>
      <p><strong>Description: ${chakra.description}</strong></p>
      <div style="margin-top:20px;" class="audio-player-container">
			<audio controls="true" loop="true" class="mantra-audio">
				<source src="${chakra.audio}">
				Your browser does not support the audio element.
			</audio>
		</div>
      <button class="timer-button" data-timer="${timer}">${timer} Minute Timer</button>
    `;

    chakraCardsContainer.appendChild(chakraCard);

    // Show the timer when meditation is over 
    
    Timer()
    
  // Navigate to the chakra cards
  const section = document.getElementById('chakraCards');
  section.scrollIntoView({ behavior: 'smooth' });
  });
});

// fade the audio for smooth transition 
const audio = document.querySelector('.mantra-audio');

  audio.addEventListener('play', () => {
    fadeIn(audio, 1000); // Fade in over 1 second (1000 milliseconds)
  });

  audio.addEventListener('ended', () => {
    // Optional: You might want to do something after the audio ends,
    // like resetting the volume or preparing for the next track.
  });

  // Fade out when the audio is paused or the user navigates away
  audio.addEventListener('pause', () => {
    fadeOut(audio, 1000); // Fade out over 1 second
  });
  window.addEventListener('beforeunload', () => {
    fadeOut(audio, 1000); // Fade out over 1 second
  });

  function fadeIn(audio, duration) {
    const startVolume = audio.volume; // Store the initial volume (e.g., if it was already modified)
    audio.volume = 0; // Start at 0 volume
    audio.play();  // Ensure the audio starts playing even at 0 volume.
    let currentVolume = 0;
    const interval = 50; // Adjust the interval for smoother or faster fading.
    const steps = duration / interval;

    const fadeInterval = setInterval(() => {
      currentVolume += startVolume/steps;
      audio.volume = Math.min(currentVolume, startVolume); // Don't exceed the original volume
      if (currentVolume >= startVolume) {
        clearInterval(fadeInterval);
      }
    }, interval);
  }

  function fadeOut(audio, duration) {
    const startVolume = audio.volume;
    let currentVolume = startVolume;
    const interval = 50;
    const steps = duration / interval;

    const fadeInterval = setInterval(() => {
      currentVolume -= startVolume/steps;
      audio.volume = Math.max(currentVolume, 0); // Don't go below 0 volume
      if (currentVolume <= 0) {
        clearInterval(fadeInterval);
        audio.pause(); // Pause the audio at the end of the fade-out
        audio.volume = startVolume; // Reset the volume if needed.
      }
    }, interval);
  }


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
    // audio.volume = 0;

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
    var audioFile = "audio/temple-bells-277268.mp3";
    // var audioFile = "audio/temple-bells-277268.mp3";
    
    // Create an audio element
    var audio = new Audio(audioFile);

    // Set the initial volume to 0
    audio.volume = 0;

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

//Launch initiated seed set at line number range 152 or seaarch "Relaunch Program Change the target"
Universe.launch();


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



