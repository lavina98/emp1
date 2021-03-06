import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login'
import { Http, Headers, RequestOptions } from '@angular/http';
import { WorkExperiencePage } from '../work-experience/work-experience';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { Toast } from '@ionic-native/toast';
// import { Facebook, FacebookLoginResponse  } from '@ionic-native/facebook'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  todo = {}
  FB_APP_ID: number = 986922888110799;
  name:any;
  email:any;
  gender:any;
  registrationForm:any;
  items:any
  view:boolean=false
  picture:any
  otp:any;
  checkusers:any
  http:any
  validation_messages:Array<{type:any,message:any}>
  validation_Email:Array<{type:any,message:any}>
  validation_Number:Array<{type:any,message:any}>
  validation_Password:Array<{type:any,message:any}>
  constructor(public form: FormBuilder,
              http: Http,
              public alerCtrl: AlertController,
              public navParams: NavParams,
              public navCtrl: NavController,
              public storage: Storage, 
              public loadingCtrl: LoadingController,
              private ga: GoogleAnalytics,
              private toast: Toast,
              public platform: Platform,
              public network: NetworkServiceProvider,
              private googleplus: GooglePlus,
              private nativestorage: NativeStorage,
              // private facebook: Facebook
             ) {
              this.http = http  
  this.registrationForm = this.form.group({
        "name":["", Validators.compose([Validators.maxLength(30),Validators.minLength(5),Validators.pattern('[a-zA-Z ]*'),Validators.required])],
        "email":["", Validators.compose([Validators.maxLength(30),Validators.minLength(10),Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+\.[a-z]{2,3}$'),Validators.required])],
        "number":["", Validators.compose([Validators.maxLength(10),Validators.minLength(10),Validators.required])],
        "gender":[this.gender, Validators.required],
        "password":["",Validators.compose([Validators.maxLength(10),Validators.minLength(4),Validators.required])]      
    })
  this.validation_messages = [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 30 characters long.' },
      { type: 'pattern', message: 'Your username must contain only letters.' }]    
  this.validation_Email = [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: '' },
      { type: 'maxlength', message: 'Email cannot be more than 30 characters long.' },
      { type: 'pattern', message: 'Please Enter Valid Email' }]    
  this.validation_Number = [
      { type: 'required', message: 'Number is required.' },
      { type: 'minlength', message: 'Number must be at least 10 Numbers long.' },
      { type: 'maxlength', message: 'Number cannot be more than 10 Numbers long.' },
      { type: 'pattern', message: 'Sorry you can not use characters' }]
  this.validation_Password = [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Password cannot be more than 10 Characters long.' },
      { type: 'pattern', message: '' }]
  this.otp = Math.floor(100000 + Math.random() * 900000)      
    this.storage.get('user').then((id) =>{
    this.platform.ready().then(() => {
            this.ga.trackEvent("Register Page", "Opened", "New Session Started", id, true)
            this.ga.setAllowIDFACollection(true)
            this.ga.setUserId(id)
            this.ga.trackView("Register")
          });   
    });
//   this.facebook.browserInit(this.FB_APP_ID, "v2.9");
 }
doGoogleLogin(){
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{
        let nav = this.navCtrl;
        let env = this;
        let loading = this.loadingCtrl.create({
          spinner:'bubbles',
          content: 'Please wait...'
        });
        loading.present();
        this.googleplus.login({
          'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': '1040945361550-od0us71pl5b6fbt722414j04hnpi77ml.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true
        })
        .then(function (user) {
          loading.dismiss();
          env.nativestorage.setItem('user', {
            name: user.displayName,
            email: user.email,
            picture: user.imageUrl
          })
          .then(function(){
            env.googlesingup(user.displayName,user.email,user.imageUrl)
          }, function (error) {
            console.log(error);
          })
        }, function (error) {
          loading.dismiss();
        });
 }
}
googlesingup(googleName,googleEmail,picture){
   let loader = this.loadingCtrl.create({
     spinner: 'bubbles',
     content: 'Please Wait...'
   })
    loader.present()
   var email_checker = false;
    this.storage.get("Hash").then((hash)=>{   
      let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });     
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/employee", options)
            .subscribe(data =>{
            this.checkusers=JSON.parse(data._body).Users;//Bind data to items object
            for(let item of this.checkusers ){
                if(item.email == googleEmail){
                email_checker = true;
                }
              }
              if(email_checker == true){
                loader.dismiss()
                let alert = this.alerCtrl.create({
                message: 'This email already exists',
                buttons: [{
                    text: 'Go to Login',
                    handler: () => {
                      this.navCtrl.push(LoginPage)
                    }
                  }]
              });
                alert.present();
              }
              else{
                loader.dismiss()
                this.name =  googleName
                this.email = googleEmail
                this.picture = picture
                this.view = true;  
              }  
            }); 
    });     
}
// doFbLogin(){
//  if(this.network.noConnection()){
//         this.network.showNetworkAlert()
//     }else{
//         let permissions = new Array<string>();
//           let nav = this.navCtrl;
//           let env = this;
//           //the permissions your facebook app needs from the user
//           permissions = ["public_profile","email"];
//           this.facebook.login(permissions)
//           .then(function(response){
//             let userId = response.authResponse.userID;
//             let params = new Array<string>();
//             //Getting name and gender properties
//             env.facebook.api("/me?fields=name,gender,email", params)
//             .then(function(user) {
//               user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
//               //now we have the users info, let's save it in the NativeStorage
//               env.nativestorage.setItem('user',
//               {
//                 name: user.name,
//                 gender: user.gender,
//                 picture: user.picture,
//                 email:user.email
//               })
//               .then(function(){          
//                 env.facebookSingup(user.name,user.gender,user.email,user.picture)
//               }, function (error) {
//                 console.log(error);
//               })
//             })
//           }, function(error){
//             console.log(error);
//         });
//     }
// }  
// facebookSingup(facebookName,facebookGender,facebookEmail,picture){
//      let loader = this.loadingCtrl.create({
//      spinner: 'bubbles',
//      content: 'Please Wait...'
//    })
//     loader.present()
//      var email_checker = false;
//     this.storage.get("Hash").then((hash)=>{   
//       let headers = new Headers({
//       'Content-Type': 'application/json',
//       'Authorization': hash
//     });     
//     let options = new RequestOptions({ headers: headers });
//     this.http.get("http://forehotels.com:3000/api/employee", options)
//             .subscribe(data =>{
//             this.checkusers=JSON.parse(data._body).Users;//Bind data to items object
//             for(let item of this.checkusers ){
//                 if(item.email == facebookEmail){
//                 email_checker = true;
//                 }
//               }
//             if(email_checker == true){
//                 loader.dismiss()
//                   let alert = this.alerCtrl.create({
//                   message: 'This email already exists',
//                   buttons: [{
//                       text: 'Go to Login',
//                       handler: () => {
//                         this.navCtrl.push(LoginPage)
//                       }
//                     }]
//                 });
//                   alert.present();
//               }else{
//                   loader.dismiss()
//                   this.name =  facebookName
//                   this.gender = facebookGender
//                   this.email = facebookEmail
//                   this.picture = picture
//                   this.view = true;  
//               }  
//             }); 
//     });
// }
loginForm(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{
        this.items = this.registrationForm.value
        let body = JSON.stringify({
                  number: this.items.number,
                  text: "Welcome "+this.items.name+", Your OTP is "+this.otp+ ". Please Verify to register on ForeHotels"
                  })
                  let headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': "e36051cb8ca82ee0Lolzippu123456*="
                  });
                  let options = new RequestOptions({ headers: headers });
                //   this.http.post("http://forehotels.com:3000/api/send_sms", body, options)
                //         .subscribe(data =>{
                // })
            this.navCtrl.push(OtpPage,{
            name:this.items.name,
            email:this.items.email,
            number:this.items.number,
            gender:this.items.gender,
            password:this.items.password,
            picture:this.picture,
            otp:this.otp
          },{animate:true,animation:'transition',duration:500,direction:'forward'})
    }
  }
} 
/*************************Register-Page-Ends**********************/

/****************OTP-Page-Start**************/
@Component({
  template: `
  <ion-header>
    <ion-navbar>
        <ion-title>Otp</ion-title>
    </ion-navbar>
</ion-header>
<ion-content padding>
  <form [formGroup]="OTPForm" (ngSubmit)="success()">
        <ion-list>
            <ion-item>
            <ion-label color="primary" floating>Enter OTP Number Here</ion-label>
            <ion-input type="number" formControlName="OtpNumber" required></ion-input>
            </ion-item>
        </ion-list>
         <button ion-button round full type="submit" [disabled]="!OTPForm.valid">
         Proceed             
        </button> 
  </form>
</ion-content>
`
})  

export class OtpPage {
  otp: any;
  OTPForm: any;
  otpNum: any;
  items: any;  
  name:any;
  email:any
  gender:any
  number:any
  password:any
  picture:any

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public from: FormBuilder, 
              public network: NetworkServiceProvider,
              public alertCtrl:AlertController) {
              this.name = navParams.get('name')
              this.email = navParams.get('email')
              this.gender = navParams.get('gender')
              this.number = navParams.get('number')
              this.password = navParams.get('password')
              this.picture = navParams.get('picture')
              this.otp = navParams.get('otp')
              this.OTPForm = this.from.group({
                "OtpNumber":[this.otp,Validators.required],
              })
  }

success(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{
          this.items = this.OTPForm.value
          this.otpNum = this.items.OtpNumber    
          if(this.otpNum == this.otp){
            this.navCtrl.push(WorkExperiencePage,{        
              name:this.name,
              email:this.email,
              number:this.number,
              gender:this.gender,
              password:this.password,
              picture:this.picture,
            });
          }else{
              let alert = this.alertCtrl.create({
                title: 'Ooops.. :(',
                subTitle: 'Sorry! This is Not Valid OTP',
                //buttons: ['Dismiss']
                buttons: [{
                  text: 'Resend',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                  },
                  { text: 'Go To Login',
                    handler: () => {
                    this.navCtrl.push(LoginPage,{           
                    },{animate:true,animation:'transition',duration:500,direction:'forward'})
                    }
              }]
            });
          alert.present();
        }
    }
  }
}
/******************OTP-Page-End******************/