import {Component, Input, Output, EventEmitter} from "@angular/core";
import {IConnectorParam} from "../synthesizer/synthesizer.component";

@Component({
    selector:'connector',
    templateUrl: './components/connector/connector.component.html',
    styleUrls: ['./components/connector/connector.component.css']
})
export class ConnectorComponent {

    @Input() connector: IConnectorParam;
    @Output() disconnect: EventEmitter<string>;

    constructor() {
        this.disconnect = new EventEmitter();
    }

    onChange($event) {
        console.log($event);
    }

    onDisconnect() {
        // this.disconnect.emit(this.connectionPoint.id);
    }

}