import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { JobDetailPage } from '../job-detail/job-detail';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
/*
  Generated class for the JobsApplied page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-jobs-applied',
  templateUrl: 'jobs-applied.html'
})
export class JobsAppliedPage {
items:any;
http:any;
count:any;
empid:any;
pagename
   constructor(public storage: Storage,
               public navCtrl: NavController, 
               http: Http, 
               public navParams: NavParams,
               private platform: Platform,
               public network: NetworkServiceProvider,
               public loadingCtrl: LoadingController,
               private ga: GoogleAnalytics) {
                 this.pagename = navParams.get('pagename')
       if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
       let loader = this.loadingCtrl.create({
       spinner: 'bubbles',
       content: `Please Wait...`,
    });
    loader.present();
      this.storage.get('user').then((id) =>{
          this.platform.ready().then(() => {
              this.ga.trackEvent("Job Applied Page", "Opened", "New Session Started", id, true)
              this.ga.setAllowIDFACollection(true)
              this.ga.setUserId(id)
              this.ga.trackView("Job Applied")
            });
      });
    storage.get('id').then((id) =>{
        this.empid = id;
    });
    storage.get('Hash').then((hash) => {

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
    this.http = http;
      this.http.get("http://forehotels.com:3000/api/applied/"+this.empid, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Users_Applied;
             loader.dismiss()
             this.count = this.items.length;
            },error=>{
                console.log(error);
            } );
        });
    }
  }
    jobdetail(job){
   this.navCtrl.push(JobDetailPage, {
      job: job,
      pagename: this.pagename,
    });
  }
}
