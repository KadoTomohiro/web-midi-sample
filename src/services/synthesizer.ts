import {
    IEnvelopeParams, IConnectorParam, ISynthesizerParas,
    IOperatorParams
} from "../components/synthesizer/synthesizer.component";
import {MidiMessage} from "./midiService";

export class Synthesizer {
    private operators: Map<string, Operator>;
    private maxRelease: number;
    analyser: AnalyserNode;

    constructor(context: AudioContext, param: ISynthesizerParas, analyser: AnalyserNode) {
        this.operators = new Map<string, Operator>();
        this.analyser = analyser;

        param.operators.forEach(operator => {
            this.operators.set(operator.uuid, new Operator(context, operator))
        });

        this.operators.forEach((operator) => {
            operator.connectors.forEach(connector => {
                if (connector.connectionTo === param.destinationId) {
                    connector.gain.connect(this.analyser);
                } else {
                    let connectionPoint = this.operators.get(connector.connectionTo);
                    connector.gain.connect(<AudioNode>connectionPoint.connectionPoint);
                }
            });
        });

        this.maxRelease = this.getMaxRelease();
    }

    down(context: AudioContext, message: MidiMessage) :void {
        this.operators.forEach(operator => operator.down(context, message));
    }

    up(context: AudioContext, message: MidiMessage) :void {
        this.operators.forEach(operator => operator.up(context, message, this.maxRelease));
    }

    getMaxRelease(): number {
        let max = 0;
        this.operators.forEach(operator => {
            operator.connectors.forEach(connector => {
                let release = connector.envelope.release;
                max = max > release ? max : release;
            });
        });

        return max;
    }
}

class Operator {

    oscillator: OscillatorNode;
    analyser: AnalyserNode;
    connectors: Map<string, Connector>;
    frequencyRatio: number;

    constructor(context: AudioContext, param: IOperatorParams) {
        this.oscillator = context.createOscillator();
        this.analyser = context.createAnalyser();
        this.connectors = new Map<string, Connector>();
        this.frequencyRatio = param.frequency;

        param.connectors.forEach(connector => {
            this.connectors.set(connector.uuid, new Connector(context, connector));
        });

        this.oscillator.connect(this.analyser);

        this.connectors.forEach(connector => {
            this.analyser.connect(connector.gain);
        })
    }

    get connectionPoint():AudioParam {
        return this.oscillator.frequency;
    }


    down(context: AudioContext, message: MidiMessage) {
        let freq = message.frequency;
        this.oscillator.frequency.value = freq * this.frequencyRatio;
        this.connectors.forEach(connector => connector.down(context, message));
        this.oscillator.start(0);
    }
    up(context: AudioContext, message: MidiMessage, maxRelease: number) {
        this.connectors.forEach(connector => connector.up(context, message));
        let now = context.currentTime;

        this.oscillator.stop(now + maxRelease);
    }
}

class Connector {

    gainValue: number;
    envelope: Envelope;
    connectionTo: string;

    gain: GainNode;

    constructor (context: AudioContext ,gainParam: IConnectorParam) {
        this.gainValue = gainParam.gainValue;
        this.envelope = new Envelope(gainParam.envelope);
        this.connectionTo = gainParam.connectionTo.uuid;
        this.gain = context.createGain();
        this.gain.gain.value = this.gainValue / 100;
    }

    down(context: AudioContext, message: MidiMessage) {
        let now = context.currentTime;
        let modulatorRootValue = this.gain.gain.value;  // Attackの目標値をセット
        this.gain.gain.cancelScheduledValues(0);      // スケジュールを全て解除
        this.gain.gain.setValueAtTime(0.0, now);      // 今時点を音の出始めとする
        this.gain.gain.linearRampToValueAtTime(modulatorRootValue, now + this.envelope.attack);
        // ▲ rootValue0までm_attack秒かけて直線的に変化
        this.gain.gain.linearRampToValueAtTime(this.envelope.sustain * modulatorRootValue, now + this.envelope.attack + this.envelope.decay);
        // ▲ m_sustain * modulatorRootValueまでm_attack+m_decay秒かけて直線的に変化
    }

    up(context: AudioContext, message: MidiMessage) {
        let now = context.currentTime;
        let modulatorRootValue = this.gain.gain.value;
        this.gain.gain.cancelScheduledValues(0);
        this.gain.gain.setValueAtTime(modulatorRootValue, now);
        this.gain.gain.linearRampToValueAtTime(modulatorRootValue, now);
        this.gain.gain.linearRampToValueAtTime(0.0, now + this.envelope.release);
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
}