import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
   temppass:any;

  constructor(
    public loadingCtrl: LoadingController,
    public storage: Storage,
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
        let contact;
    var email_checker = false;
      this.items = this.emailForm.value;
     
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });                 
     
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait..'
    })
    loading.present();
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/employee", options)
            .subscribe(data =>{
            this.checkusers=JSON.parse(data._body).Users;
            for(let item of this.checkusers ){
                if(item.email == this.items.email){
                email_checker = true;
                contact=item.contact_no;
                }
              }
              console.log('1');
              
              if(email_checker == true){
                console.log('2');
                let body = JSON.stringify({
                  email: this.items.email,
                  mail: 'forgot_password',
                  contact_no:contact
                  });
              this.http.post('http://forehotels.com:3000/api/send_email', body, options)
                .map(res => res.json())
                .subscribe(data => {
                  console.log(data);
                  console.log('3');
                    let alerts = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Mail has been Sent to your EmailId.',
                    buttons: ['OK']
                    });
                    loading.dismiss();
                    alerts.present();
                    setTimeout(() => {
                    this.navCtrl.push(LoginPage);
                  }, 2000);
                });
              }
              else{
                console.log('4');
                let alerts = this.alertCtrl.create({
                title: 'Oops..!!',
                subTitle: 'This Email ID is not registered.',
                buttons: ['OK']
                });
                loading.dismiss();
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
    let user;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });                 
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait..'
    })
    loading.present();

    let body = JSON.stringify({
    contact_no: this.items.contact_no,
    text : ''
     });
    let options = new RequestOptions({ headers: headers });
    this.http.get("http://forehotels.com:3000/api/employee", options)
            .subscribe(data =>{
            this.checkcontact=JSON.parse(data._body).Users;//Bind data to items object
            let checker = 0;
             for(let item of this.checkcontact ){
                if(item.contact_no == this.items.contact_no){
                checker = 1;
                user=item;
                }
              }
              console.log(user);
              console.log('çhecker'+checker);
              if(checker == 1){
                this.temppass='abcdfeiqurshjcoauspwtydiagdrtsqplskj';
                let start=Math.floor(Math.random()*(this.temppass.length-5));
                let end=start+5;
                this.temppass=this.temppass.slice(start,end);
                console.log(this.temppass);
                let sms_body = JSON.stringify({
                  number: this.items.contact_no,
                  text: 'Hi '+user.name+' your new password is: '+this.temppass
                  });
                  console.log('sent');
          let alerts = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'New Password has been sent to your Phone Number.',
          buttons: ['OK']
        });
        this.http
        .post('http://www.forehotels.com:3000/api/send_sms', sms_body, options)
        .subscribe(
            data => {
              console.log('2');
              
              },
            err=>console.log(err));
        let pass=JSON.stringify({
          password:this.temppass,
          id:user.user_id                          
        
        });
        console.log('3');
        this.http.put('http://forehotels.com:3000/api/forgot_password',pass,options)
        .subscribe(
          data=>{
            console.log('4');
            console.log('success');
  
        }
        
            ,
          err=>console.log('error')
        );
        console.log('5');
        loading.dismiss();
          alerts.present();
           setTimeout(() => {
           this.navCtrl.push(LoginPage);
          }, 2000);
                }
              else{
                let alerts = this.alertCtrl.create({
                title: 'Oops',
                subTitle: 'This Phone Number is not registered.',
                buttons: ['OK']
                });
                loading.dismiss();
                alerts.present();
              }
            },error=>{
                console.log(error);// Error getting the data
            } );
    }   
  } 
}