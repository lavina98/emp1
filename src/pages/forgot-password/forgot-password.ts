import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
   emailForm:any;
   items:any;
   http:any;
   smsForm:any;
   checkusers:any;
   checkcontact:any;
   hash:any;
  constructor(public storage: Storage,
              http: Http,
              public network: NetworkServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private form: FormBuilder, 
              public alertCtrl: AlertController,
              private ga: GoogleAnalytics) {

            this.emailForm = this.form.group({
          "email":["", Validators.required]
             })
       
        this.smsForm = this.form.group({
      "contact_no":["", Validators.required]
           })
      this.http = http;
      this.storage.get('Hash').then((hash) => {
      this.hash = hash;
      });
      this.storage.get('user').then((id) =>{
          this.ga.trackEvent("Forgot Password Page", "Opened", "", id.id)
          this.ga.trackView("Forgot Password")
        });
  }
    emailCheck(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{  
    var email_checker = false;
      this.items = this.emailForm.value;
      let body = JSON.stringify({
      email: this.items.email,
      mail: 'forgot_password'
      });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });                 
     
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/employee", options)
            .subscribe(data =>{
            this.checkusers=JSON.parse(data._body).Users;
            for(let item of this.checkusers ){
                if(item.email == this.items.email){
                email_checker = true;
                }
              }
              if(email_checker == true){
              this.http.post('http://forehotels.com:3000/api/send_email', body, options)
                .map(res => res.json())
                .subscribe(data => {
                    let alerts = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Mail has been Sent to your EmailId.',
                    buttons: ['OK']
                    });
                    alerts.present();
                    setTimeout(() => {
                    this.navCtrl.push(LoginPage);
                  }, 2000);
                });
              }
              else{
                let alerts = this.alertCtrl.create({
                title: 'Oops..!!',
                subTitle: 'This Email ID is not registered.',
                buttons: ['OK']
                });
                alerts.present();
              }
            },error=>{
                console.log(error);// Error getting the data
            } );
    }
  }        
  smsCheck(){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
      this.items = this.smsForm.value;    //YOGESH!!!!!!!!!! THIS TAKES VALUE FROM FORM
    
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });                 
     
    let body = JSON.stringify({
    contact_no: this.items.contact_no,
    mail : 'forgot_password'
     });
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/employee", options)
            .subscribe(data =>{
            this.checkcontact=JSON.parse(data._body).Users;//Bind data to items object
            let checker = 0;
             for(let item of this.checkcontact ){
                if(item.contact_no == this.items.contact_no){
                checker = 1;
                }
              }
              if(checker == 1){
             this.http
            .post('http://forehotels.com:3000/api/send_email', body, options)
            .subscribe(
                detail => {
          let alerts = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'New Password has been sent to your Phone Number.',
          buttons: ['OK']
        });
        
          alerts.present();
           setTimeout(() => {
           this.navCtrl.push(LoginPage);
          }, 2000);
                  });
                }
              else{
                let alerts = this.alertCtrl.create({
                title: 'Oops',
                subTitle: 'This Phone Number is not registered.',
                buttons: ['OK']
                });
                alerts.present();
              }
            },error=>{
                console.log(error);// Error getting the data
            } );
    }   
  } 
}