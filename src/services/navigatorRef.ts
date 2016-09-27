import {Injectable} from '@angular/core';

@Injectable()
export class NavigatorRef {
  get navigator(): Navigator {
    return window.navigator;
  }
}