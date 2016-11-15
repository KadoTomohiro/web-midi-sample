import {Component, ViewChild, ElementRef, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {AudioService} from "../../services/audioService";
@Component({
    selector: 'wave',
    template: `
      <canvas #timeWave [attr.width]="_size.width" [attr.height]="_size.height"></canvas>
    `
})
export class WaveComponent implements OnInit {

    // @Input() source: AudioService;

    @ViewChild('timeWave') timeWave: ElementRef;
    private _size: {width: number, height: number};

    interval: Observable<any>;

    constructor(private audio: AudioService) {
        this._size = {
            width: 500,
            height: 200
        };
        this.interval = Observable.interval(50);
    }

    ngOnInit() {
        let canvas = this.timeWave.nativeElement;
        let canvasContext = canvas.getContext('2d');

        this.interval.subscribe(() => {

            let source = this.audio.getTimeWave();

            // Clear previous data
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            // Draw sound wave
            canvasContext.beginPath();


            for (let i = 0, len = source.length; i < len; i++) {
                let x = (i / len) * canvas.width;
                let y = (1 - (source[i] / 255)) * canvas.height;
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
}