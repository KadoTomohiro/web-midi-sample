import {Component} from '@angular/core';
// import {WaveComponent} from './wave/wave.component';
import {MidiService, MidiMessage} from '../services/midiService';
import {AudioService} from '../services/audioService';

@Component({
    selector: 'my-app',
    template: `
  <h1>{{title}}</h1>
  <p>midi status: 0x{{midiStatus}}</p>
  <p>note number: {{noteNumber}}</p>
  <p>velocity: {{velocity}}</p>
  <p>frequency: {{frequency}}Hz</p>
  <!--<select name="" id="" [(ngModel)]="oscType" (change)="setOscType($event.target.value)">-->
    <!--<option *ngFor="let type of oscillatorType" [value]="type">{{type}}</option>-->
  <!--</select>-->
    
    <synthesizer [message]="message"></synthesizer>
  `,
})
export class AppComponent {
    title: string = 'Midi Sample';

    midiStatus: string;
    noteNumber: number;
    velocity: number;
    frequency: number;
    // oscType: string;

    message: MidiMessage;


    // oscillatorType: Array<string>;

    constructor(private midiService: MidiService) {


        this.midiService.midiIn.subscribe((e: WebMidi.MIDIMessageEvent) => this.onMidiMessage(e));

        // this.oscillatorType = audioService.OscillatorType;
        // this.oscType = this.audioService.oscType;

    }

    onMidiMessage(e: WebMidi.MIDIMessageEvent): void {
        let message = new MidiMessage(e.data);
        this.midiStatus = message.status.toString(16);
        this.noteNumber = message.noteNo;
        this.velocity = message.velocity;
        this.frequency = Math.round(message.frequency * 100) / 100;

        this.message = message;


    }

    // setOscType(type):void {
    //     this.audioService.oscType = type;
    // }

}

