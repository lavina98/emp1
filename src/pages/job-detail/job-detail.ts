import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail.html'
})
export class JobDetailPage {
items:any;
http:any;
job:any;
empname:any;
checkapplied:any;
salary:any;
hash:any;
counter_rate : number = 0;
user: any;
DeviceId: any;
device_Id: any
user_name: any;
pagename
app_id: any;
view:boolean = true; 
   constructor(private ga: GoogleAnalytics,
               public network: NetworkServiceProvider,
               private platform: Platform,
               private alertCtrl: AlertController, 
               private storage: Storage, 
               public navCtrl: NavController, 
               http: Http, 
               public loadingCtrl: LoadingController, 
               public navParams: NavParams,
               private socialSharing: SocialSharing) {
                this.pagename = navParams.get('pagename')
                console.log('PageName '+this.pagename)
                if(this.pagename == 'JobAppliedPage'){
                  console.log('Under If')
                  this.view = false;
                }
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{            
          let loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: `Please Wait...`,
          });
                  loader.present();
                  
                  this.storage.get('user').then((id) =>{
                  this.platform.ready().then(() => {
                      this.ga.trackEvent("Job Detail Page", "Opened", "New Session Started", id, true)
                      this.ga.setAllowIDFACollection(true)
                      this.ga.setUserId(id)
                      this.ga.trackView("Job Detail")
                  });
              });
            this.storage.get('user').then((id) =>{
                  this.user = id;
                });              
            this.storage.get('Hash').then((id) =>{
                  this.hash = id;
                  this.job = navParams.get('job');
                  let headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': this.hash
                  });
              let options = new RequestOptions({ headers: headers });
              this.http = http;
                this.http.get("http://forehotels.com:3000/api/jobs/"+this.job, options)
                      .subscribe(data =>{
                    this.items=JSON.parse(data._body).Jobs;
                    this.salary = this.items["0"].salary_range.split(",");
                    let hotelId = this.items["0"].user_id
                    this.http.get("http://forehotels.com:3000/api/package/"+hotelId, options)
                        .subscribe(data =>{
                      this.DeviceId = JSON.parse(data._body).Jobs;
                      console.log('Hotel Details '+data)
                      loader.dismiss()
                        this.device_Id = this.DeviceId["0"].device_id;
                        },error=>{
                            console.log(error);
                        });   
                },error=>{
              console.log(error);
          } );                   
        });
          
      }
  }
    whatsappShare(){
    this.socialSharing.shareViaWhatsApp("A new job has been posted on forehotels.com", null /*Image*/,  "https://www.forehotels.com/search/job_detail/"+this.job /* url */)
      .then(()=>{
      },
      ()=>{
      })
  }
   linkedinShare(){
    this.socialSharing.share("A new job has been posted on forehotels.com", null /*Image*/,null,  "https://www.forehotels.com/search/job_detail/"+this.job /* url */)
      .then(()=>{},
      ()=>{
      })
  }
  twitterShare(){
    this.socialSharing.shareViaTwitter("A new job has been posted on forehotels.com", null /*Image*/,  "https://www.forehotels.com/search/job_detail/"+this.job /* url */)
      .then(()=>{
      },
      ()=>{
      })
  }
    facebookShare(){
      this.socialSharing.shareViaFacebook("A new job has been posted on forehotels",null,"https://www.forehotels.com/search/job_detail/"+this.job)
      .then(()=>{
      },
      ()=>{
      })
    }
    applyjob(){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
      }else{
      var applied = false;
      let body = JSON.stringify({
      hotel_id: this.job,
      hname: this.items["0"].name,
      emp_id: this.user.id,
      ename:this.user.name
     });
    
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/applied/"+this.user.id, options)
            .subscribe(data =>{
            this.checkapplied=JSON.parse(data._body).Users_Applied;
             for(let item of this.checkapplied ){
                  if(item.hj_id == this.job){
                    let alert = this.alertCtrl.create({
                    title: 'Oops..!!',
                    subTitle: 'You have already applied for this job.',
                    buttons: ['OK']
                  });
                  alert.present();
                  applied =true;
                  }
                }

                if(applied==false){
                  this.http
                  .post('http://forehotels.com:3000/api/applied', body, options)
                  .map(res => res.json())
                  .subscribe(detail => {
                      let alert = this.alertCtrl.create({
                        title: 'Success!',
                        subTitle: 'Job application successfull. Your CV has been sent to '+this.items["0"].name,
                        buttons: [{
                            text: 'OK',
                            handler: data => {
                              this.navCtrl.pop()
                            }
                    },]
                        });
                      alert.present();  
                        this.storage.get('user_name').then((username)=>{
                        this.user_name = username;  
                        this.storage.get("app_id").then((data)=>{
                        this.app_id = data;
                        let email_body = JSON.stringify({
                          hj_id: this.job,
                          id: this.user.id,
                          mail: 'job_application'
                        });

                        let headers1 = new Headers({
                          'Content-Type': 'application/json',
                          'Authorization': this.hash
                        });
                      let options1 = new RequestOptions({ headers: headers1 });
                      this.http.post("http://forehotels.com:3000/api/send_email", email_body, options1 )
                        .subscribe(data =>{ },);

                       let Notiheaders = new Headers({
                          'Content-Type': 'application/json',
                          'Authorization': 'Basic NzE2MWM1N2MtY2U2OC00NDM5LWIwMzktNjM3ZjA2MTYyN2Y0',
                          'Cache-Control': 'no-cache'
                        });
                       let NotficationOptions = new RequestOptions({ headers: Notiheaders });
                       let Noti_body = JSON.stringify({
                          device_id: this.device_Id,
                          message: this.user_name+' has applied for your job',
                          app_id: this.app_id,                  
                        });
                        this.http.post("http://forehotels.com:3000/api/single_notification", Noti_body, NotficationOptions )
                        .subscribe(data =>{ 
                        },);                        
               
                        let mail_body = JSON.stringify({
                          hj_id: this.job,
                          user_id: this.user.id,
                          hotel_id: this.items["0"].user_id,
                          mail: 'job_applied'
                        });
                        this.http.post("http://forehotels.com:3000/api/send_email", mail_body, options1 )
                        .subscribe(data =>{ },);      
                      },);
                      })
            })
                }
          },error=>{
                console.log(error);// Error getting the data
            } );
    }
  }       
}
