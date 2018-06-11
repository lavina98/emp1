import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform, Events } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html'
})
export class ProfilePicPage {    
  ionViewDidEnter(){
     this.loadData()
  }
  profilePicForm:any;
  items:any;
  options:any;
  progress: number;
  completed:boolean;
  http:any;
  id:any;
  hash:any;
  social_pic:any;
  drive_name:any;
  constructor(private loadingCtrl: LoadingController, 
              http: Http, 
              public network: NetworkServiceProvider,
              private filePath: FilePath,
              private filetransfer: FileTransfer,
              private filechooser: FileChooser,
              private storage: Storage, 
              private ngZone: NgZone, 
              private platform: Platform, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController, 
              private ga: GoogleAnalytics,
              public events: Events
              ) {           
            this.http = http;    
    }
      loadData(){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{  
      let loader = this.loadingCtrl.create({
      content: "Fetching your Account Details. Kindly wait...",
    });
        
        this.social_pic = false
        loader.present();
        this.storage.get('user').then((id) =>{
                this.ga.trackEvent("Update Profile Pic Page", "Opened", "", id.id)
                this.ga.trackView("Update Profile Pic")
              });
        this.storage.get('Hash').then((hash) => {
            this.hash = hash;
        });
        this.storage.get('id').then((id) =>{
              
              var url="http://www.forehotels.com:3000/api/employee/"+id;
              this.getDetails(url, loader);
              this.id = id;
            });  
          }
      }
  getDetails(x, loader){
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
             if(img.length > 1){
               this.social_pic = true;
             }
             loader.dismiss();
            },error=>{
                console.log(error);
            } );
   }
  findProfilePic(){
    this.filechooser.open()
      .then(
        uri => {
          let DrivePicpath = uri.split("/") 
          if(DrivePicpath[0] == 'content:'){
              let fileTransfer: FileTransferObject = this.filetransfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name[0]+'.jpg').then((entry) => {                        
                        let tourl = entry.toURL()
                        this.profilePicUpload(tourl)
                      }, (error) => {
                        // handle error
                      });
          }else{
            this.filePath.resolveNativePath(uri)
            .then(filePath => {                 
              this.profilePicUpload(filePath);
            });
        }
      });
  }
  stateChange() {
    setTimeout('', 3000);
  }
  profilePicUpload(x){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
      this.completed=false;
      var fileArray = x.split("/");
      let len = fileArray.length;
      let file = fileArray[len - 1];
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
        let fileTransfer: FileTransferObject = this.filetransfer.create();
      this.options = {
        fileKey: 'img',
        fileName: x,
        mimeType: "multipart/form-data",
        headers: {
          authorization : 'e36051cb8ca82ee0Lolzippu123456*='
        },
        params: {
          name: file,
          id: this.id
        }
      }
      
       let onProgress =  (progressEvent: ProgressEvent) : void => {
        this.ngZone.run(() => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.progress = progress    
            }
        });
    }
      this.completed = false;
      fileTransfer.onProgress(onProgress)
      fileTransfer.upload(x, encodeURI("http://forehotels.com:3000/api/upload_employee_image"), this.options, true)
      .then((data) => {
        this.progress=null;
        this.completed=true;
        let loader = this.loadingCtrl.create({
          content: "Fetching your Account Details. Kindly wait...",
        });
        loader.present();
        let url="http://www.forehotels.com:3000/api/employee/"+this.id;
        this.getDetails(url,loader);
        this.navCtrl.pop();
        this.navCtrl.push(ProfilePicPage);
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
  }
}


