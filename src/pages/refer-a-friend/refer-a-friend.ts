import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-refer-a-friend',
  templateUrl: 'refer-a-friend.html'
})
export class ReferAFriendPage {
http:any;
items:any;
code:any;
hash:any;
  constructor(public modalCtrl: ModalController,
              http: Http,
              public network: NetworkServiceProvider,
              private storage: Storage,
              public navCtrl: NavController, 
              public platform: Platform,
              public navParams: NavParams,
              private ga:GoogleAnalytics,
              private social: SocialSharing) {
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{           
          this.storage.get('Hash').then((hash) => {
            this.hash = hash;
          });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });
    let options = new RequestOptions({ headers: headers });
    this.http = http;
            this.storage.get('user').then((id) =>{
            this.platform.ready().then(() => {
                this.ga.trackEvent("Refer A Friend Page", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Refer A Friend")
            })
        });
      this.storage.get('id').then((id) => {
      this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Users;
             this.code = id;
             });
        });
    }
}
Share(){
     this.social.share("Download a perfect app for Hospitality. Enter Code '" +this.code+ "' during registration", null /*Image*/,null,  "https://play.google.com/store/apps/details?id=com.forehotels.v100" /* url */)
      .then(()=>{
      },
      ()=>{
      })
   }
checkReferral() {
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
      let modal = this.modalCtrl.create(CheckReferralPage);
        modal.present();
     }
   }
}
@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
     Your Referrals
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon name="md-close" showWhen="android,windows,ios"></ion-icon>
      </button>
     </ion-buttons> 
  </ion-toolbar>
</ion-header>
<ion-content>
<div class="cont">
  <div *ngIf="items?.length == 0">
    <h5 style="color:black;text-align:center;padding:10px">No user has registered using your Referral Code</h5> 
  </div>
  <div *ngFor="let item of items">
  <h3 style="color:black;text-align:center">{{item.name}}</h3>

      <div class="progress-outer">
            <div class="progress-inner" [style.width]="item.stage + '%'">
                {{item.stage}} %
            </div>
        </div>
     </div>   
 </div>       
</ion-content>`
})
export class CheckReferralPage{
http:any;
hash:any;
items:any;
referral_id:any;
constructor(public storage: Storage,public navCtrl: NavController,http: Http,public viewCtrl: ViewController){
        this.http = http;
        this.storage.get('id').then((id) =>{
        this.referral_id = id;
             });
        this.storage.get('Hash').then((id) =>{
        this.hash = id;
        let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      });
      let options = new RequestOptions({ headers: headers });
       this.http.get("http://forehotels.com:3000/api/referral/"+this.referral_id, options)
               .subscribe(data =>{
                this.items=JSON.parse(data._body).Users;
                },error=>{
                   console.log(error);
               } );
         }); 
      }
      dismiss() {
    this.viewCtrl.dismiss();
  }
}
