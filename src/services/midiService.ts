import {Injectable, EventEmitter, Output} from '@angular/core';
import {NavigatorRef} from './navigatorRef';

@Injectable()
export class MidiService {
    @Output() midiIn: EventEmitter<any>;
    public inputs: Map<string, WebMidi.MIDIInput>;

    constructor(private navRef: NavigatorRef) {

        this.midiIn = new EventEmitter();
        navRef.navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {

            this.inputs = midi.inputs;

            this.inputs.forEach(( input: WebMidi.MIDIInput) => {
                input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => this.midiIn.emit(e);
            });

            // midiOutputはmidi.outputsで取得できる
        });
    }


}