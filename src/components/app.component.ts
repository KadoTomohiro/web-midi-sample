import {Component, ChangeDetectorRef, ViewChild, ElementRef, OnInit} from '@angular/core';
import {MidiService, MidiMessage} from '../services/midiService';
import {AudioService} from '../services/audioService';

import { Observable } from 'rxjs';

@Component({
    selector: 'my-app',
    template: `
  <h1>{{title}}</h1>
  <p>midi status: 0x{{midiStatus}}</p>
  <p>note number: {{noteNumber}}</p>
  <p>velocity: {{velocity}}</p>
  <p>frequency: {{frequency}}Hz</p>
  <select name="" id="" [(ngModel)]="oscType" (change)="setOscType($event.target.value)">
    <option *ngFor="let type of oscillatorType" [value]="type">{{type}}</option>
  </select>
  
  <canvas #timeWave [attr.width]="_size.width" [attr.height]="_size.height"></canvas>
  `,
})
export class AppComponent implements OnInit{
    title: string = 'Midi Sample';

    midiStatus: string;
    noteNumber: number;
    velocity: number;
    frequency: number;
    oscType: string;

    @ViewChild('timeWave') timeWave: ElementRef;
    private _size :{width: number, height: number};

    interval;

    oscillatorType: Array<string>;

    constructor(private midiService: MidiService, private audioService: AudioService, private ref: ChangeDetectorRef) {


        this.midiService.midiIn.subscribe((e: WebMidi.MIDIMessageEvent) => this.onMidiMessage(e));

        this.oscillatorType = audioService.OscillatorType;
        this.oscType = this.audioService.oscType;

        this._size = {
            width: 500,
            height:200
        };

        this.interval = Observable.interval(50);

    }

    ngOnInit() {
        let canvas = this.timeWave.nativeElement;
        let canvasContext = canvas.getContext('2d');

        this.interval.subscribe(() => {
            let times = this.audioService.getTimeWave();

            // Clear previous data
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            // Draw sound wave
            canvasContext.beginPath();


            for (var i = 0, len = times.length; i < len; i++) {
                var x = (i / len) * canvas.width;
                var y = (1 - (times[i] / 255)) * canvas.height;
                if (i === 0) {
                    // console.log('moveTo');
                    canvasContext.moveTo(x, y);
                } else {
                    // console.log('lineTo');
                    canvasContext.lineTo(x, y);
                }
            }
            canvasContext.stroke();

        });
    }

    onMidiMessage(e: WebMidi.MIDIMessageEvent): void {
        let message = new MidiMessage(e.data);
        this.midiStatus = message.status.toString(16);
        this.noteNumber = message.noteNo;
        this.velocity = message.velocity;
        this.frequency = message.frequency;

        if (message.statusNo === MidiMessage.NOTE_ON) {
            this.audioService.audioOn(message);
        }

        if (message.statusNo === MidiMessage.NOTE_OFF) {
            this.audioService.audioOff(message);
        }

        // この処理ではバインディングされないため変更を通知
        this.ref.detectChanges();
    }

    setOscType(type) {
        this.audioService.oscType = type;
    }




}

