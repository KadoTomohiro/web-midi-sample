import {Injectable} from '@angular/core';
import {MidiMessage} from './midiService'

Injectable();
export class AudioService {

    private ctx: AudioContext;
    private algorithms: Map<number, Algorithm>;

    public analyser: AnalyserNode;
    // oscType: string;

    constructor() {
        this.ctx = new AudioContext();
        this.algorithms = new Map<number, Algorithm>();
        this.analyser = this.ctx.createAnalyser();

        this.analyser.connect(this.ctx.destination);

        // this.oscType = this.OscillatorType[0];

    }
    //
    // OscillatorType = [
    //     "sine",
    //     "square",
    //     "sawtooth",
    //     "triangle"
    // ];

    public audioOn(msg: MidiMessage) {

        let algorithm: Algorithm = this.createAlgorithm(msg);

        algorithm.start(0);

        // let envelope = new Envelope(0, 0.5, 0.3, 0.5);




        let now = this.ctx.currentTime;

        let m_attack = 0, m_decay = 0.5, m_sustain = 0.3;
        let c_attack = 0.4, c_decay = 0.3, c_sustain = 0.7;

        let modulatorRootValue = algorithm.modulatorGain.gain.value;  // Attackの目標値をセット
        algorithm.modulatorGain.gain.cancelScheduledValues(0);      // スケジュールを全て解除
        algorithm.modulatorGain.gain.setValueAtTime(0.0, now);      // 今時点を音の出始めとする
        algorithm.modulatorGain.gain.linearRampToValueAtTime(modulatorRootValue, now + m_attack);
        // ▲ rootValue0までm_attack秒かけて直線的に変化
        algorithm.modulatorGain.gain.linearRampToValueAtTime(m_sustain * modulatorRootValue, now + m_attack + m_decay);
        // ▲ m_sustain * modulatorRootValueまでm_attack+m_decay秒かけて直線的に変化

        let carrierRootValue = algorithm.carrierGain.gain.value;      // Attackの目標値をセット
        algorithm.carrierGain.gain.cancelScheduledValues(0);        // スケジュールを全て解除
        algorithm.carrierGain.gain.setValueAtTime(0.0, now);        // 今時点を音の出始めとする
        algorithm.carrierGain.gain.linearRampToValueAtTime(carrierRootValue, now + c_attack);
        // ▲ rootValue0までc_attack秒かけて直線的に変化
        algorithm.carrierGain.gain.linearRampToValueAtTime(c_sustain * carrierRootValue, now + c_attack + c_decay);
        // ▲ c_sustain * carrierRootValueまでc_attack+c_decay秒かけて直線的に変化

        this.algorithms.set(this.getFrequencyKey(msg), algorithm);

    }

    public audioOff(msg: MidiMessage) {

        let algorithm: Algorithm = this.algorithms.get(this.getFrequencyKey(msg));
        if (!algorithm) return;

        let now = this.ctx.currentTime;
        let m_release = 0.5;
        let c_release = 0.4;
        let modulatorRootValue = algorithm.modulatorGain.gain.value;
        algorithm.modulatorGain.gain.cancelScheduledValues(0);
        algorithm.modulatorGain.gain.setValueAtTime(modulatorRootValue, now);
        algorithm.modulatorGain.gain.linearRampToValueAtTime(modulatorRootValue, now);
        algorithm.modulatorGain.gain.linearRampToValueAtTime(0.0, now + m_release);

        let carrierRootValue = algorithm.carrierGain.gain.value;
        algorithm.carrierGain.gain.cancelScheduledValues(0);
        algorithm.carrierGain.gain.setValueAtTime(carrierRootValue, now);
        algorithm.carrierGain.gain.linearRampToValueAtTime(carrierRootValue, now);
        algorithm.carrierGain.gain.linearRampToValueAtTime(0.0, now + c_release);

        let release = m_release;
        if (release < c_release) release = c_release;


        algorithm.stop(now + release);
    }

    private getFrequencyKey(msg: MidiMessage): number {
        return (msg.channelNo << 8) + msg.noteNo;
    }

    static getTimeWave(analyser: AnalyserNode): Uint8Array {
        let times = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(times);

        return times;
    }

    static getSpectrumsWave(analyser: AnalyserNode): Uint8Array {
        var spectrums = new Uint8Array(analyser.frequencyBinCount);  // Array size is 1024 (half of FFT size)
        analyser.getByteFrequencyData(spectrums);

        return spectrums;
    }

    static waveType = {
        time: 'time',
        spectrum: 'spectrum'
    };

    static getWaveSource (type: string, analyser: AnalyserNode): Uint8Array {

        let source: Uint8Array;

        switch(type) {
            case AudioService.waveType.time:
                source = AudioService.getTimeWave(analyser);
                break;
            case AudioService.waveType.spectrum:
                source = AudioService.getSpectrumsWave(analyser);
                break;
        }

        return source;
    }

    private createAlgorithm(msg: MidiMessage): Algorithm {

        let algorithm: Algorithm = new Algorithm(this.ctx);

        algorithm.modulator.connect(algorithm.modulatorGain);
        algorithm.modulatorGain.connect(<AudioNode>algorithm.carrier.frequency);
        algorithm.carrier.connect(algorithm.carrierGain);
        algorithm.carrierGain.connect(this.analyser);
        algorithm.modulator.connect(algorithm.feedbackGain);
        algorithm.feedbackGain.connect(<AudioNode>algorithm.modulator.frequency);

        let presetList = {
            name: "Elec.Piano1",
            freqRatio: [1, 9],
            feedback: 0,
            outRatio: [50, 55]
        };
        let freq = msg.frequency;
        algorithm.modulator.frequency.value = presetList.freqRatio[1] * freq;
        algorithm.carrier.frequency.value = presetList.freqRatio[0] * freq; // 音階を変える
        algorithm.feedbackGain.gain.value = presetList.feedback;
        algorithm.modulatorGain.gain.value = (presetList.outRatio[1] / 100) * 1024;
        algorithm.carrierGain.gain.value = (presetList.outRatio[0] / 100);

        return algorithm;

    }

}

class Algorithm {
    public modulator: OscillatorNode;
    public carrier: OscillatorNode;
    public modulatorGain: GainNode;
    public carrierGain: GainNode;
    public feedbackGain: GainNode;
    public feedbackGain2: GainNode;


    constructor(ctx: AudioContext) {
        this.modulator = ctx.createOscillator();
        this.carrier = ctx.createOscillator();
        this.modulatorGain = ctx.createGain();
        this.carrierGain = ctx.createGain();
        this.feedbackGain = ctx.createGain();
        this.feedbackGain2 = ctx.createGain();

    }

    public start(when: number = 0): void {
        this.modulator.start(when);
        this.carrier.start(when);
    }

    public stop(when: number = 0): void {
        this.modulator.stop(when);
        this.carrier.stop(when);
    }
}

class Envelope {

    constructor(public attack: number,
                public decay : number,
                public sustain : number,
                public release: number
    ) {}

    setEnvelope (context: AudioContext) {


        return {
            down: (gain: GainNode) => {
                let now = context.currentTime;
                let modulatorRootValue = gain.gain.value;  // Attackの目標値をセット
                gain.gain.cancelScheduledValues(0);      // スケジュールを全て解除
                gain.gain.setValueAtTime(0.0, now);      // 今時点を音の出始めとする
                gain.gain.linearRampToValueAtTime(modulatorRootValue, now + this.attack);
                // ▲ rootValue0までm_attack秒かけて直線的に変化
                gain.gain.linearRampToValueAtTime(this.sustain * modulatorRootValue, now + this.attack + this.decay);
                // ▲ m_sustain * modulatorRootValueまでm_attack+m_decay秒かけて直線的に変化
            },
            up: (gain) => {
                let now = context.currentTime;
                let modulatorRootValue = gain.gain.value;
                gain.gain.cancelScheduledValues(0);
                gain.gain.setValueAtTime(modulatorRootValue, now);
                gain.gain.linearRampToValueAtTime(modulatorRootValue, now);
                gain.gain.linearRampToValueAtTime(0.0, now + this.release);
            }
        }
    }
}