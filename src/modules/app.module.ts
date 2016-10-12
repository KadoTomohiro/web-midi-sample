import { NgModule }       from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from '../components/app.component';
import {MidiService} from '../services/midiService';
import {AudioService} from '../services/audioService';
import {NavigatorRef} from '../services/navigatorRef';

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
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}