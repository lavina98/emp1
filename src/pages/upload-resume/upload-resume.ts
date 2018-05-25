import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FileChooser, } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { ResumeBuilderPage } from '../resume-builder/resume-builder';
import { Toast } from '@ionic-native/toast';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-upload-resume',
  templateUrl: 'upload-resume.html'
})
export class UploadResumePage {
  resume:any
  options:any;
  completed:any;
  hash:any
  empid:any
  uploaded:number;
  http:any;
  todo:any;
  we:any;
  bd:any;
  pname:any;
  city:any;
  c_id:any;
  experience:any;
  picture:any;
  name:any;
  email:any
  gender:any
  number:any
  password:any;
  view_resume:any
  view_picture:any
  qualification:any
  skills:any;
  org:any;
  catering:any;
  internship:any
  referrer: any
  education:any
  designation:any
  total_exp
  fbpic:any
  picpath: any;
  drive_name:any;
  constructor(public toast: Toast,
              public transfer: FileTransfer,
              private fp: FilePath,
              private fc:FileChooser,
              public storage: Storage,
              public platform: Platform,
              http: Http,
              public navCtrl: NavController,              
              public diagnostic: Diagnostic,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private network: NetworkServiceProvider, 
              public loadingCtrl: LoadingController) {
        let loader = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Please Wait...'
            })
            loader.present()    
            this.name = navParams.get('name')
            this.email = navParams.get('email')
            this.drive_name = this.email.split('@')
            this.gender = navParams.get('gender')
            this.number = navParams.get('number') 
            this.password = navParams.get('password')            
            this.picture = navParams.get('picture')
            this.fbpic = this.picture.split('/')
            this.experience = navParams.get('experience')
            this.city = navParams.get('city')
            this.designation = navParams.get('designation')
            this.education= navParams.get('education')
            this.referrer = navParams.get('reference')
            this.catering = navParams.get('catering')
            this.internship = navParams.get('internship')
            this.total_exp = navParams.get('total_exp')
            this.org = navParams.get('org')
            loader.dismiss()            
            this.http = http;
            this.hash = 'e36051cb8ca82ee0Lolzippu123456*=';
            this.uploaded = 0;
  }

  buildResume(){
       if(this.network.noConnection()){
              this.network.showNetworkAlert()
              }else{
                if(this.picture == null){
                let alert = this.alertCtrl.create({
                          title: 'Error!',
                          subTitle: 'Kindly upload your Profile Picture to Create CV',
                          buttons: ['OK']
                          });
                          alert.present();
              }
              else if(this.picture != null){
                this.navCtrl.push(ResumeBuilderPage, {
                        total_exp: this.total_exp,
                        education:this.education,
                        org:this.org,
                        catering:this.catering,
                        internship: this.internship,
                        referrer: this.referrer,
                        name: this.name,
                        email:this.email,
                        number:this.number,
                        gender:this.gender,
                        password:this.password,
                        designation: this.designation,
                        city: this.city,
                        picture: this.picture
                      });
                  }
            }
    }        
    
  clickRegister(){
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
      }else{
          
          if(this.resume == null){
          let alert = this.alertCtrl.create({
                    title: 'Error!',
                    subTitle: 'Kindly upload your Resume to Register',
                    buttons: ['OK']
                    });
                    alert.present();
        }
        if(this.picture == null){
          let alert = this.alertCtrl.create({
                    title: 'Error!',
                    subTitle: 'Kindly upload your Profile Picture to Register',
                    buttons: ['OK']
                    });
                    alert.present();
        }
        if((this.picture != null) && (this.resume != null)){
          let loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: 'Creating your account...'
          });
          loading.present();
        let body = JSON.stringify({
            name: this.name,
            password: this.password,
            contact_no: this.number,
            user_type: 2,
            region: 'India',
            email: this.email,
            gender: this.gender,
            profile_pic: this.picture,
            experience: this.total_exp,
            designation: this.designation,
            qualification: this.education,
            org: this.org,
            internship: this.internship,
            catering: this.catering,
            referrer: this.referrer
          });
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.hash
          });
          let options = new RequestOptions({ headers: headers });
          this.http
              .post('http://forehotels.com:3000/api/users_employee', body, options)
              .subscribe(
                  datas => {                    
                    this.empid = JSON.parse(datas._body).User;
                    loading.dismiss()
                    if(this.fbpic[0] == 'https:'){
                      this.uploaded++
                      } else if(this.picpath == 'file:'){
                      this.pictureUpload(this.picture)                
                    }
                    this.resumeUpload(this.resume)
                    let city_body = JSON.stringify({
                          city_id:this.city,
                          user_id: this.empid
                        });                        
            this.http.post('http://forehotels.com:3000/api/users_city', city_body, options)
              .map(res => res.json())
              .subscribe(
                  data => {                    
                    let email_body = JSON.stringify({
                        email: this.email,
                        mail: 'employee_welcome'
                            });
                        this.http
                        .post('http://forehotels.com:3000/api/send_email', email_body, options)
                        .map(res => res.json())
                        .subscribe(
                            data => {                              
                        });
                    let sms_body = JSON.stringify({
                        number: this.number,
                        text: 'Hello '+this.name+', Welcome to Forehotels. Use the Forehotels App regularly for latest Job openings'
                            });
                        this.http
                        .post('http://forehotels.com:3000/api/send_sms', sms_body, options)
                        .map(res => res.json())
                        .subscribe(
                            data => {                              
                        });
                  },
                  err => {
                    let alert = this.alertCtrl.create({
                        title: '!Oops Sorry Something went wrong :(',
                        subTitle:'Try Again..!',
                        buttons: [{
                          text: "Dismiss",
                          role: 'cancel',
                          handler: ()=>{
                            this.navCtrl.push(RegisterPage)
                          }
                        }],                  
                      }); 
                      alert.present();
                  });
                  },
                  err => {                    
                  });
          }
      }
  }
      

 success(){
      if(this.uploaded == 2){
        let alert = this.alertCtrl.create({
                  title: 'Congrats!',
                  subTitle: 'Your Account Has been Created Successfully.',
                  buttons: ['OK']
                  });
                  alert.present();

        this.navCtrl.setRoot(LoginPage)
      }
    }

uploadResume(){    
    this.diagnostic.requestExternalStorageAuthorization().then((status)=>{
    if(status == "GRANTED"){
             this.filemanager()             
          }else{
             let alert = this.alertCtrl.create({                              
                              subTitle: "Please Click on Allow to access File",
                              buttons: ['Dismiss']
                            });
                            alert.present();
            }        
        }).catch((e)=>{
            this.toast.show(e, '5000', 'bottom').subscribe(
                toast => {
                  console.log(toast);
                });
        });       
  }
    
  filemanager(){
            this.fc.open()
            .then(
              uri => {
                let Drivepath = uri.split("/")
                if(Drivepath[0] == 'content:'){                                     
                     let fileTransfer: FileTransferObject = this.transfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name[0]+'.pdf').then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        let tourl = entry.toURL()
                        this.filepicup(tourl)
                      }, (error) => {
                        // handle error
                      });
                }else{
                  this.filepicup(uri)               
                }            
            }); 
  }

  filepicup(path){
   this.fp.resolveNativePath(path)
                    .then(filePath => {
                      let x = filePath
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
                        this.resume = x
                        this.view_resume = file
                      }
                    });
  }
  
  uploadPicture(){
      this.fbpic[0] = 'None';  
      this.diagnostic.requestExternalStorageAuthorization().then((status)=>{            
        if(status == "GRANTED"){
          this.fc.open()
          .then(
            uri => {
              let DrivePicpath = uri.split("/")
              if(DrivePicpath[0] == 'content:'){                  
                  let fileTransfer: FileTransferObject = this.transfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name[0]+'.jpg').then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        let tourl = entry.toURL()
                        this.picturepicup(tourl)
                      }, (error) => {
                        // handle error
                      });
              }else{
                this.picturepicup(uri)               
            }
          });
        }else{
            let alert = this.alertCtrl.create({                              
                              subTitle: "Please Click on Allow to access Picture",
                              buttons: ['Dismiss']
                            });
                            alert.present();
                  }  
              }).catch((e)=>{
            this.toast.show(e, '5000', 'bottom').subscribe(
                toast => {
                  console.log(toast);
                });
        });       
                  
    }

  picturepicup(path){
         this.fp.resolveNativePath(path)
                .then(filePath => {
                  let x = filePath
                  var fileArray = x.split("/");
                  this.picpath = fileArray[0]
                  let len = fileArray.length;
                  var file = fileArray[len - 1];
                  var filebits = file.split(".");
                  var f = filebits[1];

                  if((f != "jpg") && (f != "png") && (f != "jpeg")){
                    let alert = this.alertCtrl.create({
                          title: "Invalid File Format",
                          subTitle: "Allowed File extensions are JPG, JPEG and PNG only",
                          buttons: ['Dismiss'],
                        });
                        alert.present();
                  }
                  else{
                    this.picture = x
                    this.view_picture = file
                    }
                  });
      }


  resumeUpload(x){
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
      }else{
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Uploading your Resume...'
              });
            loading.present();
            var fileArray = x.split("/");
            let len = fileArray.length;
            var file = fileArray[len - 1];
            let fileTransfer: FileTransferObject = this.transfer.create();
              
            let options : FileUploadOptions ={
              fileKey: 'resume',
              fileName: x,
              mimeType: "multipart/form-data",
              headers: {
                authorization : this.hash
              },
              params: {
                name: file,
                id: this.empid
              }
            }
            this.completed = false;
            fileTransfer.upload(x, encodeURI("http://forehotels.com:3000/api/upload_employee_resume"), options, true)
            .then((data) => {
              this.completed=true;
              this.uploaded++
              loading.dismiss()       
              this.success()
            }, (err) => {
            let alert = this.alertCtrl.create({
                    title: 'Sorry Something went wrong :(',
                    subTitle:'Try Again..!',
                    buttons: [{
                      text: "Dismiss",
                      role: 'cancel',
                      handler: ()=>{
                        this.navCtrl.push(RegisterPage)
                      }
                    }],
                  
                  });

                  alert.present();
            });
      }
  }  


pictureUpload(x){
  if(this.network.noConnection()){
          this.network.showNetworkAlert()
      }else{
              let loading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Uploading your Picture...'
                });
              loading.present();
              var fileArray = x.split("/");
              let len = fileArray.length;
              var file = fileArray[len - 1];
              let fileTransfer: FileTransferObject = this.transfer.create();;     

                let option: FileUploadOptions = {
                fileKey: 'img',
                fileName: x,
                mimeType: "multipart/form-data",
                headers: {
                  authorization : this.hash
                },
                params: {
                  name: file,
                  id: this.empid
                }
              }
              this.completed = false;
              fileTransfer.upload(x, encodeURI("http://forehotels.com:3000/api/upload_employee_image"), option, true)
              .then((data) => {
                this.completed=true;
              loading.dismiss()
                
              }, (err) => {
                let alert = this.alertCtrl.create({
                      title: err.text(),
                      subTitle: err.json(),
                      buttons: ['Dismiss'],
                    });
                    alert.present();
              });
               this.uploaded++              
            }
        }
  }