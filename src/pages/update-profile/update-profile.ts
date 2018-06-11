import { NgZone, Component, OnInit } from '@angular/core';
import { NavController, ModalController, ViewController,Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ProfilePicPage } from '../profile-pic/profile-pic';
import { FormBuilder, Validators } from '@angular/forms';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html'
})
export class UpdateProfilePage{
   ionViewDidEnter(){
     this.loadData()
    }    
  items:any;
  http:any;
  location:boolean;
  empid:any;
  view:any;
  view1:any
  progress: number;
  completed:boolean;
  options:any;
  month:any;
  day:any;
  hash:any;
  cities:any;
  city_array:any;
  del_city:any;
  number:any;
  user_cities:any;
  social_pic:boolean;
  password:any;
  drive_name: any;
  constructor(private ngZone: NgZone, 
              public modalCtrl: ModalController,
              public storage: Storage,
              public platform: Platform,
              public alertCtrl: AlertController, 
              public navCtrl: NavController, 
              http: Http, 
              public loadingCtrl: LoadingController,
              private filePath: FilePath,
              private filetransfer: FileTransfer,
              private filechooser: FileChooser,
              private ga: GoogleAnalytics,
              private iab: InAppBrowser,
              private network: NetworkServiceProvider,
              public events: Events) {
              this.http = http;
  }  
  
loadData(){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{
            let loader = this.loadingCtrl.create({
                  content: "Fetching your Account Details. Kindly wait...",
                });
                this.view = false;
                this.social_pic = false;
                loader.present();
                    this.storage.get('user').then((id) =>{
                    this.platform.ready().then(() => {
                        this.ga.trackEvent("Update Profile Page", "Opened", "New Session Started", id, true)
                        this.ga.setAllowIDFACollection(true)
                        this.ga.setUserId(id)
                        this.ga.trackView("Update Profile")
                      })
                    });
                this.storage.get('Hash').then((hash) => {``
                  this.hash = hash;
                });
                this.storage.get('id').then((id) =>{
                    var url="http://www.forehotels.com:3000/api/employee/"+id;
                    this.getDetails(url, loader);
                    this.empid= id;
                    this.getUserCities()
                  });
        }
  }
getDetails(x, loader){
     if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.hash
          });
          let options = new RequestOptions({ headers: headers });
                  this.http.get(x, options)
                  .subscribe(data =>{
                  this.items=JSON.parse(data._body).Users;
                  let img = this.items["0"].profile_pic.split("/")
                  this.drive_name = this.items["0"].email.split('@')
                  this.number = this.items["0"].contact_no
                    if(img.length > 1){
                        this.social_pic = true;
                    }
                  loader.dismiss(); //Bind data to items object
                  },error=>{
                      console.log(error);// Error getting the data
            });
      }
   }
getUserCities(){
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      });      
      let options = new RequestOptions({ headers: headers });
       this.http.get("http://forehotels.com:3000/api/employee_city/"+this.empid, options)
               .subscribe(data =>{
                this.user_cities=JSON.parse(data._body).Users;
               },error=>{
                   console.log(error);
               } );
    }
/************Update-Education-Function-Start***********/
education() {
      let prompt = this.alertCtrl.create({
        title: 'Education',
        inputs: [
          {
            value: this.items["0"].qualification
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: s_data => {              
              this.items["0"].qualification = s_data["0"];
              this.callAPI("qualification", s_data["0"])
            }
          }
        ]
      });
      prompt.present();    
}
/************Update-Education-Function-End***********/

/************Update-MobileNumber-Function-Start***********/
 mobile() {
      let prompt = this.alertCtrl.create({
        title: 'Mobile Number',
        inputs: [{
            value: this.items["0"].contact_no
          },],
        buttons: [{
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: contact_data => {
              console.log('Saved clicked');
              this.items["0"].contact_no = contact_data["0"];
              this.callAPI("contact_no", contact_data["0"])
            }
          }]
      });
      prompt.present();      
}
/************Update-MobileNumber-Function-End***********/

/************Update-Experience-Function-Start***********/      
exp() {      
      let prompt = this.alertCtrl.create({
        title: 'Experience',
        inputs: [{
            value:this.items["0"].experience
          },],
        buttons: [{
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: exp_data => {
              console.log('Saved clicked');
              this.items["0"].experience = exp_data["0"];
              this.callAPI("experience", exp_data["0"])
            }
          }]
      });
      prompt.present();      
  }
/************Update-Experience-Function-End***********/

/************Update-Designation-Function-Start***********/
designation() {
        let prompt = this.alertCtrl.create({
        title: 'Designation',
        inputs: [{
            value: this.items["0"].designation
          },],
        buttons: [{
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: designation_data => {
              console.log('Saved clicked');
              this.items["0"].designation = designation_data["0"];
              this.callAPI("designation", designation_data["0"])
            }
          }]
      });
      prompt.present();        
  }
/************Update-Designation-Function-End***********/

/************Update-Organization-Function-End***********/
org() {    
    let prompt = this.alertCtrl.create({
      title: 'Current/Previous Organization',
      inputs: [{
          value: this.items["0"].org
        },],
      buttons: [{
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: org_data => {
            console.log('Saved clicked');
            this.items["0"].org = org_data["0"];
            this.callAPI("org", org_data["0"])
          }
        }]
    });
    prompt.present();    
}
/************Update-Organization-Function-End***********/

/************Update-Skills-Function-Start***********/
skills() {    
      let prompt = this.alertCtrl.create({
        title: 'Special Skills',
        inputs: [
          {
            value: this.items["0"].special_skills
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: ss_data => {
              console.log('Saved clicked');
              this.items["0"].special_skills = ss_data["0"];
              this.callAPI("special_skills", ss_data["0"])
            }
          }
        ]
      });
      prompt.present();
  }
/************Update-Skills-Function-End***********/

/************Update-CallAPI-Function-Start***********/
callAPI(key,value){
        if(this.network.noConnection()){
              this.network.showNetworkAlert()
          }else{
            let body = JSON.stringify({
                  key: key,
                  value: value,
                  id: this.empid
                  });
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': this.hash
            });
            let options = new RequestOptions({ headers: headers });

            this.http
                .put('http://www.forehotels.com:3000/api/employee', body, options)
                .map(res => res.json())
                .subscribe(
                    data => {
                      console.log(data);
                    },
                    err => {
                      console.log("ERROR!: ", err);
                    }
                );
            }
  }
/************Update-CallAPI-Function-End***********/
resumeOptions(){
    if(this.view == true){
      this.view = false
    }
    else if(this.view == false){
      this.view = true
    }
  }
openResume(x){
    let resume = this.items["0"].resume
    if(resume == 'created'){
    let url = "https://www.forehotels.com/registration/cv_preview/"+this.empid;
    let browser = this.iab.create(encodeURI(url), '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");    
    }
    else{
    let url = "https://docs.google.com/gview?embedded=true&url=https://www.forehotels.com/public/emp/tmp_uploads/"+x;
    let browser = this.iab.create(encodeURI(url), '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");

    browser.on("loadstop")
                 .subscribe(
                    () => {
                      browser.show();

                    },
                    err => {
                      console.log("InAppBrowser Loadstop Event Error: " + err);
                    });
      }  
  }
updateProfilePic(){
      if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
      this.navCtrl.push(ProfilePicPage);
      }
    }
updatePassword() {
      if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
      let modal = this.modalCtrl.create(UpdatePasswordPage);
        modal.present();
      }
    }
updateCities(){
      if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
        let modal = this.modalCtrl.create(UpdateCitiesPage);
        modal.onDidDismiss(data => {
          this.loadData()
      });
        modal.present();
      }
    }
uploadResume(){
     if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{ 
    this.filechooser.open()
      .then(
        uri => {
          let DrivePicpath = uri.split("/") 
          if(DrivePicpath[0] == 'content:'){
            let fileTransfer: FileTransferObject = this.filetransfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name[0]+'.pdf').then((entry) => {                        
                        let tourl = entry.toURL()
                        this.resumeUpload(tourl)
                      }, (error) => {
                        // handle error
                    });
          }else{
            this.filePath.resolveNativePath(uri)
            .then(filePath => {
              this.resumeUpload(filePath);
            });
        }
      });
    }
  }
resumeUpload(x){
      this.completed=false;
      var fileArray = x.split("/");
      let len = fileArray.length;
      var file = fileArray[len - 1];
      var filebits = file.split(".");
      var f = filebits[1];

      if((f != "pdf") && (f != "doc") && (f != "docx") && (f!= "rtf")){
        let alert = this.alertCtrl.create({
              title: "Invalid File Format",
              subTitle: "Allowed File extensions are PDF, DOC, DOCX and RTF only",
              buttons: ['Dismiss'],
            });
            alert.present();
      }
      else{
      //let fileTransfer = new Transfer();
     let fileTransfer: FileTransferObject = this.filetransfer.create();
      this.options = {
        fileKey: 'resume',
        fileName: x,
        mimeType: "multipart/form-data",
        headers: {
          authorization : 'e36051cb8ca82ee0Lolzippu123456*='
        },
        params: {
          name: file,
          id: this.empid
        }
      }
       let onProgress =  (progressEvent: ProgressEvent) : void => {
        this.ngZone.run(() => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(progress);
                this.progress = progress
            }
        });
    }
      this.completed = false;
      fileTransfer.onProgress(onProgress)
      fileTransfer.upload(x, encodeURI("http://forehotels.com:3000/api/upload_employee_resume"), this.options, true)
      .then((data) => {
        this.progress=null;
        this.completed=true;
        file = file.split(".")
        this.items["0"].resume = 'Forehotels_'+ file[0] + '-' + this.getDateTime() + '.' + file[1];
      }, (err) => {
        let alert = this.alertCtrl.create({
              title: err.text(),
              subTitle: err.json(),
              buttons: ['Dismiss'],
            });
            alert.present();
      });
      }
    }
getDateTime() {
      var date = new Date();
      var year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.month = (this.month < 10 ? "0" : "") + this.month;
      this.day  = date.getDate();
      this.day = (this.day < 10 ? "0" : "") + this.day;
      return year + "-" + this.month + "-" + this.day;
    }
  }

@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
     Update Password
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon name="md-close" showWhen="android,windows,ios"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>

<form [formGroup]="registrationForm" (ngSubmit)="loginForm()">
<ion-list>
<ion-item>
    <ion-label floating>Old Password</ion-label>
    <ion-input formControlName="old_password" type="password">
    <ion-icon name="eye" (click)="showPassword(input)"></ion-icon></ion-input>
  </ion-item>
<ion-item>
    <ion-label floating>Enter New Password</ion-label>
    <ion-input formControlName="password" type="password"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label floating>Confirm Password</ion-label>
    <ion-input formControlName="password" type="password"></ion-input>
  </ion-item>
  </ion-list>
  <div padding>
  <button [disabled]="!registrationForm.valid" ion-button full>Update Password</button>
</div>
</form>

</ion-content>`
})
export class UpdatePasswordPage{
registrationForm:any;
items:any;
empid:any;
login:any;
http:any;
disable:any;
hash:any;
constructor(private alertCtrl: AlertController,
            public storage:Storage,
            public navCtrl: NavController,  
            private form: FormBuilder,
            http: Http,
            private network: NetworkServiceProvider,
            public viewCtrl: ViewController){      
            this.registrationForm = this.form.group({
            "old_password":["",Validators.required],
            "password":["",Validators.required]})
            this.storage.get('id').then((id) =>{
            this.empid = id;});
            this.http = http;
    }
loginForm(){
  /*For updatepassword*/
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
          }else{
            this.items = this.registrationForm.value;    //YOGESH!!!!!!!!!! THIS TAKES VALUE FROM FORM
            this.storage.get('Hash').then((hash) => {

            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            let body = JSON.stringify({
            id: this.empid,
            old_password: this.items.old_password,
            new_password: this.items.password,
            });
            this.http
                .put('http://forehotels.com:3000/api/password', body, options)
                .subscribe(
                    data => {
                      let res = data.json();                      
                      if(res.Response==false){
                        let alert = this.alertCtrl.create({
                        title: 'Password Doesnt Match!',
                        subTitle: 'Your old password is incorrect.',
                        buttons: ['RETRY']
                        });
                        alert.present();
                      }
                        else{
                        let alert = this.alertCtrl.create({
                        title: 'Password Updated!',
                        subTitle: 'Your password has been updated successfully.',
                        buttons: ['OK']
                        });
                        alert.present();
                        this.viewCtrl.dismiss();
                        }
                      });
            });
    }
}
dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
template: `
 <ion-header>
  <ion-toolbar>
    <ion-title>
     Update City
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon name="md-close" showWhen="android,windows,ios"></ion-icon>
      </button>
    </ion-buttons>
     <ion-buttons end>
      <button ion-button (click)="apply()">Apply</button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
    <ion-item *ngFor="let cities of this.user_cities">
    <ion-label style="white-space:pre-wrap">{{cities.city_name}}</ion-label>
      <ion-checkbox (ionChange)="updateCity($event, cities.c_id)" checked="true" [checked]="update_cities.indexOf(cities.c_id) >= 0"></ion-checkbox>
    </ion-item>
    <ion-list [virtualScroll]="cities">
    <ion-item *virtualItem="let item">
      <ion-label style="white-space:pre-wrap">{{item.city_name}}</ion-label>
      <ion-checkbox (ionChange)="updateCity($event, item.c_id)" [checked]="update_cities.indexOf(item.c_id) >= 0"></ion-checkbox>
    </ion-item>
    </ion-list>
</ion-content>
`
})
export class UpdateCitiesPage {
http:any;
items:any;
hash:any;
user_cities:any;
emp_id:any;
value:any;
cities:any;
update_cities= [];
 constructor(public alertCtrl: AlertController, public storage: Storage, http: Http, public viewCtrl: ViewController) {
      this.http = http;
       this.storage.get('id').then((id) =>{
            this.emp_id = id;
       });
    storage.get('Hash').then((hash) => {
      this.hash = hash;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
      this.http.get("http://www.forehotels.com:3000/api/city", options)
            .subscribe(data =>{
              this.items = data.json();
              this.getUserCities()
            });
          });  
  }
getUserCities(){
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      });
      let options = new RequestOptions({ headers: headers });
       this.http.get("http://forehotels.com:3000/api/employee_city/"+this.emp_id, options)
               .subscribe(data =>{
                this.user_cities=JSON.parse(data._body).Users;
                for(let i = 0; i < this.user_cities.length; i++){
                   this.update_cities.push(this.user_cities[i].c_id)                  
                }
                this.fetchCities(this.user_cities)
               },error=>{
                   console.log(error);// Error getting the data
               } );
    }
fetchCities(user_cities){
      let headers = new Headers({
         'Content-Type': 'application/json',
         'Authorization': this.hash
       });
       let options = new RequestOptions({ headers: headers });
       console.log("Fetch Cities called");
       this.http.get("http://forehotels.com:3000/api/city/",options)
             .subscribe(data =>{
              this.cities=JSON.parse(data._body); //Bind data to items object
               for (var i = 0 ; i < this.cities.length ; i++){
                for (var j = 0 ; j < user_cities.length ; j++){
                  if(this.cities[i].c_id == user_cities[j].c_id){
                    this.cities.splice(i, 1);
                  }
                }
              }
             error=>{
                 console.log(error);// Error getting the data
             }
           });
   }
updateCity(e: any,c_id){
      if(e.checked){
          this.update_cities.push(c_id)
        }else{
         var ind = this.update_cities.indexOf(c_id)
            this.update_cities.splice(ind, 1);
          }        
    }
apply(){
      let body = JSON.stringify({
      city_id: this.update_cities,
      user_id: this.emp_id
    });
      let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
             });
       let options = new RequestOptions({ headers: headers });
       this.http
        .post('http://forehotels.com:3000/api/users_city', body, options)
        .map(res => res.json())
        .subscribe(
            data => {              
              let alert = this.alertCtrl.create({
              title: 'Cities Updated Successfully!',
              buttons: ['OK']
            });
            alert.present();
          this.viewCtrl.dismiss();  
          },
            err => {
            }
        );
     }

  dismiss() {   
        this.viewCtrl.dismiss();
    }
}