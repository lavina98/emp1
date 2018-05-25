import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common';	
import { Http, Headers, RequestOptions } from '@angular/http';
import { ScheduledInterviewPage } from '../scheduled-interview/scheduled-interview';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics'
import { JobDetailPage } from '../job-detail/job-detail'
import { Calendar } from '@ionic-native/calendar';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Toast } from '@ionic-native/toast'
import { Geolocation } from '@ionic-native/geolocation';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

declare var cordova;
@Component({
  selector: 'page-schedule-interview',
  templateUrl: 'schedule-interview.html'
})
export class ScheduleInterviewPage {
items:any;
http:any;
location:any;
hname:any;
latest_date:any;
date:any;
user_lat:any
user_lng:any
datepipe:DatePipe;
  constructor(private storage: Storage, 
              http: Http, 
              private geolocation: Geolocation,
              private toast: Toast,
              private calendar: Calendar,
              private navCtrl: NavController, 
              public platform: Platform,
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics,
              private diagnostic: Diagnostic,
              private network: NetworkServiceProvider,
              private loadingCtrl: LoadingController
             ) {
              this.http = http;

          if(this.network.noConnection()){
              this.network.showNetworkAlert()
              }else{
                    this.storage.get('user').then((id) =>{
                    this.platform.ready().then(() => {
                    this.ga.trackEvent("Schedule Interview Page", "Opened", "New Session Started", id, true)
                    this.ga.setAllowIDFACollection(true)
                    this.ga.setUserId(id)
                    this.ga.trackView("Schedule Interview")
                    });
                  })
                
                  storage.get('Hash').then((hash) => {
                  let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': hash
                  });

              let options = new RequestOptions({ headers: headers });
              let sc = navParams.get('sc')
                  this.http.get("http://forehotels.com:3000/api/scheduled_interview/"+sc, options)
                      .subscribe(data =>{
                    this.items=JSON.parse(data._body).Details
                    this.location = this.items["0"].interview_address;
                    this.hname = this.items["0"].name;
                    this.date = this.items["0"].interview_date_time
                    let date = Date.parse(this.date)
                    let new_date = date - 12600000;
                    this.date = new_date;
                    },error=>{
                          console.log(error)
                      });
              });
              this.getCords()              
        }
    }
      goToJobDetail(job){
        this.navCtrl.push(JobDetailPage,{
          job:job
        })
      }
    getCords(){
    this.diagnostic.isGpsLocationEnabled()
        .then((state) => {
          if (state){
             this.geolocation.getCurrentPosition().then((resp) => {
             let loader = this.loadingCtrl.create({
               spinner: 'bubbles',
               content: 'Please Wait...'
             })
              loader.present()
              this.user_lat = resp.coords.latitude
               this.user_lng = resp.coords.longitude
               loader.dismiss()
              }).catch((error) => {
                console.log('Error getting location', error);
            });
          } else {
              alert ('To continue, let your device turn on location...')
              this.diagnostic.switchToLocationSettings()
              setTimeout(() => {
              if(state){
                this.getCords()
              }         
              else{
                this.getCords()
              }   
             },100);     
            }    
        }).catch(e => console.error(e));      
  }

createEvent(){
      var CalendarOptions = this.calendar.getCalendarOptions();
      CalendarOptions.firstReminderMinutes = 1440;
      CalendarOptions.secondReminderMinutes = 120;
      let title = "You have one interview scheduled today";
      let location = this.location;
      let notes = "Interview at "+this.hname;
      let startDate = new Date(this.date);
      let endDate = new Date(this.date);
      var createEvent = this.calendar.createEventWithOptions(title, location, notes,startDate, endDate,CalendarOptions).then( 
        (event) => {
          let alert = this.alertCtrl.create({
            title: 'Event Created',
            subTitle: 'Event Added to Calendar',
            buttons: ['OK']
          });
          alert.present();
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err.text(),
            buttons: ['OK']
          });
          alert.present();
        });
  }

goToMap(){   
       if(this.network.noConnection()){
              this.network.showNetworkAlert()
        }else{
              this.navCtrl.push(ScheduledInterviewPage,{
                  location: this.items["0"].location,
                  address: this.items["0"].interview_address,
                  user_lat: this.user_lat,
                  user_lng: this.user_lng
                  })
          }
      }
}
