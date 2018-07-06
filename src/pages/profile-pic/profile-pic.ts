import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform, Events, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { DashboardPage } from '../dashboard/dashboard';
import { Diagnostic } from '@ionic-native/diagnostic';
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html'
})
export class ProfilePicPage implements OnInit {    
  ngOnInit() {
    this.loadData();
  }
  ionViewDidLoad() {
    this.loadData();
  }
  ionViewWillEnter() {
    this.loadData();
  }
  load:any;
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
  image:any;
  imagefinal:any;
  name:any;
  c:number;
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
              public events: Events,
              public toast:ToastController,
              public diagnostic: Diagnostic,
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
        this.completed = false;
        this.social_pic = false
        // loader.present();
        this.storage.get('user').then((id) =>{
                this.ga.trackEvent("Update Profile Pic Page", "Opened", "", id)
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
             this.image = 'https://www.forehotels.com/public/emp/avatar/'+this.items['0'].profile_pic;
             this.name = this.items["0"].name;
             let img = this.items["0"].profile_pic.split("/")
            //  this.imagefinal=this.items["0"].profile_pic;
             this.drive_name = this.items["0"].email.split('@')
             if(img.length > 1){
               this.social_pic = true;
             }
            //  loader.dismiss();
            },error=>{
                console.log(error);
            } );
   }
  findProfilePic(){
    this.diagnostic.getExternalStorageAuthorizationStatus().then(
      (status)=>{
        let t=this.toast.create({
          message: status,
          duration:3000
        });
        // t.present();
  
      }
    );
   
    this.diagnostic.requestExternalStorageAuthorization().then((status)=>{
    this.filechooser.open()
      .then(
        uri => {
          let DrivePicpath = uri.split("/");
          console.log(JSON.stringify(uri));
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
    });
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
        this.storage.get("counter").then((count)=>{this.c=count;
          file='emp_'+this.id+this.c+'.'+filebits[1];
        let fileTransfer: FileTransferObject = this.filetransfer.create();
      this.options = {
        fileKey: 'img',
        fileName: file,
        mimeType: "multipart/form-data",
        headers: {
          authorization : 'e36051cb8ca82ee0Lolzippu123456*='
        },
        params: {
          name: file,
          id: this.id
        }
      }
      this.completed = false;
      fileTransfer.onProgress(onprogress)
      fileTransfer.upload(x, encodeURI("http://forehotels.com:3000/api/upload_employee_image"), this.options)
      .then((data) => {
        this.progress=null;
        let loader = this.loadingCtrl.create({
          content: "Fetching your Account Details. Kindly wait...",
        
        });
        // loader.present();
        this.completed=true;
        // this.events.publish('user:profilepic','profile pic');
        this.storage.get('id').then((id) =>{
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.hash
          });
          let options = new RequestOptions({ headers: headers });   
          var url="http://www.forehotels.com:3000/api/employee/"+id;
        this.http.get(url,options).subscribe(
          (data)=>{
            let u=JSON.parse((data._body).Users);
            console.log(u); 
            this.imagefinal=u["0"].profile_pic;
            let l=this.alertCtrl.create({
              title:'done updated',
              buttons:['OK']
            });
            l.present();
          },
          (err)=>{
            let t=this.toast.create(
              {
                message:'error',
                duration:3000,
                position:'middle'
              }
            );
            t.present();
          }
        );

  });
       
      }, (err) => {
        let alert = this.alertCtrl.create({
              title: err.text(),
              subTitle: err.json(),
              buttons: ['Dismiss'],
            });
            alert.present();
      });
      if(this.completed)
      {
            this.events.publish('user:profilepic','profile pic');
            this.storage.get('id').then((id) =>{
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.hash
              });
              let options = new RequestOptions({ headers: headers });   
              var url="http://www.forehotels.com:3000/api/employee/"+id;
            this.http.get(url,options).subscribe(
              (data)=>{
                let t=this.toast.create(
                  {
                    message:'hereee',
                    duration:3000,
                    position:'middle'
                  }
                );
                t.present();
              },
              (err)=>{
                let t=this.toast.create(
                  {
                    message:'error',
                    duration:3000,
                    position:'middle'
                  }
                );
                t.present();
              }
            );

      });
    }
    this.c+=1;
    this.storage.set("counter",this.c).then(()=>
    {
      let a=this.alertCtrl.create({
      title:'Profile Pic Updated Successfully',
      buttons:['OK']});
      a.present();
      this.events.publish('user:profilepic','doone');
      this.navCtrl.push(DashboardPage);
    });
      // this.navCtrl.push(ProfilePicPage);
    });
  }
  }
}
}

