import {Injectable, EventEmitter, Output} from '@angular/core';
import {NavigatorRef} from './navigatorRef';
@Injectable()
export class MidiService {
  @Output() midiIn: EventEmitter<any>;
  private inputs: WebMidi.MIDIInputMap;
  private outputs: WebMidi.MIDIOutputMap;
  public onInit: Promise<WebMidi.MIDIAccess>;

  constructor(private navRef: NavigatorRef) {
    this.midiIn = new EventEmitter();
    this.onInit = navRef.navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {
      this.inputs = midi.inputs;
      this.inputs.forEach((input: WebMidi.MIDIInput) => {
        // input.onmidimessage = this.onMidiMessage;
        input.addEventListener('midimessage', (e: WebMidi.MIDIMessageEvent) => this.midiIn.emit(e));
      });
      this.outputs = midi.outputs;
      return midi;
    });
  }

}


export class MidiMessage {

  static readonly NOTE_ON = 0x9;
  static readonly NOTE_OFF = 0x8;

  private _message: Uint8Array;

  constructor(message: Uint8Array) {
    this._message = message;
  }

  get status(): number {
    return this._message[0];
  }

  get statusNo(): number {
    // ステータスバイトの上位4bitがチャンネルNo
    // ex) 0x90 -> 1001 0000
    return (this.status & 0xf0) >> 4;
  }

  get channelNo(): number {
    // ステータスバイトの下位4bitがチャンネルNo
    // ex) 0x90 -> 1001 0000
    return this.status & 0xf;
  }

  get noteNo(): number {
    return this._message[1];
  }

  get velocity(): number {
    return this._message[2];
  }

  get frequency(): number {
    return 440.0 * Math.pow(2.0, (this.noteNo - 69.0) / 12.0);
  }
}