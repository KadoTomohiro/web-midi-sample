import {Component, Input, OnChanges, SimpleChange} from "@angular/core";
import {AudioService} from "../../services/audioService";
import {MidiMessage} from "../../services/midiService";
import {UUID} from "angular2-uuid";

@Component({
    selector: 'synthesizer',
    templateUrl: './components/synthesizer/synthesizer.component.html',
    styleUrls: ['./components/synthesizer/synthesizer.component.css']
})
export class SynthesizerComponent implements OnChanges {

    @Input() message: MidiMessage;
    synthesizerParam: ISynthesizerParas;
    distiation: IConnectionPoint;
    connectionPoints: Array<IConnectionPoint>;

    private counter = 0;

    constructor(private audioService: AudioService) {
        this.synthesizerParam = this.getInitParam();
        this.distiation = {uuid: UUID.UUID(), name: 'distination'};
        this.connectionPoints = [this.distiation];
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}){

        let newMessage = changes['message'];
        if(!newMessage || newMessage.isFirstChange()) {
            return;
        }
        let message = newMessage.currentValue;
        if (message.statusNo === MidiMessage.NOTE_ON) {
            this.audioService.audioOn(message);
        }
        if (message.statusNo === MidiMessage.NOTE_OFF) {
            this.audioService.audioOff(message);
        }
    }

    addOperator() {
        let newOperator = this.createNewOperator();
        this.synthesizerParam.operators.push(newOperator);
        this.connectionPoints.push({uuid: newOperator.uuid, name: newOperator.name});
    }

    private getInitParam(): ISynthesizerParas {
        return {
            operators: [this.createNewOperator()]
        }
    }

    private createNewOperator() {
        return {
            uuid: UUID.UUID(),
            frequency: 1,
            name: this.getOperatorName(),
            connectors: []
        }
    }

    private getOperatorName() {
        return `Operator${++this.counter}`;
    }





}

export interface ISynthesizerParas {
    operators: Array<IOperatorParams>;
}

export interface IOperatorParams {
    uuid: string;
    name: string;
    frequency: number;
    connectors: Array<IConnectorParam>;
}

export interface IConnectorParam {
    uuid: string;
    gainValue: number;
    connectionTo: IConnectionPoint;
    envelope: IEnvelopeParams;

}

export interface IEnvelopeParams {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export interface IConnectionPoint {
    uuid: string;
    name: string;
}