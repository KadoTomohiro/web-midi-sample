import {Injectable, EventEmitter, Output} from '@angular/core';
import {NavigatorRef} from './navigatorRef';

@Injectable()
export class MidiService {
    @Output() midiIn: EventEmitter<any>;
    private inputs: WebMidi.MIDIInputMap;
    private outputs: WebMidi.MIDIOutputMap;

    public onInit: Promise<WebMidi.MIDIAccess>;

    constructor(private navRef: NavigatorRef) {

        this.midiIn = new EventEmitter();
        navRef.navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {

            this.inputs = midi.inputs;
            this.inputs.forEach(( input: WebMidi.MIDIInput) => {
                input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => this.midiIn.emit(e);
            });

            this.outputs = midi.outputs;

        });


    }


}