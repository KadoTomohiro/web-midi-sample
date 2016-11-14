import {Injectable} from '@angular/core';
import {MidiMessage} from './midiService'

Injectable();
export class AudioService {

    private ctx: AudioContext;
    // private vcos: Map<number, OscillatorNode>;
    private algorithms: Map<number, any>;

    private analyser: AnalyserNode;
    oscType: string;

    constructor() {
        this.ctx = new AudioContext();
        // this.vcos = new Map<number, OscillatorNode>();
        this.algorithms = new Map<number, any>();
        this.analyser = this.ctx.createAnalyser();

        this.analyser.connect(this.ctx.destination);

        this.oscType = this.OscillatorType[0];

    }

    OscillatorType = [
        "sine",
        "square",
        "sawtooth",
        "triangle"
    ];

    public audioOn(msg: MidiMessage) {

        let algorithm: Algorithm = this.createAlgorithm(msg);

        algorithm.start(0);

        this.algorithms.set(this.getFrequencyKey(msg), algorithm);

        console.log('start');
    }

    public audioOff(msg: MidiMessage) {

        let algorithm: Algorithm = this.algorithms.get(this.getFrequencyKey(msg));
        if (algorithm) algorithm.stop(0);
        console.log('stop');
    }

    private getFrequencyKey(msg: MidiMessage): number {
        return (msg.channelNo << 8) + msg.noteNo;
    }

    public getTimeWave(): Uint8Array {
        let times = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(times);

        return times;
    }

    private createAlgorithm(msg: MidiMessage): Algorithm {

        let algorithm: Algorithm = new Algorithm(this.ctx);

        algorithm.modulator.connect(algorithm.modulatorGain);
        algorithm.modulatorGain.connect(algorithm.carrier.frequency);
        algorithm.carrier.connect(algorithm.carrierGain);
        // algorithm.carrierGain.connect(this.ctx.destination);
        algorithm.carrier.connect(this.analyser);
        algorithm.modulator.connect(algorithm.feedbackGain);
        algorithm.feedbackGain.connect(algorithm.modulator.frequency);


        algorithm.carrier.frequency.value = msg.frequency;

        var presetList = {
            name: "Elec.Piano1",
            freqRatio: [1, 9],
            feedback: 0,
            outRatio: [99, 55]
        };
        var freq = algorithm.carrier.frequency.value ;
        algorithm.modulator.frequency.value = presetList.freqRatio[1] * freq;
        algorithm.carrier.frequency.value = presetList.freqRatio[0] * freq; // 音階を変える
        algorithm.feedbackGain.gain.value = presetList.feedback;
        algorithm.modulatorGain.gain.value = (presetList.outRatio[1] / 100) * 1024;
        algorithm.carrierGain.gain.value = (presetList.outRatio[0] / 100);

        var now = this.ctx.currentTime;
        var m_attack = 0, m_decay = 0.5, m_sustain = 0.3, m_release = 0.5;
        var c_attack = 0.4, c_decay = 0.3, c_sustain = 0.7, c_release = 0.4;

        var modulatorRootValue = algorithm.modulatorGain.gain.value;  // Attackの目標値をセット
        algorithm.modulatorGain.gain.cancelScheduledValues(0);      // スケジュールを全て解除
        algorithm.modulatorGain.gain.setValueAtTime(0.0, now);      // 今時点を音の出始めとする
        algorithm.modulatorGain.gain.linearRampToValueAtTime(modulatorRootValue, now + m_attack);
// ▲ rootValue0までm_attack秒かけて直線的に変化
        algorithm.modulatorGain.gain.linearRampToValueAtTime(m_sustain * modulatorRootValue, now + m_attack + m_decay);
// ▲ m_sustain * modulatorRootValueまでm_attack+m_decay秒かけて直線的に変化

        var carrierRootValue = algorithm.carrierGain.gain.value;      // Attackの目標値をセット
        algorithm.carrierGain.gain.cancelScheduledValues(0);        // スケジュールを全て解除
        algorithm.carrierGain.gain.setValueAtTime(0.0, now);        // 今時点を音の出始めとする
        algorithm.carrierGain.gain.linearRampToValueAtTime(carrierRootValue, now + c_attack);
// ▲ rootValue0までc_attack秒かけて直線的に変化
        algorithm.carrierGain.gain.linearRampToValueAtTime(c_sustain * carrierRootValue, now + c_attack + c_decay);
// ▲ c_sustain * carrierRootValueまでc_attack+c_decay秒かけて直線的に変化

        return algorithm;

    }


}

class Algorithm {
    public modulator: OscillatorNode;
    public carrier: OscillatorNode;
    public modulatorGain: GainNode;
    public carrierGain: GainNode;
    public feedbackGain: GainNode;

    constructor(ctx: AudioContext) {
        this.modulator = ctx.createOscillator();
        this.carrier = ctx.createOscillator();
        this.modulatorGain = ctx.createGain();
        this.carrierGain = ctx.createGain();
        this.feedbackGain = ctx.createGain();
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

