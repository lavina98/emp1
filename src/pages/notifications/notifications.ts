import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ScheduleInterviewPage } from '../schedule-interview/schedule-interview';
import { ReferAFriendPage } from '../refer-a-friend/refer-a-friend';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JobDetailPage } from '../job-detail/job-detail';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {
  ionViewDidEnter(){
    this.loadData()
  }
http:any;
notifications:any;
type1:any;
type2:any;
hash:any;
color: any;
  constructor(public storage: Storage,
              http: Http,
              public network: NetworkServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              private iab:InAppBrowser,
              private ga: GoogleAnalytics) {
              this.http = http;
  }
  loadData(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
          this.storage.get('user').then((id) =>{
            this.platform.ready().then(() => {
                this.ga.trackEvent("Notifications Page", "Opened","New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)          
                this.ga.trackView("Notification")
              });
          })
    this.storage.get('Hash').then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
    this.storage.get('id').then((id) => {
              let body = JSON.stringify({
                user_id: id
              });
       this.http.post("http://forehotels.com:3000/api/users_notification/", body, options)
            .subscribe(data =>{
             this.notifications=JSON.parse(data._body).notification;
             },error=>{
                console.log(error);
              });
          });
        });
    }
  }    
  delete(item){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
    this.storage.get("Hash").then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
       this.http.delete("http://forehotels.com:3000/api/notification/"+item.n_id, options)
            .subscribe(
            data => {
              let res = data.json();
              this.loadData()
          });
   });
    }
  }     
 openPage(item){
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
  else{ 
     this.storage.get("Hash").then((hash) => {
     let body = JSON.stringify({
                n_id: item.n_id
              });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
       this.http.put("http://forehotels.com:3000/api/notification/", body, options)
            .subscribe(
            data => {
              let res = data.json();
          });
   });
   if(item.type == 1){
     this.navCtrl.push(JobDetailPage,{
       job: item.data
     });
   }
   if(item.type == 2){
     this.navCtrl.push(ScheduleInterviewPage,{
       sc: item.data
     })
   }
   if(item.type == 3){
    this.navCtrl.push(ReferAFriendPage,{
      ref: item.data
    });
  }
   if(item.type == 4){
     let browser = this.iab.create(item.data, '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");
     }
    }  
  }
}