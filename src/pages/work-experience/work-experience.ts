import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CityPage } from '../city/city';
import { Storage } from '@ionic/storage'
import { Http, Headers, RequestOptions } from '@angular/http';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-work-experience',
  templateUrl: 'work-experience.html',
})
export class WorkExperiencePage {
  name:any;
  email:any
  gender:any
  number:any
  password:any;
  picture:any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private network:NetworkServiceProvider) {
              this.name = navParams.get('name')
              this.email = navParams.get('email')
              this.gender = navParams.get('gender')
              this.number = navParams.get('number') 
              this.password = navParams.get('password')
              this.picture = navParams.get('picture')
}

 moveNext(item){
   if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
                this.navCtrl.push(DesignationPage, {
                exp:item,
                name: this.name,
                email:this.email,
                number:this.number,
                gender:this.gender,
                password:this.password,
                picture:this.picture
            });
        }
    }
}
/*********************WorkExperience-Page-End**********************/


/*********************Designation-Page-Start**********************/
@Component({
  template:`
  <style>
  .center {
    margin-left: auto;
    margin-right: auto;
    display: block;
    text-align: center;
  }
  ion-col.col
  {
    border-top: solid 1px #808080;    
    border-right: solid 1px #808080;
    text-align: center;
  }
  .grid{
    padding: 0px;
    margin-right: -1px;
  }
  .listheader{
    text-align: center;
    font-size: 20px;
    margin-bottom: 0px;
    font-weight: bold;
  }
  </style>
  <ion-header>
 <ion-navbar>
    <ion-title>Select Post</ion-title>
  </ion-navbar>
</ion-header>
<ion-content> 
   <ion-list style="background-color:#ffffff;padding-top: 2%;">
   <ion-list-header class="listheader">
    Service
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of service | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
    <ion-list-header class="listheader">
    Kitchen
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of kitchen | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
    <ion-list-header class="listheader">
    Bartender
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of bartender| slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
     <ion-list-header class="listheader">
    Front Office
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of front_office | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
    <ion-list-header class="listheader">
    HouseKeeping Staff
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of hk | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
    <ion-list-header class="listheader">
    Others
  </ion-list-header>
   <ion-grid>          
    <ion-row *ngFor="let i of rows">
         <ion-col *ngFor="let p of other | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
          <img src="https://www.forehotels.com/public/assets/img/designation_icon/{{p.icon}}"/>
               <p>{{p.designation}}</p>
        </ion-col>
    </ion-row>
   <div style="border-top:solid 2px #808080"></div>
    </ion-grid>
    </ion-list>
</ion-content>`
})
export class DesignationPage{  
  http:any
  rows: any;
  resitems:any
  name:any;
  email:any
  gender:any
  number:any
  password:any
  picture:any
  exp:any
  service= []
  kitchen= []
  bartender= []
  front_office=[]
  hk=[]
  other=[]   
  pages: Array<{title: any, img:any}>;
 constructor(public storage: Storage,
             public navCtrl: NavController,
             http: Http,
             public loadingCtrl: LoadingController,
             public network:NetworkServiceProvider,
             public navParams: NavParams) {
              this.name = navParams.get('name')
              this.email = navParams.get('email')
              this.gender = navParams.get('gender')
              this.number = navParams.get('number')
              this.picture = navParams.get('picture')
              this.password = navParams.get('password')
              this.exp = navParams.get('exp')              
              if(this.network.noConnection()){
                  this.network.showNetworkAlert()
                  }else{
                    let loader = this.loadingCtrl.create({
                    spinner: 'bubbles',
                    content: 'Fetching Posts...'
                  }); 
              loader.present()              
              this.http = http;
              this.storage.get("Hash").then((value)=>{
              let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': value
              });
            let options = new RequestOptions({ headers: headers });
              this.http.get("http://www.forehotels.com:3000/api/designation", options)
                    .subscribe(data =>{
                    this.resitems=JSON.parse(data._body);
                    for(let i=0;i<this.resitems.length; i++){
                      if(this.resitems[i].parent_id == 2){
                      this.service.push(this.resitems[i])
                    }
                      if(this.resitems[i].parent_id == 4){
                        this.kitchen.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 3){
                        this.bartender.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 1){
                        this.front_office.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 5){
                        this.hk.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 6){
                        this.other.push(this.resitems[i])
                      }
                  }
              loader.dismiss()
              this.rows = Array.from(Array(Math.ceil(this.resitems.length/3)).keys());
          });
        });      
      }
  }


selectvalue(data){  
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
        let loader = this.loadingCtrl.create({
          spinner: 'bubbles',
          content:'Fetching Cities Please Wait...'
        })  
        loader.present()
        this.navCtrl.push(CityPage,{
          loader: loader,
          name:this.name,
          email:this.email,
          number:this.number,
          gender:this.gender,
          password:this.password,
          picture:this.picture,
          exp: this.exp,
          designation: data.designation,
          parent_id: data.parent_id,
        },{animate:true,animation:'transition',duration:500,direction:'forward'})
      }
  }
}
/*********************Designation-Page-Start**********************/