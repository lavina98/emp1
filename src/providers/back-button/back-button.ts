import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the BackButtonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BackButtonProvider {
public active: boolean = false;

  constructor(public http: Http) {
    console.log('Hello BackButtonProvider Provider');
  }

  public setActive() {
    this.active = !this.active;
  }

  public isActive() {
    return this.active;
  }

}
