import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage'
/**
 * Generated class for the TermsConditionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {
items:any
  http:any
  constructor(public menu: MenuController,public storage: Storage,http: Http,public navCtrl: NavController, public navParams: NavParams) {
    this.http = http
    this.storage.get("Hash").then((hash)=>{  
    let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': hash
      });
      let options = new RequestOptions({ headers: headers });
      this.http
          .get('http://forehotels.com:3000/api/config', options)
          .subscribe(
              data => {
                  
                this.items = JSON.parse(data._body);
                this.items= this.items[2].cnf_desc
              })
    })
    
  }
  
}
