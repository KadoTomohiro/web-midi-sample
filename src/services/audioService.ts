import {Injectable} from '@angular/core';
import {MidiMessage} from './midiService';
Injectable();
export class AudioService {
  private ctx: AudioContext;
  private vco0Map: Map<number, OscillatorNode>;
  private vco1Map: Map<number, OscillatorNode>;
  private lofMap: Map<number, OscillatorNode>;
  private vcfMap: Map<number, BiquadFilterNode>;
  private analyser: AnalyserNode;
  oscType: string;

  OscillatorType: Array<string> = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];

  constructor() {
    this.ctx = new AudioContext();
    this.vco0Map = new Map<number, OscillatorNode>();
    this.vco1Map = new Map<number, OscillatorNode>();
    this.lofMap = new Map<number, OscillatorNode>();
    this.vcfMap = new Map<number,BiquadFilterNode>();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.connect(this.ctx.destination);
    this.oscType = this.OscillatorType[0];
  }

  public audioOn(msg: MidiMessage) {
    let vco = this.ctx.createOscillator();

    let vco0 = this.ctx.createOscillator();
    let vco1 = this.ctx.createOscillator();
    let lfo = this.ctx.createOscillator();
    let vcf = this.ctx.createBiquadFilter();
    // ADSR用にGainNodeを追加
    let vco0gain = this.ctx.createGain();
    let vco1gain = this.ctx.createGain();

    // vco0.connect(vco0gain); // vco0の接続先を変更
    // vco1.connect(vco1gain); // vco1の接続先を変更
    // vco0gain.connect(vcf);  // vco0gainからvcfへ接続
    // vco1gain.connect(vcf);  // vco1gainからvcfへ接続
    // lfo.connect(vco0.frequency);
    // lfo.connect(vco1.frequency);
    // lfo.connect(vcf.detune);
    // vcf.connect(ctx.destination);
    // // 値を変更
    // vco0.type="sawtooth";
    // vco1.detune.value=-35;
    // lfo.frequency.value=2;
    // vcf.frequency.value=10000;


    // vco.connect(this.ctx.destination);
    vco.connect(this.analyser);
    vco.frequency.value = msg.frequency;
    vco.type = this.oscType;
    vco.start(0);
    this.vco0Map.set(this.getVcoKey(msg), vco);
    console.log('start');
  }

  public audioOff(msg: MidiMessage) {
    let vco = this.vco0Map.get(this.getVcoKey(msg));
    if (vco) {
      vco.stop(0);
    }
    console.log('stop');
  }

  private getVcoKey(msg: MidiMessage): number {
    return (msg.channelNo << 8) + msg.noteNo;
  }

  public getTimeWave(): Uint8Array {
    let times = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(times);
    return times;
  }

}

