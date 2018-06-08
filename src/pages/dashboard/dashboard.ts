import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { InternationalPlacementPage } from '../international-placement/international-placement';
import { SearchJobsPage } from '../search-jobs/search-jobs';
import { UpdateProfilePage } from '../update-profile/update-profile';
import { JobsAppliedPage } from '../jobs-applied/jobs-applied';
import { CateringJobsPage } from '../catering-jobs/catering-jobs';
import { NotificationsPage } from '../notifications/notifications';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { HomePage } from '../home/home';
import { ReferAFriendPage } from '../refer-a-friend/refer-a-friend'
import { DatePipe } from '@angular/common';	
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ProfilePicPage } from '../profile-pic/profile-pic';
import { UrgentNeedPage } from '../urgent-need/urgent-need';
import { MymanagerPage } from "../mymanager/mymanager";
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  ionViewDidEnter(){
    this.loadData()
  }
view:boolean
profile:any;
items:any;
http:any;
counts:any;
ccounts:any;
acounts:any;
applied_jobs:any;
catering_jobs:any;
jobs:any;
ids:any;
notif_count:any;
social_pic:boolean;
rootPage:any;
picss:any
counter= []
pages: Array<{title:String,icon:any;component:any,count:any}>
pages1: Array<{title:String,icon:any;component:any}>
pages2: Array<{title:String,icon:any;component:any}>
rows:any
notifications:any
myDate: any;
interviews=[]
  constructor(
              public datepipe:DatePipe,
              private platform:Platform, 
              public menu: MenuController, 
              public navCtrl: NavController, 
              http: Http, 
              public network: NetworkServiceProvider,
              public loadingCtrl: LoadingController, 
              private storage: Storage,
              private ga: GoogleAnalytics) {
               
              this.http = http;
              this.rows = Array.from(Array(Math.ceil(6/3)).keys());    
              console.log(this.rows);          
              this.myDate = new Date().toISOString();
              this.myDate = this.myDate.split('T')
              if(this.network.noConnection()){
                  this.network.showNetworkAlert()
                }
              else{ 
              this.storage.get('Hash').then((hash) => {
              this.storage.get('id').then((id) => {
                let sc_body = JSON.stringify({
                user_id: id
              });
                let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': hash
                });
                let options = new RequestOptions({ headers: headers });
              
                this.http.post("http://forehotels.com:3000/api/users_notification/", sc_body, options)
                          .subscribe(data =>{
                          this.notifications=JSON.parse(data._body).notification;
                            for(let i=0; i<this.notifications.length;i++){
                              if(this.notifications[i].type == 2){
                                let sc_id = this.notifications[i].data
                     
                this.http.get("http://forehotels.com:3000/api/scheduled_interview/"+sc_id, options)
                         .subscribe(data =>{
                          this.items=JSON.parse(data._body).Details 
                           for(let j=0 ; j<this.items.length ; j++){                          
                            let date = this.items[j].interview_date_time;
                            date = date.split('T')
                            let Newdate:any
                                Newdate = this.datepipe.transform(date,'medium')
                                Newdate = Newdate.split(',')
                            if(this.myDate[0] == date[0]){
                                this.interviews.push({Addr: this.items[j].name,IDate:Newdate[0]})   
                                this.view = true       
                              }
                        }                    
                    },error=>{
                          console.log(error)
                      });
                }                    
              }
            },error=>{
                console.log(error);
                });
              })
            });
        }
      }

   loadData(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{  
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Fetching your Account Details...'
    });
    this.social_pic = false
    this.storage.get('Hash').then((hash) => {

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });

    
    this.storage.get('id').then((id) => {
      this.platform.ready().then(() => {
          this.ga.trackEvent("Dashboard", "Opened", "New Session Started", id, true)
          this.ga.setAllowIDFACollection(true)
          this.ga.setUserId(id)
          this.ga.trackView("Dashboard")
        });
        let body = JSON.stringify({
        user_id: id,
        });

        this.http.get("http://forehotels.com:3000/api/jobscount", options)
              .subscribe(data =>{
              this.counts = data.json(); 
              this.jobs = this.counts.Jobs["0"].count;
              },error => {});

        this.http.get("http://forehotels.com:3000/api/applied_jobscount/"+id, options)
              .subscribe(data =>{
              this.acounts = data.json();
              this.applied_jobs = this.acounts.Applied_Jobs["0"].count;
              },error => {});

        
        this.http.post("http://forehotels.com:3000/api/notifications_count/", body, options)
              .subscribe(data =>{
              let count = data.json();
              this.notif_count = count.count["0"].count;
              },error => {});

        this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
              .subscribe(data =>{
              this.profile=JSON.parse(data._body).Users;
              this.picss =this.profile["0"].profile_pic
               this.storage.set('user', {
                 name: this.profile["0"].name,
                 contact_no: this.profile["0"].contact_no,
                 email: this.profile["0"].email,
                 id: this.profile["0"].id,
                 profile_pic: this.profile["0"].profile_pic
               });
               let img = this.profile["0"].profile_pic.split("/")
               if(img.length > 1){
                  this.social_pic = true;
               }
               loading.dismiss();
              },error => {});        

         this.http.get("http://forehotels.com:3000/api/catering_jobscount", options)
              .subscribe(data =>{
              this.ccounts = data.json();
              this.catering_jobs = this.ccounts.Catering_Jobs["0"].count;
              this.callFunction(this.jobs,this.applied_jobs,this.catering_jobs)              
              },error => {});
                     
          });
        });
      } 
    }  
  callFunction(val,val1,val2){
        this.pages=[{title:'Job Openings',icon:'job_openings.png',component: SearchJobsPage,count: val},
                   {title:'Job Applied',icon:'jobapplied.png',component:JobsAppliedPage,count: val1},
                   {title:'Catering Jobs',icon:'catering.png',component:CateringJobsPage,count:val2}
                   ]
         this.pages1=[{title:'International Placement',icon:'ip.png',component:InternationalPlacementPage},
                   {title:'Update Profile',icon:'update.png',component:UpdateProfilePage},
                   {title:'Refer N Earn',icon:'share.png',component:ReferAFriendPage}]

                   
        this.pages2=[{title:'My Manager',icon:'ip.png',component:MymanagerPage},
                   {title:'Urgent Need',icon:'update.png',component:UrgentNeedPage},
                   {title:'Notification',icon:'share.png',component:NotificationsPage}]
    }
  Openmenu(){
     this.menu.open();
    }
  updateProfilePic(){
      if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
      this.navCtrl.push(ProfilePicPage);
      }
  }
  openPage(p){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }
      else{ 
      this.navCtrl.push(p.component,{
        pagename: "JobAppliedPage"
      })
    }
  }
  Opennotifications(){
      this.navCtrl.push(NotificationsPage);
    }
  search(){
      this.navCtrl.push(SearchJobsPage)
    }
}