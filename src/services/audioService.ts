import {Injectable} from '@angular/core';
import {MidiMessage} from './midiService'

Injectable();
export class AudioService {

    private ctx: AudioContext;

    oscType: string;
    vcos: Map<number, OscillatorNode>;

    constructor () {
        this.ctx = new AudioContext();
        this.vcos = new Map<number, OscillatorNode>();
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
        vco.connect(this.ctx.destination);
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


}