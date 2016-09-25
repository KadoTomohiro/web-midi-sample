import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>{{title}}</h1>
  `,
})
export class AppComponent {
  title: string = 'Hello World!';

  inputs:any[] = [];
  outputs:any[] = [];
  navigator: Navigator = window.navigator;

  constructor() {

    this.navigator.requestMIDIAccess().then(this.onMIDISuccess);
  }

  onMIDISuccess(midi: WebMidi.MIDIOptions) {
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
    let cmd = midiMessages[0];
    let note = midiMessages[1];
    let velocity = midiMessages[2];
    console.log(`command:${cmd.toString(16)}, note number:${note}, velocity:${velocity}`);
  }
}