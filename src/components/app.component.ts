import {Component, ChangeDetectorRef} from '@angular/core';
import {MidiService} from '../services/midiService';

@Component({
    selector: 'my-app',
    template: `
  <h1>{{title}}</h1>
  <p>midi command: 0x{{midiCmd}}</p>
  <p>note number: {{noteNumber}}</p>
  <p>velocity: {{velocity}}</p>
  `,
})
export class AppComponent {
    title: string = 'Midi Sample';

    midiCmd: string;
    noteNumber: number;
    velocity: number;

    constructor(private midiService: MidiService, private ref: ChangeDetectorRef) {
        this.midiService.midiIn.subscribe((e: WebMidi.MIDIMessageEvent) => this.onMidiMessage(e));
    }

    onMidiMessage(e: WebMidi.MIDIMessageEvent): void {
        let midiMessages = e.data;
        this.midiCmd = midiMessages[0].toString(16);
        this.noteNumber = midiMessages[1];
        this.velocity = midiMessages[2];

        // この処理ではバインディングされないため変更を通知
        this.ref.detectChanges();
    }

}