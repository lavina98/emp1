import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, Platform } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-urgent-need',
  templateUrl: 'urgent-need.html'
})
export class UrgentNeedPage {
employee_id:any;
hash:any;
http:any
constructor(public storage: Storage,
              http: Http,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private network: NetworkServiceProvider,
              public ga:GoogleAnalytics,
              public platform: Platform, 
              public alertCtrl: AlertController) {
              this.http = http;
              this.storage.get('id').then((id) =>{
                    this.employee_id = id; 
                });
              this.storage.get('Hash').then((hash) => {
                    this.hash = hash;
              });
              this.storage.get('id').then((id) => {
              this.platform.ready().then(() => {
                  this.ga.trackEvent("Urgent Need Page", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Urgent Need")
              });
        });
}

urgentNeed(){
        if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
                let body = JSON.stringify({
                  employee_id: this.employee_id  
                });
                let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': this.hash
                });
                let options = new RequestOptions({ headers: headers });
                  this.http
                        .post('http://forehotels.com:3000/api/urgent_need', body, options)
                        .map(res => res.json())
                        .subscribe(data =>{
                      let alert = this.alertCtrl.create({
                      title: 'Successful',
                      subTitle: 'We will contact you As early as Possible.',
                      buttons: ['OK']
                      });
                      alert.present();
                      setTimeout(() => {
                      this.navCtrl.setRoot(DashboardPage);
                      }, 2000);
                        },error=>{
                            console.log(error);// Error getting the data
                        } );
              }
      }
}
