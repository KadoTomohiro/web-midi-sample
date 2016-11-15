import { NgModule }       from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from '../components/app.component';
import { WaveComponent } from '../components/wave/wave.component';
import { MidiService } from '../services/midiService';
import { AudioService } from '../services/audioService';
import { NavigatorRef } from '../services/navigatorRef';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    MidiService,
    AudioService,
    NavigatorRef
  ],
  declarations: [
    AppComponent,
    WaveComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}