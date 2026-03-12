export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.droneOscs = [];
        this.vocalOscs = [];
        this.droneGain = null;
        this.vocalGain = null;
        this.filter = null;
        this.vocalFilter = null;
        this.reverb = null;
        this.strength = 0.5;
        this.isStarted = false;
        this.isPaused = false;

        // Chakra frequencies (Solfeggio)
        this.frequencies = {
            'Root Chakra': 396,
            'Sacral chakra': 417,
            'Solar plexus chakra': 528,
            'Heart chakra': 639,
            'Throat chakra': 741,
            'Third eye chakra': 852,
            'Crown chakra': 963
        };

        // Formants for vowels (approximate)
        this.vowels = {
            'LAM': [600, 1040, 2250], // "Ah"
            'VAM': [600, 1040, 2250], // "Ah"
            'RAM': [600, 1040, 2250], // "Ah"
            'YAM': [600, 1040, 2250], // "Ah"
            'HAM': [600, 1040, 2250], // "Ah"
            'OM': [400, 800, 2600],   // "Oh"
            'AUM': [600, 1040, 2250]  // "Ah"
        };
    }

    async init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        // Drone chain
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 1000;
        this.filter.Q.value = 1;
        this.filter.connect(this.masterGain);

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.value = 0;
        this.droneGain.connect(this.filter);

        // Vocal chain (formant filtering)
        this.vocalGain = this.ctx.createGain();
        this.vocalGain.gain.value = 0;
        
        // Simple 3-band formant filter
        this.vocalFilters = [
            this.ctx.createBiquadFilter(),
            this.ctx.createBiquadFilter(),
            this.ctx.createBiquadFilter()
        ];
        this.vocalFilters.forEach(f => {
            f.type = 'bandpass';
            f.Q.value = 10;
            f.connect(this.masterGain);
            this.vocalGain.connect(f);
        });

        // Reverb
        this.reverb = this.createReverb();
        this.reverb.connect(this.masterGain);
        this.droneGain.connect(this.reverb);
        this.vocalGain.connect(this.reverb);

        this.isStarted = true;
        this.isPaused = false;
    }

    togglePause(paused) {
        this.isPaused = paused;
        if (this.ctx) {
            this.masterGain.gain.setTargetAtTime(paused ? 0 : 0.5, this.ctx.currentTime, 0.5);
        }
    }

    createReverb() {
        const length = this.ctx.sampleRate * 4;
        const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
        for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
                channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 3);
            }
        }
        const node = this.ctx.createConvolver();
        node.buffer = impulse;
        return node;
    }

    setStrength(value) {
        this.strength = value / 100;
        if (this.ctx && this.isStarted) {
            this.updateParameters();
        }
    }

    updateParameters() {
        const freq = 300 + (this.strength * 3000);
        this.filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.2);
        this.filter.Q.setTargetAtTime(1 + (this.strength * 15), this.ctx.currentTime, 0.2);
        
        // Vocal richness increases with strength
        const vGain = 0.05 + (this.strength * 0.25);
        this.vocalGain.gain.setTargetAtTime(vGain, this.ctx.currentTime, 0.5);
    }

    startDrone(chakra) {
        if (!this.ctx) return;
        this.stopDrone();

        let baseFreq = this.frequencies[chakra.name];
        if (!baseFreq) {
            const lowerName = chakra.name.toLowerCase();
            const key = Object.keys(this.frequencies).find(k => k.toLowerCase() === lowerName);
            baseFreq = key ? this.frequencies[key] : 440;
        }
        
        const mantra = (chakra.mantra || 'OM').toUpperCase();
        
        // 1. Drone - Deep foundation
        this.addOsc(baseFreq / 2, 'sine', 0.5, this.droneGain, this.droneOscs); 
        this.addOsc(baseFreq, 'sine', 0.2, this.droneGain, this.droneOscs);

        // 2. Vocal - Mantra-Driven Frequency Pulses (The Mahakatha vibe)
        const vocalSource = this.addOsc(baseFreq, 'sawtooth', 0.1, this.vocalGain, this.vocalOscs, true);
        
        // Rhythmic pulsing of the frequency to follow the mantra vibration
        const pulseLFO = this.ctx.createOscillator();
        const pulseGain = this.ctx.createGain();
        pulseLFO.frequency.value = 0.5; // Chant rhythm (approx 1 pulse every 2s)
        pulseGain.gain.value = 5; // Slight frequency shift +/- 5Hz
        pulseLFO.connect(pulseGain);
        pulseGain.connect(vocalSource.osc.frequency);
        pulseLFO.start();
        this.vocalOscs.push({ osc: pulseLFO, g: pulseGain });
        
        // Update formants for the mantra
        const formants = this.vowels[mantra] || [600, 1040, 2250];
        formants.forEach((f, i) => {
            this.vocalFilters[i].frequency.setTargetAtTime(f, this.ctx.currentTime, 0.8);
            this.vocalFilters[i].Q.setTargetAtTime(15 + (this.strength * 20), this.ctx.currentTime, 0.8);
        });

        // Fade in
        const now = this.ctx.currentTime;
        this.droneGain.gain.setTargetAtTime(0.4 + (this.strength * 0.4), now, 2.0);
        this.vocalGain.gain.setTargetAtTime(0.1 + (this.strength * 0.3), now, 3.0);
        this.updateParameters();
    }

    addOsc(freq, type, gainVal, destination, storage, addVibrato = false) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 15;
        g.gain.value = gainVal;

        if (addVibrato) {
            const vibrato = this.ctx.createOscillator();
            const vibratoGain = this.ctx.createGain();
            vibrato.frequency.value = 4 + Math.random() * 2; 
            vibratoGain.gain.value = 3; 
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.detune);
            vibrato.start();
            storage.push({ osc: vibrato, g: vibratoGain });
        }

        osc.connect(g);
        g.connect(destination);
        osc.start();
        const entry = { osc, g };
        storage.push(entry);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.05 + Math.random() * 0.1;
        lfoGain.gain.value = gainVal * 0.2;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();
        storage.push({ osc: lfo, g: lfoGain });

        return entry;
    }

    stopDrone() {
        const now = this.ctx.currentTime;
        this.droneGain.gain.setTargetAtTime(0, now, 1.0);
        this.vocalGain.gain.setTargetAtTime(0, now, 1.0);
        setTimeout(() => {
            this.droneOscs.forEach(o => o.osc.stop());
            this.vocalOscs.forEach(o => o.osc.stop());
            this.droneOscs = [];
            this.vocalOscs = [];
        }, 1100);
    }

    playBowl() {
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        const fundamental = 150 + Math.random() * 50;
        
        const partials = [1, 2.01, 3.05, 4.2, 5.1, 7.3];
        const gains = [0.6, 0.4, 0.3, 0.2, 0.1, 0.05];

        partials.forEach((p, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            
            osc.frequency.value = fundamental * p;
            osc.detune.value = Math.random() * 10;

            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(gains[i] * 0.15, now + 0.1);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 6 + (this.strength * 4));
            
            osc.connect(g);
            g.connect(this.reverb);
            
            osc.start(now);
            osc.stop(now + 11);
        });
    }

    fadeOut(duration = 2) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, duration);
        }
    }

    fadeIn(duration = 2) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, duration);
        }
    }
}
