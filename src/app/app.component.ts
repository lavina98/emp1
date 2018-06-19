import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { App, Nav, Platform, MenuController, AlertController, Events, IonicApp } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Http, Headers, RequestOptions } from '@angular/http';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UrgentNeedPage } from '../pages/urgent-need/urgent-need';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
import { InternationalPlacementPage } from '../pages/international-placement/international-placement';
import { NotificationsPage } from '../pages/notifications/notifications';
import { IntroPage } from '../pages/intro/intro';
import { ReferAFriendPage } from '../pages/refer-a-friend/refer-a-friend';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OneSignal } from '@ionic-native/onesignal';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Toast} from '@ionic-native/toast';
import { OtpPage } from '../pages/register/register';
import { AboutUsPage } from '../pages/about-us/about-us';
import { HeaderColor } from '@ionic-native/header-color';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  // pages: Array<{title: string, component: any}>;
profile:any;
  http:any;
items:any;
icons:any;
loggedIn:boolean;
backPressed:boolean=true
start_time:number;
key:String = "e36051cb8ca82ee0Lolzippu123456*=";
app_id = "a8874a29-22e2-486f-b4b3-b3d09e8167a5";
image:any;
  // rootPage:any;
  social_pic:boolean;
  pages: Array<{title: string, component: any, icon:any}>;

  constructor(
    http: Http,
    private headerColor: HeaderColor,
    private events: Events,
    public menu: MenuController,
    public diagnostic: Diagnostic,
    public storage: Storage,
    private alertCtrl: AlertController,
    public platform: Platform, 
    public statusBar: StatusBar,
    private contacts: Contacts,
    private appVersion: AppVersion,
    private oneSignal: OneSignal,
    private ga: GoogleAnalytics,
    private network: Network,
    public app: App,
    private toast: Toast,
    public ionicapp: IonicApp,
    private iab: InAppBrowser,
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.start_time = new Date().getTime();
    this.loggedIn = false
    this.social_pic = false
    this.http = http;    
    // set our app's pages
    this.icons = ['person-add', 'jet', 'notifications','flash','share','information-circle'];

    this.pages = [
     { title:'Update Profile', component: UpdateProfilePage, icon : this.icons["0"]},
     { title:'International Placement', component: InternationalPlacementPage, icon : this.icons["1"] },
     { title:'Notifications', component: NotificationsPage, icon : this.icons["2"]},
     { title:'Urgent Need', component: UrgentNeedPage, icon : this.icons["3"]},
     { title:'Refer and Earn', component: ReferAFriendPage , icon : this.icons["4"]},
     { title:'About Us', component: AboutUsPage, icon : this.icons["5"]}
    ];
    // events.subscribe('user:profilepic', () => {
     
    // });
  }

    initializeApp() {
    
    this.storage.set("app_id",this.app_id) 
    this.storage.set('Hash', this.key);
    this.rootPage = IntroPage;
    this.storage.get('loggedIn').then((id) => {
       if(id == true){
         this.rootPage = DashboardPage;
         let datewa = new Date().toISOString()
         
         console.log('Date '+datewa)
         this.storage.get('id').then((id) => {
         this.getDetails(id)
         let body = JSON.stringify({
           current_date: datewa,
           user_id: id
         })
         let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': this.key
        });
        let options = new RequestOptions({ headers: headers });
   
         this.http.put("http://forehotels.com:3000/api/recent_login",body, options)
            .subscribe(data =>{
             let response=JSON.parse(data._body); //Bind data to items object
                console.log(JSON.stringify(response))
            },error=>{});
        });
       }
       else{
         this.rootPage = IntroPage;
       }
     })
        this.platform.ready().then(() => {
          this.events.subscribe('user:loggedIn', (user) => {
          this.getDetails(user)
          this.menu.enable(true);
        });



      let count= 0;
      this.platform.registerBackButtonAction(() => {
       let nav = this.app.getActiveNav();
        
        if(nav.getActive().component === DashboardPage || nav.getActive().component === HomePage){
            if(count == 0){              
                this.toast.show('Press again to exit Forehotels', '5000', 'bottom').subscribe(
                  toast => {
                    console.log(toast);
                  });
                    setTimeout(() => {
                      count = 0;
                    }, 5000);
              }
              else{
                this.platform.exitApp();
              }
              count++;
          // this.platform.exitApp(); //Exit from app          
        }else{
          nav.pop();          
          }
      });
       this.events.subscribe('user:designation',(des)=>{
         console.log(des);
         console.log('234');
          this.storage.get('id').then((id)=>{console.log(id);
                                            this.getDetails(id);
                                          });
         });
         
         this.events.subscribe('user:profilepic',(data)=>{
           this.click();
          console.log(data);
          console.log('profile pic event subscriber');
           this.storage.get('id').then((id)=>{
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': this.key
            });
            let options = new RequestOptions({ headers: headers });
             console.log(id);
            this.getDetails(id);
            this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Users;
              if(this.items["0"].profile_pic="")
                  this.profile='https://www.forehotels.com/public/assets/img/male.png';
              else 
                  this.profile='https://www.forehotels.com/public/emp/avatar/'+this.items["0"].profile_pic;
          });
                                           
          
          
          
          });
          });
		  // let contact: Contact = this.contacts.create();

			// contact.name = new ContactName(null, '- Job Search', 'Forehotels');
			// contact.phoneNumbers = [new ContactField('mobile', '9004019894')];
			// contact.save().then(
			//   () => console.log('Contact saved!', contact),
			//   (error: any) => console.error('Error saving contact.', error)
			// );	
      //     this.statusBar.backgroundColorByHexString('#1396e2');
      //     this.splashScreen.hide();
      //     let self = this;
      //     this.headerColor.tint("#1396e2");                
      //     this.appVersion.getVersionNumber().then(
      //     data => {
      //       let app_version = data.split(".")
      //       console.log(app_version)
      //       let headers = new Headers({
      //       'Content-Type': 'application/json',
      //       'Authorization': this.key
      //     });
      //     let options = new RequestOptions({ headers: headers });
      //     this.http
      //       .get("http://forehotels.com:3000/api/app_versions", options)
      //       .subscribe(data =>{
      //         this.items=JSON.parse(data._body).Apps;
      //         let app_id = this.items["0"].app_id
      //         var latest_version = this.items["0"].android_latest_version
      //         latest_version = latest_version.split(".")
      //         if(app_id == 1){
      //           if((app_version[0] != latest_version[0]) || (app_version[1] != latest_version[1]) || (app_version[2] != latest_version[2])){
      //             this.updateApp();
      //           }
      //         }
      //       },
      //       error=>{
      //           console.log(error);// Error getting the data
      //         });
      //       });
            

            
      //     this.oneSignal.startInit(this.app_id, '278620255983');
      //     this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      //     this.oneSignal.handleNotificationReceived().subscribe(() => {
      //     // do something when notification is received
      //     });

      //     this.oneSignal.handleNotificationOpened().subscribe(() => {
      //       self.nav.push(NotificationsPage);
      //     });
      //     this.oneSignal.endInit();
      //     this.ga.debugMode()
      //     this.ga.startTrackerWithId('UA-74078016-3')
      //     this.ga.enableUncaughtExceptionReporting(true)
      //     let current_time = new Date().getTime();
      //     let total_time = (current_time - this.start_time);
      //     this.ga.trackTiming("Android", total_time, "App Opening Time", "app_open")          
        
        });
  }

  getDetails(id){
    let headers = new Headers({
       'Content-Type': 'application/json',
       'Authorization': this.key
     });
     let options = new RequestOptions({ headers: headers });

      this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
         .subscribe(data =>{
          this.items=JSON.parse(data._body).Users; //Bind data to items object
          this.storage.set("user_name",this.items["0"].name)
          let img = this.items["0"].profile_pic.split("/")
          if(this.items["0"].profile_pic==''){
            this.profile='https://www.forehotels.com/public/assets/img/male.png';
            // this.social_pic = true;
          }
          else
                 this.profile='https://www.forehotels.com/public/emp/avatar/'+this.items["0"].profile_pic;
          this.loggedIn = true;
         },error=>{
         this.loggedIn = false;
         } );
  }
  getprofile(id){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.key
    });
    let options = new RequestOptions({ headers: headers });

     this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
        .subscribe(data =>{
         this.items=JSON.parse(data._body).Users; //Bind data to items object
         this.storage.set("user_name",this.items["0"].name)
         let img = this.items["0"].profile_pic.split("/")
         if(this.items["0"].profile_pic!=''){
          this.profile='https://www.forehotels.com/public/emp/avatar/'+this.items["0"].profile_pic;
         }
         else
         this.profile='https://www.forehotels.com/public/assets/img/male.png';
        });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
   // this.nav.setRoot(page.component);
   this.menu.close();
    this.nav.push(page.component);
  }
  click(){
    console.log('11');
    this.storage.get('id').then((id)=>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.key
    });
    let options = new RequestOptions({ headers: headers });

     this.http.get("http://forehotels.com:3000/api/employee/"+id, options)
        .subscribe(data =>{
         this.items=JSON.parse(data._body).Users; //Bind data to items object
         this.storage.set("user_name",this.items["0"].name)
         let img = this.items["0"].profile_pic.split("/")
         if(this.items["0"].profile_pic!=""){
          this.profile='https://www.forehotels.com/public/emp/avatar/'+this.items["0"].profile_pic;
         }
         else
         this.profile='https://www.forehotels.com/public/assets/img/male.png';
        });
      });
    // this.events.subscribe('user:designation',(des)=>{console.log(des);
    //                                                 console.log('234');});
  }
  dashboard(){
    this.menu.close();
    this.nav.setRoot(DashboardPage);
  }
  logout(){
    this.storage.remove('loggedIn').then((status) => {
      this.menu.close();
      this.nav.setRoot(HomePage);
      this.rootPage = HomePage;
      this.menu.enable(false);
    });
  }

  // updateApp(){
  //   let alert = this.alertCtrl.create({
  //      title: 'Update',
  //      message: 'Please update your app to enjoy better features',
  //      buttons: [
  //        {
  //          text: 'Cancel',
  //          role: 'cancel',
  //          handler: () => {
  //          }
  //        },
  //        {
  //          text: 'Update',
  //          handler: () => {
  //            let browser = this.iab.create('https://play.google.com/store/apps/details?id=com.fore.v100','_system')
  //            browser.show();
  //          }
  //        }
  //      ]
  //    });
  //    alert.present();
  // }
}
