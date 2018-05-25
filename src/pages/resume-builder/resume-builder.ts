import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { RegisterPage } from '../register/register'
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast'
import { LoginPage } from '../login/login';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
let total : number = 0;

@Component({
  selector: 'page-resume-builder',
  templateUrl: 'resume-builder.html',
})
export class ResumeBuilderPage {
todo:any;
we:any;
city:any;
pname:any;
name:any;
email:any
gender:any
number:any
password:any;
picture:any
c_id:any
profile:any
qualification:any
skills:any;
org:any;
catering:any;
internship:any
experience:any
referrer: any;
resumeForm:any;
hash:any
items:any
http:any
empid:any
options:any
uploaded:any
completed:any
view_picture:any
fbpic:any;
split:any;
inputs=[]
org2=[]
view:boolean = false
view1:boolean = true
count:number=0

constructor(public alertCtrl: AlertController,
              http: Http,
              public storage: Storage,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public network: NetworkServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public form: FormBuilder,
              private filePath: FilePath,
              private transfer: FileTransfer,
              private filechooser: FileChooser,
            public toast: Toast) {
      this.http = http 
      this.uploaded = 0;
      this.hash = 'e36051cb8ca82ee0Lolzippu123456*='
      this.resumeForm = this.form.group({
      "personal_profile":["A bright, talented and hard working individual with a bubbly, friendly personality and the ability to work as part of a team. Possessing excellent communication & hospitality skills and a proven ability to ensure that all customer expectations are met.",Validators.required],
      "address":["",Validators.required],
      "interest":["Good knowledge of food & beverage",Validators.required],
      "skills":["Communication Skills, Customer Service, Well Presented",Validators.required],
      "hobbies":["",Validators.required],
      "language":["Hindi, English",Validators.required],
      "org":[this.org, Validators.required],
      })
          this.org = navParams.get('org')
          this.name = navParams.get('name')
          this.email = navParams.get('email')
          this.number = navParams.get('number') 
          this.referrer = navParams.get('referrer')
          this.experience = navParams.get('total_exp')
          this.qualification = navParams.get('education')
          this.skills = navParams.get('skills')
          this.catering = navParams.get('catering')
          this.internship = navParams.get('internship') 
          this.city = navParams.get('city')
          this.pname = navParams.get('designation')
          this.password = navParams.get('password')
          this.picture = navParams.get('picture')
          this.fbpic = this.picture.split('/')
          this.gender = navParams.get('gender')
          if(this.org == 'None'){
            this.view1 = false;
          }
    }
addInput() {      
          this.view = true
           this.inputs.push({});
          // for(let i=0; i < this.inputs.length; i++){
          //   console.log("Exp: "+parseInt(this.inputs[i].exp))
          //   total +=parseInt(this.inputs[i].exp)
          // }
          // console.log('Total Exp: '+total) 
          // console.log('INPUT VALUE: '+JSON.stringify(this.inputs))       
  }
removeInput (index) {
        this.inputs.splice(index, 1);
    }
register(){
      for(let i=0; i<this.inputs.length; i++){
        if(this.inputs[i].org1 == undefined){
          let toast = this.toastCtrl.create({
          message: 'Please input Something',
          duration: 5000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'OK!',
          cssClass: "redClass"
        });
        toast.present();
        }else{
      this.org2.push(this.inputs[i].exp+ ' Years at '+this.inputs[i].org1) 
      }
    }    
    this.apiregister(this.org2);            
  }    
apiregister(org2){
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Creating your account...'
            });
            loading.present();
            this.items = this.resumeForm.value;
            let body = JSON.stringify({
              name: this.name,
              password: this.password,
              contact_no: this.number,
              user_type: 2,
              region: 'India',
              email: this.email,
              organization2: (org2).toString(),
              gender: this.gender,
              profile_pic: this.picture,
              experience: this.experience,
              designation: this.pname,
              qualification: this.qualification,
              org: this.items.org,
              internship: this.internship,
              catering: this.catering,
              referrer: this.referrer,
              personal_profile: this.items.personal_profile,
              address:this.items.address,
              interest:this.items.interest,
              skills:this.items.skills,
              hobbies:this.items.hobbies,
              language:this.items.language,
              resume:'created'
            });
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': this.hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://forehotels.com:3000/api/insert_resume', body, options)
                .subscribe(
                    datas => {
                      this.empid = JSON.parse(datas._body).User;
                      loading.dismiss()                      
                        if(this.fbpic[0] == 'https:'){
                              this.uploaded++
                              this.apicity(this.empid)                     
                          } else if( this.fbpic[0]== 'file:'){
                            this.pictureUpload(this.picture, this.empid)                            
                          }
                    },
                    err => {
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

apicity(empid){
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      });
      let options = new RequestOptions({ headers: headers });              
      let city_body = JSON.stringify({
                      city_id:this.city,
                      user_id: empid
                    });                 
        this.http.post('http://forehotels.com:3000/api/users_city', city_body, options)
          .map(res => res.json())
          .subscribe(
              data => {                
                setTimeout(()=> {         
                          this.success()
                      }, 2000);
                let email_body = JSON.stringify({
                    email: this.email,
                    mail: 'employee_welcome'
                        });                  
                    this.http.post('http://forehotels.com:3000/api/send_email', email_body, options)
                    .map(res => res.json())
                    .subscribe(
                        data => {                          
                    });
                let sms_body = JSON.stringify({
                    number: this.number,
                    text: 'Hello '+this.name+', Welcome to Forehotels. Use the Forehotels App regularly for latest Job openings'
                        });
                    this.http.post('http://forehotels.com:3000/api/send_sms', sms_body, options)
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
              }
          );
    }
success(){
       if(this.uploaded == 1){
        let alert = this.alertCtrl.create({
                  title: 'Congrats!',
                  subTitle: 'Your Account Has been Created Successfully.',
                  buttons: ['OK']
                  });
                  alert.present();
        this.navCtrl.setRoot(LoginPage)
       }
    }
pictureUpload(x,empid){
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
      let fileTransfer: FileTransferObject = this.transfer.create();
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
        this.uploaded++; 
        this.apicity(empid)
      }
   }
}