import { Component, Input } from '@angular/core';

@Component({
    selector: 'keyboard',
    template: `
    `
})
export class KeyboardComponent {

    @Input() lowest: number;
    @Input() highest: number;

    constructor () {

    }


}