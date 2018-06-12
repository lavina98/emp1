import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentOptionsPage } from '../payment-options/payment-options';
import { Http,RequestOptions,Headers} from "@angular/http";
import { Storage } from '@ionic/storage';
/**
 * Generated class for the MymanagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mymanager',
  templateUrl: 'mymanager.html',
})
export class MymanagerPage {

  http:any;
  hash:any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams
              ,http:Http,
              private storage:Storage) {
    this.http=http;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MymanagerPage');
    this.storage.get('user').then((user)=>{
      console.log(user);}
    );
  }

  apply()
  {
    this.storage.get('Hash').then((hash) => {
      this.storage.get('user').then((user)=>{
        console.log(user);
      
      this.hash = hash;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let body=JSON.stringify({
        emp_id:user.id
    });
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://www.forehotels.com:3000/api/mymanager',body,options).subscribe(
      (data)=>{
        console.log(data.json());
      },
      (err)=>{
        console.log(err);
      }
    );

     this.navCtrl.push(PaymentOptionsPage,{val:1500})
      });
  });
  }
}
