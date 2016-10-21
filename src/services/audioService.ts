import {Injectable} from '@angular/core';
import {MidiMessage} from './midiService'

Injectable();
export class AudioService {

    private ctx: AudioContext;
    private vcos: Map<number, OscillatorNode>;
    private analyser: AnalyserNode;
    oscType: string;

    constructor () {
        this.ctx = new AudioContext();
        this.vcos = new Map<number, OscillatorNode>();
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

        let vco = this.ctx.createOscillator();
        // vco.connect(this.ctx.destination);
        vco.connect(this.analyser);
        vco.frequency.value = msg.frequency;
        vco.type = this.oscType;

        vco.start(0);

        this.vcos.set(this.getVcoKey(msg), vco);

        console.log('start');
    }
    public audioOff(msg: MidiMessage) {
        let vco = this.vcos.get(this.getVcoKey(msg));
        if (vco) vco.stop(0);
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

