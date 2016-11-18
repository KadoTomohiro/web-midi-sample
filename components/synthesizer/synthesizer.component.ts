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
    destination: IConnectionPoint;
    connectionPoints: Array<IConnectionPoint>;

    private counter = 0;

    constructor(private audio: AudioService) {
        this.destination = {uuid: UUID.UUID(), name: 'destination'};
        this.synthesizerParam = this.getInitParam();
        this.setConnectionPointList();
        this.setSynthesizer();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}){

        let newMessage = changes['message'];
        if(!newMessage || newMessage.isFirstChange()) {
            return;
        }
        let message = newMessage.currentValue;
        if (message.statusNo === MidiMessage.NOTE_ON) {

            this.audio.audioOn(message, );
        }
        if (message.statusNo === MidiMessage.NOTE_OFF) {
            this.audio.audioOff(message);
        }
    }

    addOperator() {
        let newOperator = this.createNewOperator();
        this.synthesizerParam.operators.push(newOperator);
        this.connectionPoints.push({uuid: newOperator.uuid, name: newOperator.name});

        this.setConnectionPointList();
        this.setSynthesizer();
    }

    onChange(operator: IOperatorParams) {
        let operatorUUID = operator.uuid;

        let operatorIndex = this.synthesizerParam.operators.findIndex(e => e.uuid === operatorUUID);

        this.synthesizerParam.operators[operatorIndex] = operator;
        this.setSynthesizer();
    }

    onDelete(operatorUUID: string) {
        let operatorIndex = this.synthesizerParam.operators.findIndex(e => e.uuid === operatorUUID);
        this.synthesizerParam.operators.splice(operatorIndex, 1);

        this.setConnectionPointList();
        this.setSynthesizer();
    }

    setConnectionPointList() {
        this.connectionPoints = [this.destination];

        this.synthesizerParam.operators.forEach(e => this.connectionPoints.push({uuid: e.uuid, name: e.name}));
    }

    private getInitParam(): ISynthesizerParas {
        return {
            destinationId: this.destination.uuid,
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

    private setSynthesizer(): void {
        this.audio.param = this.synthesizerParam;
    }
}

export interface ISynthesizerParas {
    destinationId: string;
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