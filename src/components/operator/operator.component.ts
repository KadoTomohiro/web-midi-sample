import { Component, Input } from '@angular/core';
import {UUID} from "angular2-uuid";

@Component({
    selector: 'operator',
    templateUrl: './components/operator/operator.component.html',
    styleUrls: ['./components/operator/operator.component.css']
})
export class OperatorComponent {

    @Input() name: string;
    @Input() operators: Array<string>;
    newConnection: string;
    frequency = 1;
    public connections= new Array<Connection>();

    constructor() {
        this.operators = [];
        this.operators.push('operator1');
        this.operators.push('operator2');
        this.operators.push('operator3');
    }

    addCollection (): void {
        console.log(this.newConnection);
        let newConnection = new Connection(this.newConnection);
        this.connections.push(newConnection);
        this.newConnection = "";
    }

    discconect(id: string) {
        let index = this.connections.findIndex(e => e.id === id);
        this.connections.splice(index,1);
    }

}

class Connection {
    public id: string;
    constructor (public name: string) {
        this.id = UUID.UUID();
    }
}