import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Events, Platform } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { HomePage } from '../home/home'
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { RegisterPage} from '../register/register';
import { OneSignal } from '@ionic-native/onesignal'
// import { Facebook } from '@ionic-native/facebook'
import { NativeStorage } from '@ionic-native/native-storage'
import { Toast } from '@ionic-native/toast'
import { GoogleAnalytics } from '@ionic-native/google-analytics'
import { GooglePlus } from '@ionic-native/google-plus';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
@ViewChild(Navbar) navBar: Navbar;
  registrationForm:any;
  items:any;
  login:any;
  id:any;
  name:any;
  app:any;
  device_details:any;
  hash:any;
  http:any;
  constructor(private events: Events,
              // private fb: Facebook,
              private googlePlus: GooglePlus,
              private onesignal: OneSignal,
              private toast: Toast,
              private loadingCtrl:LoadingController, 
              private navCtrl: NavController, 
              private form: FormBuilder, 
              http: Http, 
              private alertCtrl: AlertController, 
              public storage: Storage,
              private platform: Platform,
              private nativeStorage: NativeStorage,
              private ga: GoogleAnalytics,
              public network: NetworkServiceProvider) {
    this.registrationForm = this.form.group({
      "email":["", Validators.required],
      "password":["",Validators.required]
    })
    this.http = http
    this.storage.get('user').then((id) =>{
      this.platform.ready().then(() => {
          this.ga.trackEvent("Login Page", "Opened", "New Session Started", id, true)
          this.ga.setAllowIDFACollection(true)
          this.ga.setUserId(id)
          this.ga.trackView("Login")
        });
    });
    this.storage.get('Hash').then((hash) => {
      this.hash = hash
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{     
     this.navCtrl.push(HomePage)
    }
  }
  registration(){
    this.navCtrl.push(RegisterPage);
  }
  dashboard(){
    this.navCtrl.push(DashboardPage);
  }

  loginForm(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
    this.items = this.registrationForm.value; 
    let body = JSON.stringify({
      email: this.items.email,
      password: this.items.password
    });
    
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      });
      let options = new RequestOptions({ headers: headers });
      this.http
          .post('http://forehotels.com:3000/api/auth', body, options)
          .subscribe(
              data => {
                this.login = data.json();
                if(this.login.length > 0) {
                  this.storage.set('id', this.login["0"].id);
                  this.storage.set('loggedIn', true);
                  this.events.publish('user:loggedIn', this.login["0"].id);
                  this.onesignal.getIds().then(data => {
                  let body = JSON.stringify({
                  device_id: data.userId,
                  id: this.login["0"].id
                });
                let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': this.hash
                });
                let options = new RequestOptions({ headers: headers });
                this.http
                    .put('http://forehotels.com:3000/api/device_id', body, options)
                    .subscribe(
                        data => {
                          this.device_details = data.json();
                        });
                });

                  let loading = this.loadingCtrl.create({
                              spinner: 'bubbles',
                              content: 'Fetching your Account Details...'
                            });

                            loading.present();

                            setTimeout(() => {
                              loading.dismiss();
                              this.navCtrl.setRoot(DashboardPage);
                            }, 2000);
                }
                else {
                  let alert = this.alertCtrl.create({
                  title: 'Invalid Credentials!',
                  subTitle: 'The email or password is incorrect.',
                  buttons: ['Retry']
                  });
                  alert.present();
                }
              },
              err => {
                console.log("ERROR!: ", err);
              }
          );
    }
  } 

    forgotPassword(){
      this.navCtrl.push(ForgotPasswordPage);
    }

//     doFbLogin(){
//     if(this.network.noConnection()){
//         this.network.showNetworkAlert()
//     }
//       else{  
//     let permissions = new Array();
//     let env = this;
//     let nav = this.navCtrl;
//     let http = this.http;
//     let hash = this.hash;
//     let event = this.events;
//     let storage = this.storage;
//     let loadingCtrl = this.loadingCtrl;
//     let alertCtrl = this.alertCtrl;
//     permissions = ["public_profile","email"];
//     this.fb.login(permissions)
//     .then(function(response){
//       let userId = response.authResponse.userID;
//       let params = new Array();
//       env.fb.api("/me?fields=name,gender,email", params)
//       .then(function(user) {
//         user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
//         env.nativeStorage.setItem('user',
//         {
//           name: user.name,
//           gender: user.gender,
//           picture: user.picture,
//           email: user.email
//         })
//         .then(function(){
//          let body = JSON.stringify({
//           email: user.email,
//           });
//           let headers = new Headers({
//             'Content-Type': 'application/json',
//             'Authorization': hash
//           });
//           let options = new RequestOptions({ headers: headers });
//           http
//               .post('http://forehotels.com:3000/api/social_auth', body, options)
//               .subscribe(
//                   data => {
//                     let login = data.json();
//                     if(login.length > 0) {
//                       storage.set('id', login["0"].id);
//                       storage.set('loggedIn', true);
//                       event.publish('user:loggedIn', login["0"].id);
//                       env.onesignal.getIds().then(data => {
//                       let body = JSON.stringify({
//                       device_id: data.userId,
//                       id: login["0"].id
//                     });
//                     let headers = new Headers({
//                       'Content-Type': 'application/json',
//                       'Authorization': hash
//                     });
//                     let options = new RequestOptions({ headers: headers });
//                     http
//                         .put('http://forehotels.com:3000/api/device_id', body, options)
//                         .subscribe(
//                             data => {
//                               let device_details = data.json();
//                             });
//                     });

//                   let loading = loadingCtrl.create({
//                               spinner: 'bubbles',
//                               content: 'Fetching your Account Details...'
//                             });

//                             loading.present();

//                             setTimeout(() => {
//                               loading.dismiss();
//                               nav.setRoot(DashboardPage);
//                             }, 500);
//                 }
//                 else {
//                   let alert = alertCtrl.create({
//                   title: 'Invalid Credentials!',
//                   subTitle: 'Kindly Register via Facebook first to Login',
//                   buttons: [
//                       {
//                         text: 'Retry',
//                         handler: data => {
//                           console.log('Cancel clicked');
//                         }
//                       },
//                     ]
//                   });
//                   alert.present();
//                 }
//               },
//               err => {

//                 console.log("ERROR!: ", err);
//               }
//             );
//         }, function (error) {
//           console.log(error);
//         })
//       })
//     }, function(error){
//       console.log(error);
//     });
//   }
// }

  doGoogleLogin(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
    let nav = this.navCtrl;
    let http = this.http;
    let env = this;
    let hash = this.hash;
    let event = this.events;
    let storage = this.storage;
    let loadingCtrl = this.loadingCtrl;
    let alertCtrl = this.alertCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '1040945361550-od0us71pl5b6fbt722414j04hnpi77ml.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
    .then(function (user) {
      loading.dismiss();
      env.nativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
      .then(function(){
        let body = JSON.stringify({
          email: user.email,
          });
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });
          let options = new RequestOptions({ headers: headers });
          http
              .post('http://forehotels.com:3000/api/social_auth', body, options)
              .subscribe(
                  data => {
                    let login = data.json();
                    if(login.length > 0) {
                      storage.set('id', login["0"].id);
                      storage.set('loggedIn', true);
                      event.publish('user:loggedIn', login["0"].id);
                    env.onesignal.getIds().then(data => {
                      let body = JSON.stringify({
                      device_id: data.userId,
                      id: login["0"].id
                    });
                    let headers = new Headers({
                      'Content-Type': 'application/json',
                      'Authorization': hash
                    });
                    let options = new RequestOptions({ headers: headers });
                    http
                        .put('http://forehotels.com:3000/api/device_id', body, options)
                        .subscribe(
                            data => {
                              let device_details = data.json();
                            });
                    });
                            setTimeout(() => {
                              nav.setRoot(DashboardPage);
                            }, 500);
                }
                else {
                  let alert = alertCtrl.create({
                  title: 'Invalid Credentials!',
                  subTitle: 'Kindly Register via Google first to Login',
                  buttons: [
                      {
                        text: 'Retry',
                        handler: data => {
                        }
                      },
                    ]
                  });
                  alert.present();
                }
              },
              err => {
                console.log("ERROR!: ", err);
              }
            );
      }, function (error) {
        console.log(error);
      })
    }, function (error) {
      loading.dismiss();
      this.toast.show(error, '15000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
   }
  }
}