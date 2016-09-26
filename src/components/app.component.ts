import {Component} from '@angular/core';

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
  title: string = 'Hello World!';

  inputs:any[] = [];
  outputs:any[] = [];
  navigator: Navigator = window.navigator;

  midiCmd: string;
  noteNumber: number;
  velocity: number;

  private MIDI_MESSAGE_INDEX: any = {
    MIDI_COMMAND: 0,
    NOTE_NUMBER: 1,
    VELOCITY: 2
  };

  // TODO MID Accessに関する処理をサービス化して外に出す?
  constructor() {

    this.navigator.requestMIDIAccess().then(this.onMIDISuccess);
  }

  onMIDISuccess(midi: WebMidi.MIDIAccess) {
    var it = midi.inputs.values();
    for (var o = it.next(); !o.done; o = it.next()) {
      this.inputs.push(o.value);
    }
    var ot = midi.outputs.values();
    for (var o = ot.next(); !o.done; o = ot.next()) {
      this.outputs.push(o.value);
    }
    for (var cnt = 0; cnt < this.inputs.length; cnt++) {
      this.inputs[cnt].onmidimessage = this.onMIDIEvent;
    }
  }

  onMIDIEvent(e) {

    let midiMessages = e.data;
    this.midiCmd = midiMessages[this.MIDI_MESSAGE_INDEX.MIDI_COMMAND].toString(16);
    this.noteNumber = midiMessages[this.MIDI_MESSAGE_INDEX.NOTE_NUMBER];
    this.velocity = midiMessages[this.MIDI_MESSAGE_INDEX.VELOCITY];
  }
}