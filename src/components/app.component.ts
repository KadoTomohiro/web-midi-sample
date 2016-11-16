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
  <wave [analyser]="audioService.analyser" type="time" width="150"></wave>
  <wave [analyser]="audioService.analyser" type="spectrum" width="150"></wave>
  
  <operator></operator>
  `,
})
export class AppComponent {
    title: string = 'Midi Sample';

    midiStatus: string;
    noteNumber: number;
    velocity: number;
    frequency: number;
    // oscType: string;


    // oscillatorType: Array<string>;

    constructor(private midiService: MidiService, private audioService: AudioService) {


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

        if (message.statusNo === MidiMessage.NOTE_ON) {
            this.audioService.audioOn(message);
        }

        if (message.statusNo === MidiMessage.NOTE_OFF) {
            this.audioService.audioOff(message);
        }

    }

    // setOscType(type):void {
    //     this.audioService.oscType = type;
    // }

}

