import {Component, ViewChild, ElementRef, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {AudioService} from '../../services/audioService';
@Component({
    selector: 'wave',
    template: `
      <canvas #wave [attr.width]="width" [attr.height]="height"></canvas>
    `,
    styles: ['canvas {border: black solid 1px;}']
})
export class WaveComponent implements OnInit {


    @Input() analyser: AnalyserNode;
    @Input() width = 100;
    @Input() height = 100;
    @Input() type = AudioService.waveType.time;

    @ViewChild('wave') wave: ElementRef;

    interval: Observable<any>;

    constructor() {
        this.interval = Observable.interval(50);
    }

    ngOnInit() {
        let waveCanvas = this.wave.nativeElement;
        let canvasContext = waveCanvas.getContext('2d');

        this.interval.subscribe(() => {

            let wave: Uint8Array = AudioService.getWaveSource(this.type, this.analyser);

            // Clear previous data
            canvasContext.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
            // Draw sound wave
            canvasContext.beginPath();

            for (let i = 0, len = wave.length; i < len; i++) {
                let x = (i / len) * waveCanvas.width;
                let y = (1 - (wave[i] / 255)) * waveCanvas.height;
                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }
            }
            canvasContext.stroke();

        });
    }


}