import { Component,OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, 
         ViewController, AlertController, Platform  } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { JobDetailPage } from '../job-detail/job-detail';
import { Data } from '../../providers/data';
import { City } from '../../providers/city';
import { Toast } from '@ionic-native/toast'
import 'rxjs/add/operator/debounceTime';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
let loader111;

@Component({
  selector: 'page-search-jobs',
  templateUrl: 'search-jobs.html'
})
export class SearchJobsPage {
items: any;
http:any;
count:any;
resitems:any;
jobscount: number = 10;
data:any;
modal:any;
hash: any;
dataempty: any;
view: boolean;
constructor(private storage:Storage,
              public toast: Toast, 
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public navCtrl: NavController, 
              http: Http, 
              public loadingCtrl: LoadingController,
              public platform: Platform,
              private network: NetworkServiceProvider,
              private ga: GoogleAnalytics) {
              this.http = http;
              this.items= []
              this.loadData(this.dataempty);
    }
  //   loadData()
  //   {
  //     if(this.network.noConnection()){
  //                     this.network.showNetworkAlert()
  //                 }
  //     else{              
  //            let loader = this.loadingCtrl.create({
  //                        spinner: 'bubbles',
  //                       content: `Please Wait...`,
  //                      });
  //            this.storage.get('id').then((id) => {
  //                       this.platform.ready().then(() => {
  //                         this.ga.trackEvent("Jobs", "Opened", "New Session Started", id, true)
  //                         this.ga.setAllowIDFACollection(true)
  //                         this.ga.setUserId(id)
  //                         this.ga.trackView("Jobs")
  //                       });
  //                   });
  //             this.storage.get('Hash').then((hash) => {
  //                     this.hash = hash;
  //                     loader.present();
  //                     let body=JSON.stringify({
  //                       des:"Captian"
  //                     });
  //                     let headers = new Headers({
  //                                     'Content-Type': 'application/json',
  //                                     'Authorization': this.hash });
                                    
  //                     let options = new RequestOptions({ headers: headers });
  //                     this.http.post('http://localhost:3000/api/jobshotel',body,options).subscribe(
  //                       (data)=>{
  //                         this.items=JSON.parse(data)
  //                       }
  //                     )
  //   }
  // }
// }

loadData(data){
    if(this.network.noConnection()){
              this.network.showNetworkAlert()
          }else{              
              let loader = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: `Please Wait...`,
            });
            this.storage.get('id').then((id) => {
                this.platform.ready().then(() => {
                  this.ga.trackEvent("Jobs", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Jobs")
                });
         
            this.storage.get('Hash').then((hash) => {
              this.hash = hash;
              loader.present();
              let body;
              // body=JSON.stringify({
              //   pname:""
              // })
              let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': this.hash });
            
              let options = new RequestOptions({ headers: headers });
              this.http.get('http://www.forehotels.com:3000/api/employee/'+id,options).subscribe(
                (data)=>{
                  let i=JSON.parse(data._body).Users;
                  let post=i["0"].designation;
                  let body=JSON.stringify({
                    pname:post
                  });
           
              this.http
                .post('http://www.forehotels.com:3000/api/jobshotel', body, options)
                .subscribe(
                    data => {
                      this.resitems = JSON.parse(data._body).Jobs;
                      this.count = this.resitems.length;
                      if(this.count == 0){
                        this.view = false;
                        this.items.splice(0,this.items.length)
                      //  this.items.push({})                        
                      }else{
                      for(let i of this.resitems){
                        let temp = i.salary_range.split(",");
                        let range = temp[0]+" - "+temp[1]+" / Month";
                        i.salary_range = range;
                      }
                      for (let i = 0; i < this.count; i++) {
                        this.items.push( this.resitems[i] );
                      }
                    }
                      loader.dismiss()
                },
                    err => {
                      console.log("ERROR!: ", err);
                    });
          });
        });
  this.view = true;
  });
}
}

presentProfileModal() {
  if(this.network.noConnection()){
      this.network.showNetworkAlert()
    }else{       
      
      if(this.data!=undefined || this.data != null){
        this.modal = this.modalCtrl.create(ModalContentPage, {
            pname: this.data.job,
            city: this.data.city,
            city_name: this.data.city_name,
            jobexp: this.data.exp,
            category: this.data.cat,
            cat_name : this.data.cat_name,
            check_tips: this.data.tips,
            check_staff_room: this.data.staff_room,
            check_pf: this.data.pf,
            check_incentives : this.data.incentives,
            check_service_charge: this.data.services,
            check_salary: this.data.salary,
        });
      }else{
        this.modal = this.modalCtrl.create(ModalContentPage,{
        })
      }
      this.modal.onDidDismiss(data => {
        this.data = data
        this.loadData(data)
    });
      this.modal.present();
    }
}

   jobdetail(job){
     if(this.network.noConnection()){
            this.network.showNetworkAlert()
            }else{
   this.navCtrl.push(JobDetailPage, {
      job: job
    });
     }
      }   
    }
@Component({
  template: `
<style>
.bar-button-clear-ios, .bar-button-default.bar-button-ios-clear, .bar-button-clear-ios-clear{
  color: black;
}
ion-grid{
  padding: 0px !important;
}
ion-scroll {
    white-space: nowrap;
    height: 1000px;
  }
  #footer {   
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: transparent;
    box-shadow: none;
}
#footerbtn {
    background: #0070FF;
    text-align: center;    
    z-index:1000;
    font-size: 18px;
    font-family: sans-serif;
    font-weight: bold;
    width: 100%;
    height: 2em;  
}
}
</style>
  <ion-header>
  <ion-toolbar>
    <ion-buttons start>
      <button ion-button clear (click)="dismiss()" >x</button>
    </ion-buttons>
    <ion-title>Filter</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
<ion-row style="height:100%">
<ion-col width-33 style="color:black;background-color:#fff;height: 100%;white-space:pre-wrap">
    <ion-list>
      <button style="white-space:pre-wrap" ion-item *ngFor="let p of filters" (click)="setActive(p.id)" [style.background-color]="getStyle(p.id)">
        {{p.title}}
     </button>
    </ion-list>
 </ion-col>
 <ion-col width-67 style="color:black;background-color:white;height: 100%;">
  
    <div *ngIf="this.filters[1].active == true">
  <ion-card style="display: flex;">
    <ion-icon style="font-size: 2.2em;padding: 5%;" name="search"></ion-icon>
      <ion-input [(ngModel)]="searchCity" (ionChange)="notify_city($event)" [formControl]="searchCityControl" value="{{this.city_name}}" (ionInput)="onSearchCity()" placeholder="Search"></ion-input>
     </ion-card>
            <ion-item>
       <div *ngIf="searchingCity" class="spinner-container">
        <ion-spinner></ion-spinner>
       </div>
    <ion-scroll scrollY="true">
    <ion-list *ngFor="let item of city">
        <ion-item (click)="onclickCity(item)" style="white-space:pre-wrap">
            {{item.city_name}}
        </ion-item>
    </ion-list><br>
    <div *ngIf="city?.length === 3" style="white-space:pre-wrap">
         <br>OR Type your Preferred City above.<br>
    </div>
    </ion-scroll>
  </ion-item>
    </div>

    <div *ngIf="this.filters[0].active == true">
    <ion-card style="display: flex;">
    <ion-icon style="font-size: 2.2em;padding: 5%;" name="search"></ion-icon>
      <ion-input [(ngModel)]="searchTerm" (ionChange)="notify_pname($event)" [formControl]="searchControl" (ionInput)="onSearchInput()" value="{{this.pname}}" placeholder="Search"></ion-input>
     </ion-card>
            <ion-item >
       <div *ngIf="searching" class="spinner-container">
        <ion-spinner></ion-spinner>
       </div>
    <ion-scroll scrollY="true">
    <ion-list>

        <ion-item *ngFor="let item of this.post" (click)="onclick(item)">
            {{item.designation}}
        </ion-item>
    </ion-list>
    </ion-scroll>
  </ion-item>
    </div>

    <!--For Exp-->
    <div *ngIf="this.filters[2].active == true" (click)="selectExp()">
          <ion-list radio-group name="exp">
      <ion-item>
      <ion-label>Fresher</ion-label>
        <ion-radio (click)="exp_checker(0)" [checked]="0 == this.jobexp"></ion-radio>
      </ion-item>
      <ion-item *ngFor="let i of exp">
      <ion-label>{{i}}</ion-label>
        <ion-radio (click)="exp_checker(i)" [checked]="i == this.jobexp"></ion-radio>
      </ion-item>
          </ion-list>
     </div>

		<div *ngIf="this.filters[3].active == true">
		  <ion-list radio-group name="salary">
		  <ion-item>
		  <ion-label>Rs.5,000 to Rs.10,000</ion-label>
			<ion-radio (click)="salary_check('5000,10000')" [checked]="this.check_salary == '5000,10000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.10,000 to Rs.20,000</ion-label>
			<ion-radio (click)="salary_check('10000,20000')" [checked]="this.check_salary == '10000,20000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.20,000 to Rs.30,000</ion-label>
			<ion-radio (click)="salary_check('20000,30000')" [checked]="this.check_salary == '20000,30000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.30,000 to Rs.50,000</ion-label>
			<ion-radio (click)="salary_check('30000,50000')" [checked]="this.check_salary == '30000,50000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.50,000 to Rs.75,000</ion-label>
			<ion-radio (click)="salary_check('50000,75000')" [checked]="this.check_salary == '50000,75000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.75,000 to Rs.1,00,000</ion-label>
			<ion-radio (click)="salary_check('75000,100000')" [checked]="this.check_salary == '75000,100000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.1,00,000 to Rs.2,00,000</ion-label>
			 <ion-radio (click)="salary_check('100000,200000')" [checked]="this.check_salary == '100000,200000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.2,00,000 to Rs.5,00,000</ion-label>
			 <ion-radio (click)="salary_check('200000,500000')" [checked]="this.check_salary == '200000,500000'"></ion-radio>
		  </ion-item>
		  <ion-item>
		  <ion-label style="white-space:pre-wrap">Rs.5,00,000 to Rs.12,00,000</ion-label>
			 <ion-radio (click)="salary_check('500000,100000')" [checked]="this.check_salary == '500000,1200000'"></ion-radio>
		  </ion-item>
		  </ion-list>
		</div>

    <!--For Perks-->
    <div *ngIf="this.filters[4].active == true">
    <ion-item>
      <ion-label style="white-space:pre-wrap">Tips</ion-label>
      <ion-checkbox (click)="tips()" [checked]="this.check_tips == 'Yes' "></ion-checkbox>
    </ion-item>

    <ion-item>
      <ion-label style="white-space:pre-wrap">Service Charge</ion-label>
      <ion-checkbox (click)="services()" [checked]="this.check_service_charge == 'Yes' "></ion-checkbox>
    </ion-item>

    <ion-item>
      <ion-label style="white-space:pre-wrap">Incentives</ion-label>
      <ion-checkbox (click)="incentives()" [checked]="this.check_incentives == 'Yes' "></ion-checkbox>
    </ion-item>

    <ion-item>
      <ion-label style="white-space:pre-wrap">Staff Room</ion-label>
      <ion-checkbox (click)="staff_room()" [checked]="this.check_staff_room == 'Yes' "></ion-checkbox>
    </ion-item>

    <ion-item>
      <ion-label style="white-space:pre-wrap">Provident Fund & ESIC</ion-label>
      <ion-checkbox (click)="pf()" [checked]="this.check_pf == 'Yes' "></ion-checkbox>
    </ion-item>
    </div>

    <!--For Category-->
    <div *ngIf="this.filters[5].active == true">
     <ion-list radio-group name="category">
  <ion-item *ngFor="let item of cat">
    <ion-label>{{item.cat_name}}</ion-label>
    <ion-radio (click)="cat_check(item.id,item.cat_name)" [checked]="item.cat_name == this.check_category"></ion-radio>
  </ion-item>
    </ion-list>
    </div>
 </ion-col>
</ion-row>
<ion-item id="footer">
  <button ion-button id="footerbtn" (click)="apply()">Apply</button>
</ion-item>
</ion-content>
`
})
export class ModalContentPage { 
 
  job:any;
    exper:any;
    post:any;
    item:any;
    city:any;
    items:any;
    http:any;
    exp = [];
    salary:any;
    salary_range:any;
    searchTerm: string = '';
    searchCity: string = '';
    searchControl: FormControl;
    searchCityControl: FormControl;
    cat: any;
    searching: any = false;
    searchingCity: any = false;
    pname:any;
    did:any;;
    city_name:any;
    c_id:any;
    tipsChecker:any;
    service_charge:any;
    incentivesCheck:any;
    staff_room_check:any;
    pf_check:any;
    category:any;
    experience:any;
    fresh:any;
    jobexp:any;
    hash:any;
    check_incentives:any;
    check_service_charge:any;
    check_tips:any;
    check_staff_room:any;
    check_pf:any;
    cat_name:any;
    check_category:any;
    check_salary:any;
    filters: Array<{id: number, title: string,active: boolean}>;
  constructor(http: Http,
              private storage: Storage,
              public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private form: FormBuilder,
              public platform: Platform,
              public alertCtrl : AlertController,
              public dataService: Data,
              public loadingCtrl: LoadingController, 
              private network: NetworkServiceProvider,
              public cityService: City) {
              
                this.searchControl = new FormControl();
                this.searchCityControl = new FormControl();
  
              this.pname = navParams.get('pname');
              this.city_name = navParams.get('city_name');
              this.jobexp = navParams.get('jobexp');
              this.check_category = navParams.get('cat_name');
              this.check_tips = navParams.get('check_tips');
              this.check_incentives = navParams.get('check_incentives');
              this.check_service_charge = navParams.get('check_service_charge');
              this.check_staff_room = navParams.get('check_staff_room');
              this.check_pf = navParams.get('check_pf');
              this.check_salary = navParams.get('check_salary');
              this.filters = [
              { id:0, title:'Position', active:true},
              { id:1, title:'City', active:false},
              { id:2, title:'Experience', active:false},
              { id:3, title:'Salary', active:false},
              { id:4, title: 'Perks', active:false},
              { id:5, title: 'Category', active:false}];
              this.http = http;

        if(this.network.noConnection()){
              this.network.showNetworkAlert()
          }else{
              this.storage.get('Hash').then((hash) => {
              this.hash = hash;
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.hash});

              let options = new RequestOptions({ headers: headers });
              this.http.get("http://forehotels.com:3000/api/hotel_category", options)
                  .subscribe(data =>{
                  this.cat=JSON.parse(data._body).Category; //Bind data to items object
                },error=>{
                      console.log(error);// Error getting the data
                  } )
              for(var i = 1 ; i < 51 ; i++){
                this.exp.push(i)
              }
              this.setFilteredItems();
              this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
                  this.searching = false;
                  this.setFilteredItems();
              });
              this.setFilteredCity();
              this.searchCityControl.valueChanges.debounceTime(700).subscribe(search => {
                  this.searchingCity = false;
                  this.setFilteredCity();
              });
          });
        }
  }
getStyle(p) {
      for(var i = 0; i < (this.filters.length) ; i++){
      if(this.filters[i].active == true) {
        if(p == i){
            return "#ddd7d7";
          } else {
            return "";
          }
        }
      }
  }

setActive(p){
      let loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: `Please Wait...`,
      });
      loader.present()
     for(var i = 0; i < (this.filters.length) ; i++){
        if(p == i){
          this.filters[i].active = true
          loader.dismiss()
        }
        else{
          this.filters[i].active = false
        }
     }
     setTimeout(() => {
     }, 1000)
  }
notify_pname(value){  
  this.pname = value.value
}
notify_city(value){  
  this.city_name= value.value
}
onclick(item){
       this.pname = item.designation;
       }

onclickCity(item){
       this.city_name = item.city_name;
       this.c_id = item.c_id
          }

onSearchInput(){
		  this.searching = true;
						}

onSearchCity(){
      this.searchingCity = true;
              }
setFilteredItems() {
            this.post = this.dataService.filterItems(this.searchTerm);
            
             }
setFilteredCity(){
            this.city = this.cityService.filterItems(this.searchCity);
          }

tips(){
        this.tipsChecker = 'Yes';
      }

services(){
        this.service_charge = 'Yes';
      }

incentives(){
        this.incentivesCheck = 'Yes';
      }

staff_room(){
        this.staff_room_check = 'Yes';
      }

pf(){
        this.pf_check = 'Yes';
      }

cat_check(item,cat_name){
        this.category = item;
        this.cat_name = cat_name;
      }

exp_checker(i){
        this.experience = i;      }

salary_check(value){
         this.salary = value;
      }

apply(){
      let data = {
      job: this.pname,
      city_name: this.city_name,
      city: this.c_id,
      tips: this.tipsChecker,
      services: this.service_charge,
      incentives: this.incentivesCheck,
      staff_room: this.staff_room_check,
      pf: this.pf_check,
      exp: this.experience,
      cat: this.category,
      cat_name: this.cat_name,
      salary: this.salary
    }
     console.log('Pname ',data.job)
      this.viewCtrl.dismiss(data);
}
  
dismiss() {
      let data = {
        job: null,
        city: null,
        tips: null,
        services: null,
        incentives: null,
        staff_room: null,
        pf: null,
        exp: null,
        cat: null,
        salary: null
    }
      this.viewCtrl.dismiss(data);
    }
}