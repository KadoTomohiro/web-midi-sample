import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'keyboard',
    templateUrl: './components/keyboard/keyboard.component.html',
    styleUrls: ['./components/keyboard/keyboard.component.css']
})
export class KeyboardComponent {

    @Output() midiMessage: EventEmitter;

    private static readonly NOTE_NAMES = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B"
    ];


    keys: Array<Key>;

    constructor() {
        this.keys = [
            {note: 60},
            {note: 61},
            {note: 62},
            {note: 63},
            {note: 64},
            {note: 65},
            {note: 66},
            {note: 67},
            {note: 68},
            {note: 69},
            {note: 70},
            {note: 71},
            {note: 72},
            {note: 73},
            {note: 74},
            {note: 75},
            {note: 76},
            {note: 77}
        ]

        this.midiMessage = new EventEmitter<Uint8Array>();

    }


    isBlackKey(key: Key): boolean {
        let noteNames = KeyboardComponent.NOTE_NAMES;
        let noteName = noteNames[key.note % 12];

        let regex = /#/;

        return regex.test(noteName);
    }

    isWhiteKey(key: Key): boolean {
        return !this.isBlackKey(key);
    }

    keyDown(key: Key) {
        this.midiMessage.emit(new Uint8Array([0x90, key.note, 127]));
    }

    keyUp(key: Key) {
        this.midiMessage.emit(new Uint8Array([0x80, key.note, 64]));
    }


}

interface Key {
    note: number
}