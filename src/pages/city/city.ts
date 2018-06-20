import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController,ToastController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { OtherDetailPage } from '../other-detail/other-detail';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';
import { City } from '../../providers/city';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'page-city',
  templateUrl: 'city.html',
})
export class CityPage {
  http:any;
  items = []
  hash:any;
  user_cities:any;
  emp_id:any;
  value:any;
  selected_cities = [];
  user_city = [];
  cities:any;
  name:any;
  email:any
  gender:any
  number:any
  password:any;
  picture:any
  exp:any
  city_id
  designation:any
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  loader:any
  constructor(public navCtrl: NavController,
              private navParams:NavParams ,
              public alertCtrl: AlertController, 
              public storage: Storage, http: Http, 
              public viewCtrl: ViewController,
              public toastCtrl : ToastController,
              public dataService: City) {
              this.http = http;
        this.searchControl = new FormControl();
        
        this.selected_cities = navParams.get('user_city')
        this.name = navParams.get('name')
        this.email = navParams.get('email')
        this.gender = navParams.get('gender')
        this.number = navParams.get('number') 
        this.password = navParams.get('password')
        this.picture = navParams.get('picture')
        this.exp = navParams.get('exp')
        this.loader = navParams.get('loader')
        this.designation = navParams.get('designation') 
        console.log('City  page');
        console.log(this.name);
       console.log(this.email);
       console.log(this.gender);
       console.log(this.number);
       console.log(this.password);
       console.log(this.picture);
       console.log(this.exp);
       console.log(this.loader);
       console.log(this.designation);          
    }
      ionViewDidLoad() {
        this.setFilteredItems(); 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.setFilteredItems(); 
        }); 
    }
    onSearchInput(){
        this.searching = true;
    }
        setFilteredItems() {
        this.items = this.dataService.filterItems(this.searchTerm);
        this.loader.dismiss()
    }
        updateCity(e: any,c_id){
        if(e.checked){
          this.user_city.push(c_id)
        }else{
         var ind = this.user_city.indexOf(c_id)
            this.user_city.splice(ind, 1);
          }
    }
        apply(){
          if(this.user_city.length == 0){
            let toast = this.toastCtrl.create({
            message: 'Please select a city',
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            cssClass: "redClass"
        });
        toast.present();
          }else{
          let data = {
            user_city:  this.user_city
          }
          console.log('--------------user city-------'+data.user_city);
          this.navCtrl.push(EducationPage, {
                data: data.user_city,
                exp:this.exp,
                name: this.name,
                email:this.email,
                number:this.number,
                gender:this.gender,
                password:this.password,
                picture:this.picture,
                designation:this.designation
          })
        }
      }  
      dismiss() {   
      this.navCtrl.pop({});
  }
}
/****************Education**************/
@Component({
  template: `
  <ion-content>
  <ion-list radio-group>
  <ion-list-header style="font-weight:bold">
    Education
  </ion-list-header>

  <ion-item>
    <ion-label>Below 10th</ion-label>
    <ion-radio (click)="selectvalue('Below 10th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>10th</ion-label>
    <ion-radio (click)="selectvalue('10th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>12th</ion-label>
    <ion-radio (click)="selectvalue('12th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Below 12th</ion-label>
    <ion-radio (click)="selectvalue('Below 12th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Degree in Hotel Management</ion-label>
    <ion-radio (click)="selectvalue('Degree in Hotel Management')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>BSc. in Hotel Management</ion-label>
    <ion-radio (click)="selectvalue('BSc. in Hotel Management')"></ion-radio>
  </ion-item>
  
  <ion-item>
    <ion-label>Other</ion-label>
    <ion-radio (click)="selectvalue('Other')"></ion-radio>
  </ion-item>
</ion-list>
</ion-content>`
})
export class EducationPage{
  name:any;
  email:any
  gender:any
  number:any
  password:any;
  picture:any
  exp:any
  city:any
  designation:any
     constructor(public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController) {  
        this.name = navParams.get('name')
        this.email = navParams.get('email')
        this.gender = navParams.get('gender')
        this.number = navParams.get('number') 
        this.password = navParams.get('password')
        this.picture = navParams.get('picture')
        this.exp = navParams.get('exp')
        this.city = navParams.get('data')
        this.designation = navParams.get('designation')
        console.log('Education  page');
        console.log(this.name);
       console.log(this.email);
       console.log(this.gender);
       console.log(this.number);
       console.log(this.password);
       console.log(this.picture);
       console.log(this.exp);
       console.log(this.designation); 
  }

    selectvalue(item){
      this.navCtrl.push(OtherDetailPage,{
                education: item,
                exp:this.exp,
                name: this.name,
                email:this.email,
                number:this.number,
                gender:this.gender,
                password:this.password,
                picture:this.picture,
                city:this.city,
                designation:this.designation
      },{animate:true,animation:'transition',duration:500,direction:'forward'})
    }
    
}
/****************Education-End**************/