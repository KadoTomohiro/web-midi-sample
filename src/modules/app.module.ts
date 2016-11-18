import { NgModule }       from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from '../components/app.component';
import { WaveComponent } from '../components/wave/wave.component';
import { OperatorComponent } from "../components/operator/operator.component";
import { ConnectorComponent } from "../components/connector/connector.component";
import { SynthesizerComponent } from "../components/synthesizer/synthesizer.component";
import { MidiService } from '../services/midiService';
import { AudioService } from '../services/audioService';
import { NavigatorRef } from '../services/navigatorRef';
// import {Synthesizer} from "../services/synthesizer";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    MidiService,
    AudioService,
    NavigatorRef,
    // Synthesizer
  ],
  declarations: [
    AppComponent,
    WaveComponent,
    SynthesizerComponent,
    OperatorComponent,
    ConnectorComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}