import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UUID} from "angular2-uuid";
import {IOperatorParams} from "../synthesizer/synthesizer.component";

@Component({
    selector: 'operator',
    templateUrl: './components/operator/operator.component.html',
    styleUrls: ['./components/operator/operator.component.css']
})
export class OperatorComponent {

    @Input() operator: IOperatorParams;
    @Input('connection-points') connectionPoints: Array<string>;

    @Output() connect: EventEmitter<string>;

    newConnection: string;
    // public connections = new Array<Connection>();

    constructor() {
        this.connect = new EventEmitter();
    }

    addConnection(): void {
        this.connect.emit(this.newConnection);
        // console.log(this.newConnection);
        // let newConnection = new Connection(this.newConnection);
        // this.connections.push(newConnection);
        // this.newConnection = "";
    }

    discconect(id: string) {
        // let index = this.connections.findIndex(e => e.id === id);
        // this.connections.splice(index, 1);
    }

    delete() {

    }

}

class Connection {
    public id: string;

    constructor(public name: string) {
        this.id = UUID.UUID();
    }
}