import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController,AlertController, PopoverController } from 'ionic-angular';
import { UploadResumePage } from '../upload-resume/upload-resume';
import { FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-other-detail',
  templateUrl: 'other-detail.html'
})
export class OtherDetailPage {
bd = {}
view:any;
pname:any;
city:any;
data:any
modal:any;
c_id:any;
todo:any;
view1:boolean
we:any;
i:any;
exp:any;
length:any
name:any;
email:any
gender:any
number:any
color:String="#1396e2"
password:any;
picture:any
otherDetailForm:any;
items:any;
item:any;
org:any
designation
reference
education
internship = "No"
catering = "Yes"
total_exp  
  constructor(public form: FormBuilder,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public network: NetworkServiceProvider,
              public modalCtrl: ModalController, 
              public alertCtrl: AlertController,
              public popoverCtrl: PopoverController) {
       
        this.name = navParams.get('name')
        this.email = navParams.get('email')
        this.gender = navParams.get('gender')
        this.number = navParams.get('number') 
        this.password = navParams.get('password')
        this.picture = navParams.get('picture')
        this.exp = navParams.get('exp')
        this.city = navParams.get('city')
        this.designation = navParams.get('designation')
        this.education= navParams.get('education')
        if(this.exp == 'fresher'){
            this.view1 = false
            this.total_exp = '0'
            this.org = 'None'
               this.view = true
        }
        else if(this.exp == 'experienced'){
            this.view1 = true
        }
        console.log('Other Detail page');
        console.log(this.name);
       console.log(this.email);
       console.log(this.gender);
       console.log(this.number);
       console.log(this.password);
       console.log(this.picture);
       console.log(this.exp);
       console.log(this.designation);
       console.log(this.education); 
        
}

    presentPopoverExp(myEvent){
        let popover = this.popoverCtrl.create(PopoverPageExp);
        popover.present({
        ev: myEvent
        });
        popover.onDidDismiss((data)=>{      
        this.total_exp = data;
   })
}
        enableView(){
            console.log('EXP '+this.total_exp)
            if(this.org != undefined && this.total_exp != undefined){
                this.view = true
                this.color= "#1396e2"
                }
            else{
                this.color = '#ff0000'
            }
        }
  moveNext(){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
      this.navCtrl.push(UploadResumePage, {
                education: this.education,
                experience:this.exp,
                name: this.name,
                email:this.email,
                number:this.number,
                gender:this.gender,
                password:this.password,
                picture:this.picture,
                designation:this.designation,
                total_exp: this.total_exp,
                city:this.city,
                org:this.org,
                reference:this.reference,
                catering:this.catering,
                internship:this.internship,
            });
        }
  }  
}

/****************Total Exp Start**************/
@Component({
  template: `  
    <ion-list>
        <ion-list-header>Select Total Experience</ion-list-header>      
        <button ion-item *ngFor="let i of exp" (click)="updateNumber(i)">{{i}}</button>      
    </ion-list>
  `
})
export class PopoverPageExp {
 exp=[]
  constructor(public viewCtrl: ViewController) {
      for(let i=1; i<31; i++){
        this.exp.push(i)  
      }
  }
        
  updateNumber(item) {
    this.viewCtrl.dismiss(item);
  }
}
/****************Total EXP End**************/