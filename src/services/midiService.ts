import {Injectable, EventEmitter, Output} from '@angular/core';
import {NavigatorRef} from './navigatorRef';

@Injectable()
export class MidiService {
    @Output() midiIn: EventEmitter<any>;
    public inputs:  WebMidi.MIDIInput[];
    public outputs:  WebMidi.MIDIOutput[];

    constructor(private navRef: NavigatorRef) {

        this.inputs = [];
        this.outputs = [];
        this.midiIn = new EventEmitter();
        navRef.navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {
            let it = midi.inputs.values();
            // midiInputの取得
            for (let i = it.next(); !i.done; i = it.next()) {
                let input = i.value;
                // イベント処理の登録
                input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => this.midiIn.emit(e);
                this.inputs.push(input);
            }
            // midiOutputの登録
            let ot = midi.outputs.values();
            for (let o = ot.next(); !o.done; o = ot.next()) {
                this.outputs.push(o.value);
            }

        });
    }


}