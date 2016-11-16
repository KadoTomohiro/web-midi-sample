import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector:'connector',
    templateUrl: './components/connector/connector.component.html',
    styleUrls: ['./components/connector/connector.component.css']
})
export class ConnectorComponent {

    @Input('connection-point') connectionPoint: {id: string,name: string};
    @Output() disconnect: EventEmitter<string>;

    gain = 100;
    attack = 0.5;
    decay = 0.5;
    sustain = 0.5;
    release = 0.5;

    constructor() {
        this.disconnect = new EventEmitter();
    }



    onDisconnect() {
        this.disconnect.emit(this.connectionPoint.id);
    }

}