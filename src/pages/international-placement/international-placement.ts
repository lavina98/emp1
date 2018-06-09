import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PaymentOptionsPage } from '../payment-options/payment-options';
import 'rxjs/Rx';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-international-placement',
  templateUrl: 'international-placement.html'
})
export class InternationalPlacementPage {
  user:any;
  empname:any;
  checkapplied:any;
  http:any;
  hash:any;
  constructor(private loadCtrl: LoadingController,
              public navCtrl: NavController,
              http: Http, 
              public network: NetworkServiceProvider,
              private platform: Platform,
              private storage: Storage, 
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics) {
              this.http = http;
              this.storage.get('user').then((id) =>{
                this.user = id;
                this.platform.ready().then(() => { 
                this.ga.trackEvent("International Placement Page", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("International Placement")
                });
              });

}
    intplacement(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{
    var applied =false
    this.storage.get('Hash').then((hash) => {
      this.hash = hash;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });

    this.http.get("http://forehotels.com:3000/api/international_placement/"+this.user.id, options)
            .subscribe(data =>{
             this.checkapplied=JSON.parse(data._body).Users;
                for(let item of this.checkapplied ){
                  if(item.paid == 1){
                    let alert = this.alertCtrl.create({
                    title: 'Oops..!!',
                    subTitle: 'You have already applied for international placement.',
                    buttons: ['OK']
                    });
                  alert.present();
                  applied =true;
                  }
                }
                this.check(applied)
              },error=>{
                console.log(error);
              });
      });
    }
  }
    check(applied){
      if(applied == false){
              this.navCtrl.push(PaymentOptionsPage,{val:1500});
      }
    }
}
