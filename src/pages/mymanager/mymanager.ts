import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentOptionsPage } from '../payment-options/payment-options';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MymanagerPage');
  }

  apply()
  {
    this.navCtrl.push(PaymentOptionsPage,{val:1000})
  }
}
