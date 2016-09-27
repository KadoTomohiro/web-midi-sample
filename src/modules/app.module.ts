import { NgModule }       from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from '../components/app.component';
import {MidiService} from '../services/midiService';

@NgModule({
  imports: [
    BrowserModule
  ],
  providers: [MidiService],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}