

import {IEnvelopeParams, IConnectorParam} from "../components/synthesizer/synthesizer.component";
export class Synthesizer {

}

class Operator {



    constructor(private oscillator : OscillatorNode, public analyser: AnalyserNode) {
        oscillator.connect(analyser);
    }

    get connector():AudioParam {
        return this.oscillator.frequency;
    }


}

class Gain {
    value: number;
    envelope: Envelope;
    constructor (gainParam: IConnectorParam) {
        this.value = gainParam.gainValue;
        this.envelope = new Envelope(gainParam.envelope);
    }

    setGain () {

    }
}

class Envelope {
    public attack: number;
    public decay: number;
    public sustain: number;
    public release: number;
    constructor(envelopeParam: IEnvelopeParams) {
        this.attack = envelopeParam.attack;
        this.decay = envelopeParam.decay;
        this.sustain = envelopeParam.sustain;
        this.release = envelopeParam.release;
    }

    setDown (context: AudioContext , gain: GainNode) {
        let now = context.currentTime;
        let modulatorRootValue = gain.gain.value;  // Attackの目標値をセット
        gain.gain.cancelScheduledValues(0);      // スケジュールを全て解除
        gain.gain.setValueAtTime(0.0, now);      // 今時点を音の出始めとする
        gain.gain.linearRampToValueAtTime(modulatorRootValue, now + this.attack);
        // ▲ rootValue0までm_attack秒かけて直線的に変化
        gain.gain.linearRampToValueAtTime(this.sustain * modulatorRootValue, now + this.attack + this.decay);
        // ▲ m_sustain * modulatorRootValueまでm_attack+m_decay秒かけて直線的に変化
    }
    setUp　(context: AudioContext , gain) {
        let now = context.currentTime;
        let modulatorRootValue = gain.gain.value;
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(modulatorRootValue, now);
        gain.gain.linearRampToValueAtTime(modulatorRootValue, now);
        gain.gain.linearRampToValueAtTime(0.0, now + this.release);
    }
}