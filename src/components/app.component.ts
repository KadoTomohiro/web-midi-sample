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

    inputs: WebMidi.MIDIInput[];
    outputs: WebMidi.MIDIOutput[];
    navigator: Navigator = window.navigator;

    midiCmd: string = '';
    noteNumber: number = 0;
    velocity: number = 0;


    // TODO MID Accessに関する処理をサービス化して外に出す?
    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {

            console.log(this);

            let it = midi.inputs.values();
            for (let i = it.next(); !i.done; i = it.next()) {
                this.inputs.push(i.value);
            }
            let ot = midi.outputs.values();
            for (let o = ot.next(); !o.done; o = ot.next()) {
                this.outputs.push(o.value);
            }
            for (let cnt = 0; cnt < this.inputs.length; cnt++) {
                this.inputs[cnt].onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
                    console.log(this);
                    let midiMessages = e.data;
                    this.midiCmd = midiMessages[0].toString(16);
                    this.noteNumber = midiMessages[1];
                    this.velocity = midiMessages[2];
                };
            }
        });
    }

}