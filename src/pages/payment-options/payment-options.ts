import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics'
import { Toast } from '@ionic-native/toast'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
/*
  Generated class for the PaymentOptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment-options',
  templateUrl: 'payment-options.html'
})
export class PaymentOptionsPage {
data: Array<{title:any,img : any, img1: any,img2:any,icon:string,text1:any,text2:any,text3:any,img_wallet:any,img_select:any,type:any,mode:string}> = [];
  http:any;
  hash:any;
  user:any;
  paid:boolean;
  constructor(private loadCtrl: LoadingController, 
              public navCtrl: NavController, 
              http: Http, 
              public network: NetworkServiceProvider,
              private storage: Storage, 
              public platform: Platform,
              private toast: Toast,
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics,
              private iab: InAppBrowser,
              private tst:ToastController) {
        this.http = http;
        this.storage.get('Hash').then((hash) => {
          this.hash = hash;
        });
        this.storage.get('user').then((id) =>{
              this.user = id;
              this.platform.ready().then(() => {
              this.ga.trackEvent("International Placement Payment", "Opened", "New Session Started", id, true)
              this.ga.setAllowIDFACollection(true)
              this.ga.setUserId(id)
              this.ga.trackView("IP Payment")
            });
        })
      this.paid = false
      this.data.push({
         title:"",
         img: "assets/img/paytm.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"",
         text2:"",
         text3:"",
         type:"paytm",
         mode:"PAYTM"
        });
      this.data.push({
         title:"",
         img: "assets/img/visa.png",
         img1: "assets/img/mastercard.png",
         img2: "assets/img/rupay.png",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"",
         text2:"",
         text3:"",
         type:"instamojo",
         mode:"Visa/Mastercard/Rupay"
        });
      this.data.push({
         title:"",
         img: "assets/img/amex.png",
         img1: "assets/img/diner.png",
         img2: "assets/img/discover.png",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"",
         text2:"",
         text3:"",
         type:"paytm",
         mode:"Amex/Diner/Discover"
        });
        this.data.push({
         title:"",
         img: "assets/img/jio.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"assets/img/wallet.png",
         img_select:"assets/img/select_jio_money.png",
         text1:"To Pay via JioMoney Wallet<br><br>1.Select Wallets",
         text2:"2.Select Jio Money",
         text3:"3.Click on Checkout",
         type:"instamojo",
         mode:"JioMoney"
        });
        this.data.push({
         title:"",
         img: "assets/img/freecharge.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"assets/img/wallet.png",
         img_select:"assets/img/select_freecharge.png",
         text1:"To Pay via Freecharge<br><br>1.Select Wallets",
         text2:"2.Select freecharge",
         text3:"3.Click on Checkout",
         type:"instamojo",
         mode:"Freecharge"
        });   
        this.data.push({
         title:"",
         img: "assets/img/mobikwik.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"assets/img/wallet.png",
         img_select:"assets/img/select_mobikwik.png",
         text1:"To Pay via Mobikwik Wallet<br><br>1.Select Wallets",
         text2:"2.Select Mobikwik",
         text3:"3.Click on Checkout",
         type:"instamojo",
         mode:"Mobikwik"
        });
        this.data.push({
         title:"",
         img: "assets/img/payu.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"",
         text2:"",
         text3:"",
         type:"payu",
         mode:"PayUMoney"
        });
        this.data.push({
         title:"",
         img: "assets/img/ola.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"assets/img/wallet.png",
         img_select:"assets/img/select_olamoney.png",
         text1:"To Pay via OlaMoney Wallet<br><br>1.Select Wallets",
         text2:"2.Select Ola Money",
         text3:"3.Click on Checkout",
         type:"instamojo",
         mode:"Olamoney"
        });
        this.data.push({
         title:"",
         img: "assets/img/netbanking.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"",
         text2:"",
         text3:"",
         type:"paytm",
         mode:"Net Banking"
        });
        this.data.push({
         title:"",
         img: "assets/img/upi.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"assets/img/vpa.png",
         img_select:"assets/img/enter_vpa.png",
         text1:"To Pay via UPI<br>1.Select UPI",
         text2:"2.Enter Your VPA",
         text3:"3.Click Proceed",
         type:"payu",
         mode:"UPI"
        });
        this.data.push({
         title:"Cheque",
         img: "assets/img/cheque.png",
         img1: "",
         img2: "",
         icon: 'ios-arrow-down-outline',
         img_wallet:"",
         img_select:"",
         text1:"<br>Kindly Draw the cheque in favour of <br><b>Parashar Hospitality Solutions Pvt. Ltd.</b><br> and send it to the following address:-",
         text2:"<br>8th Floor, Sardar Patel Institute of Technology, Bhavans Campus, Dadabhai Nagar Road, Munshi Nagar, Andheri West.",
         text3:"",
         type:"",
         mode:"Cheque"
        });

    }

  toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-arrow-down-outline';
    } else {
        data.showDetails = true;
        data.icon = 'ios-arrow-up-outline';
    }
  }
  paymentOption(data){
   if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
     let alert = this.alertCtrl.create({
                title: 'Confirm Placement Request',
                message: 'You will be redirected to Payment Gateway',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'Proceed to Payment',
                    handler: () => {
                      let body = JSON.stringify({
                        emp_id: this.user.id,
                        type: data.mode
                      });
                      let headers = new Headers({
                      'Content-Type': 'application/json',
                      'Authorization': this.hash
                    });
                    let options = new RequestOptions({ headers: headers });
                        this.http
                        .post('http://forehotels.com:3000/api/ip', body, options)
                        .map(res => res.json())
                        .subscribe(
                            data => {
                            },
                            err => {
                              console.log("ERROR!: ", err);
                            }
                        );

                          if((data.type == 'paytm') || (data.type == 'payu') || (data.type == 'instamojo')){
                            let loading = this.loadCtrl.create({
                            spinner: 'dots',
                            content: 'Connecting to Payment Gateway. Kindly Wait...'
                          });

                          loading.present();
                            this.goToPay(loading, data.type);
                          }
                    }
                  }
                ]
              });
              alert.present();
    }
  }

  goToPay(loading, gateway){
    if(this.network.noConnection()){
      let t=this.tst.create(
        {
           message:'2',
           duration:3000
        }
      )
      t.present();
        this.network.showNetworkAlert()
    }
      else{
        console.log('3');
        loading.dismiss();
        if(gateway == 'paytm'){
          var options = {
            user_id: this.user.id,
            purpose: "NTK4206",
            amount: "1500",
            mode: "paytm"
          };
        }
        if(gateway == 'payu'){
          options = {
            user_id: this.user.id,
            purpose: "NTK4206",
            amount: "1500",
            mode: "payu"
          };
        }
        if(gateway == 'instamojo'){
          options = {
            user_id: this.user.id,
            purpose: "NTK4206",
            amount: "1500",
            mode: "instamojo"
          };
        }
        let formHtml:string = '';
        for(let key in options){
          let value = options[key];
          formHtml+='<input type="hidden" id="'+key+'" name="'+key+'" value="'+value+'" />';
        }
        let url = "https://www.forehotels.com/payment"
        let payScript = "var form = document.getElementById('ts-app-payment-form-redirect');";
        payScript += "form.innerHTML = '" + formHtml + "';";
        payScript += "form.action = '" + url + "';";
        payScript += "form.method = 'POST';" ;
        payScript += "setTimeout(function(){ form.submit(); }, 4000);" ;

        let browser = this.iab.create('redirect.html', '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");
              browser.on('loadstart')
                         .subscribe(
                            event => {
                              let split = event.url.split('/')
                              if(split[3] == 'home'){
                                this.paid = true
                                browser.close();
                              }
                            },
                            err => {
                              console.log("InAppBrowser Loadstop Event Error: " + err);
                            });
              browser.on('loadstop')
                         .subscribe(
                            event => {
                              browser.executeScript({
                                code:payScript
                              });
                              browser.show();
                              this.navCtrl.pop()
                            },
                            err => {
                            });
              browser.on('exit')
                         .subscribe(
                            event => {
                              if(this.paid == false){
                                let alert = this.alertCtrl.create({
                                title: 'Transaction Unsuccessful',
                                subTitle: 'For some Reason, the payment could not be processed.',
                                buttons: ['Retry']
                                });
                                alert.present();
                              }
                            },
                            err => {
                              console.log("InAppBrowser Loadstop Event Error: " + err);
                            });
      }
    }
}