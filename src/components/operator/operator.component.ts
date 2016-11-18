import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UUID} from "angular2-uuid";
import {
    IOperatorParams, IConnectorParam, IEnvelopeParams,
    IConnectionPoint
} from "../synthesizer/synthesizer.component";

@Component({
    selector: 'operator',
    templateUrl: './components/operator/operator.component.html',
    styleUrls: ['./components/operator/operator.component.css']
})
export class OperatorComponent {

    @Input() operator: IOperatorParams;
    @Input('connection-points') connectionPoints: Array<IConnectionPoint>;

    @Output() change: EventEmitter<IOperatorParams>;
    @Output() delete: EventEmitter<string>;

    frequency: number;
    newConnection: string;
    // public connections = new Array<Connection>();

    constructor() {
        this.change = new EventEmitter<IOperatorParams>();
        this.delete = new EventEmitter<string>()
    }


    onChange() {

        let outputParam = this.getOutputParam();
        this.change.emit(outputParam);
    }

    addConnection(): void {

        let outputParam = this.getOutputParam();

        let newConnection = this.connectionPoints.find(e => e.uuid === this.newConnection);

        let newConnector: IConnectorParam = {
            uuid: UUID.UUID(),
            gainValue: 100,
            connectionTo: {uuid: newConnection.uuid, name: newConnection.name},
            envelope: {
                attack: 0,
                decay: 0,
                sustain: 1,
                release: 0
            }
        };
        outputParam.connectors.push(newConnector);

        this.newConnection = null;

        this.change.emit(outputParam);
    }

    onChangeConnector(connectorParam: IConnectorParam) {
        let connectorUUID = connectorParam.uuid;

        let outputParam = this.getOutputParam();

        let connectorIndex = outputParam.connectors.findIndex(e => e.uuid === connectorUUID);

        outputParam.connectors[connectorIndex] = connectorParam;

        this.change.emit(outputParam);
    }

    onDisconnect(connectorUUID: string) {

        let outputParam = this.getOutputParam();

        let connectorIndex = outputParam.connectors.findIndex(e => e.uuid === connectorUUID);

        outputParam.connectors.splice(connectorIndex, 1);

        this.change.emit(outputParam);
    }

    onDelete() {
        this.delete.emit(this.operator.uuid);
    }

    getOutputParam(): IOperatorParams {
        return {
            uuid: this.operator.uuid,
            name: this.operator.name,
            frequency: this.operator.frequency,
            connectors: this.operator.connectors
        };
    }

}
