import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController,
              public diagnostic: Diagnostic,public toast: Toast,public storage: Storage) {               
  }


  // run(){
  //    this.diagnostic.requestExternalStorageAuthorization().then((status)=>{
  //            this.toast.show("Done>"+status+">>"+(status == this.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"), '5000', 'bottom').subscribe(
  //               toast => {
  //                 console.log(toast);
  //               });
  //           if(status == "GRANTED"){              
  //             this.storage.set("status",status)
  //              this.toast.show("Storage Set>"+status, '5000', 'bottom').subscribe(
  //               toast => {
  //                 console.log(toast);
  //               });               
  //           }else{
  //             this.storage.set("status","None") 
  //             this.toast.show("Else Storage Set>"+status, '5000', 'bottom').subscribe(
  //               toast => {
  //                 console.log(toast);
  //               });
  //             }           
  //          }).catch((e)=>{
  //           this.toast.show(e, '5000', 'bottom').subscribe(
  //               toast => {
  //                 console.log(toast);
  //               });
  //       }); 
            
  // }
    goToLogin(){
      this.navCtrl.push(LoginPage);
    }
    goToVerify(){
      this.navCtrl.push(RegisterPage);
    }
}
