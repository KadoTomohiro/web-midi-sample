import {Component, Input, Output, EventEmitter} from "@angular/core";
import {IConnectorParam} from "../synthesizer/synthesizer.component";

@Component({
    selector:'connector',
    templateUrl: './components/connector/connector.component.html',
    styleUrls: ['./components/connector/connector.component.css']
})
export class ConnectorComponent {

    @Input() connector: IConnectorParam;
    @Output() change: EventEmitter<IConnectorParam>;
    @Output() delete: EventEmitter<string>;

    gainValue: number;
    attack: number;
    decay: number;
    sustain: number;
    release: number;

    constructor() {
        this.change = new EventEmitter<IConnectorParam>();
        this.delete = new EventEmitter<string>();
    }

    onChange($event) {

        let changeParam: IConnectorParam = {
            uuid: this.connector.uuid,
            gainValue: this.connector.gainValue,
            connectionTo:{
                uuid: this.connector.connectionTo.uuid,
                name: this.connector.connectionTo.name
            } ,
            envelope:{
                attack: this.connector.envelope.attack,
                decay: this.connector.envelope.decay,
                sustain: this.connector.envelope.sustain,
                release: this.connector.envelope.release
            }
        };

        this.change.emit(changeParam);
    }

    onDisconnect() {
        this.delete.emit(this.connector.uuid);
    }

}