import { NgModule }       from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from '../components/app.component';
import {MidiService} from '../services/midiService';
import {NavigatorRef} from '../services/navigatorRef';

@NgModule({
  imports: [
    BrowserModule
  ],
  providers: [
    MidiService,
    NavigatorRef],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}