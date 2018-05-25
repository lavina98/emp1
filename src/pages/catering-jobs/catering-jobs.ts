import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { JobDetailPage } from '../job-detail/job-detail';
import { Storage } from '@ionic/storage'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
/*
  Generated class for the CateringJobs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-catering-jobs',
  templateUrl: 'catering-jobs.html'
})
export class CateringJobsPage {
items:any;
http:any;
count:any;

   constructor(storage: Storage,
              public network : NetworkServiceProvider,
              public navCtrl: NavController,
              http: Http, 
              private platform: Platform,
              public loadingCtrl: LoadingController,
              private ga:GoogleAnalytics,) {
              this.items = []  
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{           
     let loader = this.loadingCtrl.create({
       spinner: `bubbles`,
      content: `Please Wait...`,
    });
    loader.present();
    storage.get('id').then((id) => {
        this.platform.ready().then(() => {
          this.ga.trackEvent("Catering Jobs", "Opened", "New Session Started", id, true)
          this.ga.setAllowIDFACollection(true)
          this.ga.setUserId(id)
          this.ga.trackView("Catering Jobs")
        })
    });
    storage.get('Hash').then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
    this.http = http;
      this.http.get("http://forehotels.com:3000/api/catering_jobs", options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs; //Bind data to items object
             loader.dismiss()
              this.count = this.items.length;
                  },error=>{
                console.log(error);// Error getting the data
            } );
     });    
    }
   }
  
  jobdetail(job){
      this.navCtrl.push(JobDetailPage, {
      job: job
    });
  }
}
