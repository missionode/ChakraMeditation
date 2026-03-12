import { AudioEngine } from './audio-engine.js';
import { MeditationSessionManager } from './meditation-session-manager.js';
import { ChakraGuidance } from '../src/chakra-guidance.js';
import { chakras } from '../src/chakras.js';
import { ChakraTimer } from '../src/chakra-timer.js';

import { getStoredVoiceSettings, saveVoiceSettings } from '../src/voice-settings.js';

const audioEngine = new AudioEngine();
const guidance = new ChakraGuidance();

const chakraDisplay = document.getElementById('chakra-display');
const mantraContainer = document.getElementById('mantra-container');
const mantraSymbol = document.getElementById('mantra-symbol-img');
const mantraText = document.getElementById('mantra-text');
const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const pauseBtn = document.getElementById('pause-btn');
const strengthSlider = document.getElementById('strength');
const durationSlider = document.getElementById('duration');
const durationVal = document.getElementById('duration-val');
const setupControls = document.getElementById('setup-controls');
const activeControls = document.getElementById('active-controls');
const langSelect = document.getElementById('lang-select');
const voiceSelect = document.getElementById('voice-select');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let animationId;
let isPaused = false;

// Localized Content JSON
const chakraContent = {
    'en-US': {
        'Root Chakra': { name: 'Root Chakra', mantra: 'Lam', loc: 'base of your spine', deity: 'Lord Brahma', shakti: 'Dakini' },
        'Sacral chakra': { name: 'Sacral Chakra', mantra: 'Vam', loc: 'area below the navel', deity: 'Lord Vishnu', shakti: 'Rakini' },
        'Solar plexus chakra': { name: 'Solar Plexus', mantra: 'Ram', loc: 'upper abdomen', deity: 'Lord Rudra', shakti: 'Lakini' },
        'Heart chakra': { name: 'Heart Chakra', mantra: 'Yam', loc: 'center of the chest', deity: 'Lord Ishvara', shakti: 'Kakini' },
        'Throat chakra': { name: 'Throat Chakra', mantra: 'Ham', loc: 'throat area', deity: 'Lord Sadashiva', shakti: 'Shakini' },
        'Third eye chakra': { name: 'Third Eye', mantra: 'Om', loc: 'space between the eyebrows', deity: 'Lord Parama Shiva', shakti: 'Hakini' },
        'Crown chakra': { name: 'Crown Chakra', mantra: 'Aum', loc: 'top of the head', deity: 'Shiva', shakti: 'Shakti' },
        'status_prep': 'Prepare for next chakra...',
        'status_med': 'Guided meditation in progress...',
        'status_complete': 'Session Complete. Namaste.',
        'guidance': [
            "Welcome to this meditation, let us gently bring our awareness to the {name}",
            "The sacred mantra for this chakra is {mantra}",
            "Softly focus your attention at the {loc}",
            "The presiding Shiva form is {deity}, and the Shakti form is {shakti}",
            "As you chant this sacred sound, feel its divine energy filling within you",
            "Stay peaceful, and stay aware"
        ]
    },
    'ml-IN': {
        'Root Chakra': { name: 'മൂലാധാര ചക്രം', mantra: 'ലം', loc: 'നട്ടെല്ലിന്റെ താഴത്തെ ഭാഗം', deity: 'ബ്രഹ്മാവ്', shakti: 'ഡാകിനി' },
        'Sacral chakra': { name: 'സ്വാധിഷ്ഠാന ചക്രം', mantra: 'വം', loc: 'പൊക്കിളിന് താഴെയുള്ള ഭാഗം', deity: 'വിഷ്ണുഭഗവാൻ', shakti: 'രാകിനി' },
        'Solar plexus chakra': { name: 'മണിപൂര ചക്രം', mantra: 'രംഭ്', loc: 'വയറിന്റെ മുകൾ ഭാഗം', deity: 'രുദ്രൻ', shakti: 'ലാകിനി' },
        'Heart chakra': { name: 'അനാഹത ചക്രം', mantra: 'യം', loc: 'നെഞ്ചിന്റെ മധ്യഭാഗം', deity: 'ഈശ്വരൻ', shakti: 'കാകിനി' },
        'Throat chakra': { name: 'വിശുദ്ധി ചക്രം', mantra: 'ഹം', loc: 'തൊണ്ടയുടെ ഭാഗം', deity: 'സദാശിവൻ', shakti: 'ശാകിനി' },
        'Third eye chakra': { name: 'ആജ്ഞാ ചക്രം', mantra: 'ഓം', loc: 'പുരികങ്ങൾക്കിടയിലുള്ള ഭാഗം', deity: 'പരമശിവൻ', shakti: 'ഹാകിനി' },
        'Crown chakra': { name: 'സഹസ്രാര ചക്രം', mantra: 'ഓം', loc: 'തലയുടെ മുകൾ ഭാഗം', deity: 'ശിവൻ', shakti: 'ശക്തി' },
        'status_prep': 'അടുത്ത ചക്രത്തിനായി തയ്യാറെടുക്കുക...',
        'status_med': 'ധ്യാനം തുടരുന്നു...',
        'status_complete': 'ധ്യാനം പൂർത്തിയായി. നമസ്തേ.',
        'guidance': [
            "നമസ്കാരം, ഈ മെഡിറ്റേഷൻ സെഷനിലേക്ക് സ്വാഗതം നമുക്ക് ഇപ്പോൾ നമ്മുടെ മനസ്സിനെ സാവധാനം {name} ലേക്ക് കൊണ്ടുവരാം",
            "ഈ ചക്രത്തിൻറെ പവിത്രമായ മന്ത്രം {mantra} എന്നാണ്",
            "നിങ്ങളുടെ അവബോധം ഇപ്പോൾ {loc} ലേക്ക് ശ്രദ്ധയോടെ പകരുക",
            "ഈ ചക്രത്തിന്റെ ശിവരൂപം {deity} എന്നും ശക്തിരൂപം {shakti} എന്നുമാണ്",
            "മനസ്സിനുള്ളിൽ ഈ മന്ത്രം ജപിക്കുമ്പോൾ, ആ ദിവ്യമായ ഊർജ്ജം നിങ്ങളിൽ നിറയുന്നത് സാവധാനം അനുഭവിക്കുക",
            "ശാന്തമായും പൂർണ്ണമായ അവബോധത്തോടെയും ഇരിക്കുക"
        ]
    }
};

// Voice Management
function loadVoices() {
    if (!window.speechSynthesis) return;
    
    let voices = window.speechSynthesis.getVoices();
    const settings = getStoredVoiceSettings();
    const currentLang = (langSelect.value || 'ml-IN').split('-')[0];
    
    if (voices.length > 0) {
        voiceSelect.innerHTML = '';
        
        let filteredVoices = voices.filter(v => 
            v.lang.startsWith(currentLang) || 
            v.lang.startsWith('en') || 
            v.lang.includes('IN')
        );

        if (filteredVoices.length === 0) filteredVoices = voices;

        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.name === settings.voiceName) option.selected = true;
            voiceSelect.appendChild(option);
        });

        if (voiceSelect.options.length === 0) {
            voiceSelect.innerHTML = '<option value="">No voices available</option>';
        }
    }
}

// Ensure voices are loaded
if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    // Try multiple times as some browsers are slow
    [0, 100, 500, 1000, 2000].forEach(t => setTimeout(loadVoices, t));
}

// Handle settings changes
langSelect.addEventListener('change', () => {
    const settings = getStoredVoiceSettings();
    settings.language = langSelect.value;
    saveVoiceSettings(settings);
    loadVoices();
});

voiceSelect.addEventListener('change', () => {
    const settings = getStoredVoiceSettings();
    settings.voiceName = voiceSelect.value;
    saveVoiceSettings(settings);
});

// Initialize settings
const initialSettings = getStoredVoiceSettings();
langSelect.value = initialSettings.language || 'ml-IN';

// Custom Timer for Lite version with Pause support
class LiteTimer extends ChakraTimer {
    constructor() {
        super();
        this.remaining = 0;
        this.onTick = null;
        this.onEnd = null;
        this.isPaused = false;
    }

    start(durationInMinutes, onTick, onEnd) {
        this.stop();
        this.remaining = Math.round(durationInMinutes * 60);
        this.onTick = onTick;
        this.onEnd = onEnd;
        this.isPaused = false;
        
        this._playBell();
        this._run();
    }

    _run() {
        this.interval = setInterval(() => {
            if (this.isPaused) return;

            if (this.onTick) this.onTick(this.remaining);

            if (--this.remaining < 0) {
                this.stop();
                this._playBell();
                setTimeout(() => {
                    if (this.onEnd) this.onEnd();
                }, 3000);
            }

            if (this.remaining === 5) {
                this._playBell();
            }
        }, 1000);
    }

    togglePause(paused) {
        this.isPaused = paused;
    }

    _playBell() {
        audioEngine.playBowl();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);
    if (!audioEngine.ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;
    const strength = audioEngine.strength;
    const opacity = isPaused ? 0.1 : 0.3;
    
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--chakra-color');
    ctx.lineWidth = 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * (isPaused ? 0.25 : 0.3);

    for (let i = 0; i < 360; i += 2) {
        const angle = (i * Math.PI) / 180;
        const noise = isPaused ? 0 : Math.sin(angle * 5 + time) * 10 * strength;
        const r = baseRadius + noise + (isPaused ? 0 : Math.sin(angle * 10 - time * 2) * 5);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.stroke();

    ctx.shadowBlur = isPaused ? 5 : 15 * strength;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.globalAlpha = 1.0;
}

let manager;

async function startSession() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    await audioEngine.init();
    audioEngine.setStrength(strengthSlider.value);
    
    setupControls.classList.add('hidden');
    activeControls.classList.remove('hidden');
    
    const totalDuration = parseInt(durationSlider.value);
    const durationPerChakra = totalDuration / chakras.length;
    const currentLang = langSelect.value;

    const sessionChakras = chakras.map(c => ({
        ...c,
        timerDuration: durationPerChakra 
    }));

    const timer = new LiteTimer();
    
    // Wrap timer.start ONCE for the entire session
    const originalTimerStart = timer.start.bind(timer);
    timer.start = (duration, onTick, onEnd) => {
        originalTimerStart(duration, (remaining) => {
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            if (onTick) onTick(remaining);
        }, () => {
            audioEngine.stopDrone();
            if (onEnd) onEnd();
        });
    };

    manager = new MeditationSessionManager(sessionChakras, guidance, timer, chakraContent);
    
    // Override _startMeditation to trigger drone ONLY when meditation phase begins
    const originalStartMeditation = manager._startMeditation.bind(manager);
    manager._startMeditation = function(chakra) {
        console.log("Starting meditation phase for", chakra.name);
        audioEngine.startDrone(chakra);
        originalStartMeditation(chakra);
    };

    manager.onChakraChange = (chakra, index, isTransition) => {
        const lang = langSelect.value;
        const localized = chakraContent[lang][chakra.name] || { name: chakra.name, mantra: chakra.mantra };
        const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

        if (isTransition) {
            statusDisplay.textContent = chakraContent[lang]['status_prep'];
            mantraContainer.style.visibility = 'hidden';
            mantraSymbol.src = placeholder;
            mantraText.textContent = "";
            audioEngine.stopDrone();
            return;
        }

        const symbolFilename = chakra.image.split('/').pop();
        const symbolPath = `symbols/${symbolFilename}`;
        
        let deityDisplay = "";
        if (localized.deity && localized.shakti) {
            if (chakra.name === "Crown chakra") {
                deityDisplay = ` - Union of ${localized.deity} & ${localized.shakti}`;
            } else {
                deityDisplay = ` - ${localized.deity} & ${localized.shakti}`;
            }
        }

        chakraDisplay.textContent = `${localized.name}${deityDisplay}`;
        mantraText.textContent = localized.mantra;
        
        // Preload image
        const img = new Image();
        img.onload = () => {
            mantraSymbol.src = symbolPath;
            mantraContainer.style.visibility = 'visible';
        };
        img.onerror = () => {
            mantraSymbol.src = placeholder;
            mantraContainer.style.visibility = 'visible';
        };
        img.src = symbolPath;

        document.body.style.setProperty('--chakra-color', chakra.colorcode || chakra.color || '#ffd700');
        statusDisplay.textContent = chakraContent[lang]['status_med'];
    };

    manager.onComplete = () => {
        const lang = langSelect.value;
        endSession();
        statusDisplay.textContent = chakraContent[lang]['status_complete'];
    };

    isPaused = false;
    pauseBtn.textContent = "Pause";
    manager.startSession();
    drawVisualizer();
}

function endSession() {
    if (manager) {
        manager.stop();
        if (manager.timer) manager.timer.stop();
    }
    audioEngine.stopDrone();
    cancelAnimationFrame(animationId);
    
    setupControls.classList.remove('hidden');
    activeControls.classList.add('hidden');
    chakraDisplay.textContent = "Ready";
    mantraContainer.style.visibility = 'hidden';
    mantraSymbol.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    mantraText.textContent = "";
    timerDisplay.textContent = "--:--";
    document.body.style.setProperty('--chakra-color', '#ffd700');
    isPaused = false;
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    
    audioEngine.togglePause(isPaused);
    if (manager && manager.timer) {
        manager.timer.togglePause(isPaused);
    }
    
    if (isPaused) {
        statusDisplay.textContent = "Session Paused";
        if (window.speechSynthesis) window.speechSynthesis.pause();
    } else {
        statusDisplay.textContent = "Session Resumed";
        if (window.speechSynthesis) window.speechSynthesis.resume();
    }
}

startBtn.addEventListener('click', startSession);
stopBtn.addEventListener('click', endSession);
pauseBtn.addEventListener('click', togglePause);

strengthSlider.addEventListener('input', (e) => {
    audioEngine.setStrength(e.target.value);
});

durationSlider.addEventListener('input', (e) => {
    durationVal.textContent = `${e.target.value} Minutes`;
});
