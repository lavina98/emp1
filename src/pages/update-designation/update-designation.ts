import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from "@angular/http";
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from "../../providers/network-service/network-service";
import { Events } from 'ionic-angular';
/**
 * Generated class for the UpdateDesignationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-designation',
  templateUrl: 'update-designation.html',
})
export class UpdateDesignationPage implements OnInit {

  http:any;
  designationarr:any[]=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
             public storage:Storage,
              http: Http,
              private network: NetworkServiceProvider,
              public alertCtrl: AlertController,
              private events:Events) {
          this.http=http;
  }

  ngOnInit(){
    this.storage.get("Hash").then((value)=>{
      let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': value
      });
    let options = new RequestOptions({ headers: headers });
      this.http.get("http://www.forehotels.com:3000/api/designation", options)
            .subscribe(data =>{
              this.designationarr=JSON.parse(data._body);
              console.log(this.designationarr);
            });
          });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateDesignationPage');
   
  }
  update(des)
  {
    if(this.network.noConnection()){
      this.network.showNetworkAlert()
  }else{
    this.storage.get('id').then((id)=>{
      console.log(id);
    let body = JSON.stringify({
          key: 'designation',
          value: des,
          id:id
          });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'e36051cb8ca82ee0Lolzippu123456*='
    });
    let options = new RequestOptions({ headers: headers });

    this.http
        .put('http://www.forehotels.com:3000/api/employee', body, options)
        .map(res => res.json())
        .subscribe(
            data => {
              this.events.publish('user:designation', des);
              
              console.log(data);
              let alert = this.alertCtrl.create({
                title: 'Designation Update',
                subTitle: 'Congratulations your designation has been updated to'+des,
                buttons: ['Dismiss']
              });
              alert.present();
            },
            err => {
              console.log("ERROR!: ", err);
              let alert = this.alertCtrl.create({
                title: 'Designation was not Update',
                subTitle: 'There was an error try again',
                buttons: ['Dismiss']
              });
              alert.present();
            }
        );
    });
    this.navCtrl.pop();
  }
  }
}
