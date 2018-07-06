import { ViewChild ,Component } from '@angular/core';
import { NavController, NavParams, Slides, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  @ViewChild("tourSlide") slider: Slides;
  slides:any;
  isFirstPage = true;
  currentIndex:any =0;
  isLastPage = false;
  splash = true;
  constructor(public storage: Storage,
              public menu: MenuController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private ga: GoogleAnalytics,) {

          this.storage.get('user').then((id) =>{
          this.ga.trackEvent("Intro Page", "Opened", "", id.id)
          this.ga.trackView("Intro Page")
        });
      this.menu = menu;
     this.menu.enable(false, 'myMenu')
      this.slides = [
    {
      title: "Get Noticed",
      description: "Increase your chances of being <b>noticed</b> by your dream <b>Hotels</b>.",
      image: "assets/img/noticed.jpg",
    },

    {
      title: "International Placement",
      description: "If you want to apply for <b>International Placement</b> we are here to help you.",
      image: "assets/img/international.jpg",
    },
    {
      title: "Catering Leads",
      description: "Search and apply for <b>freelance catering jobs</b> online in your near by area..",
      image: "assets/img/catering.jpg",
    }
  ];
  }
 ionViewDidLoad() {    
    setTimeout(() => {
      this.splash = false;
    }, 5000);
  }
  onSlideChangeStart() {    
    this.currentIndex = this.slider.getActiveIndex();
    console.log("Index"+this.currentIndex)
  }
  moveNext() {
    this.slider.slideNext();
  }
  moveBack() {
    this.slider.slidePrev();
  }
  goToHome(){
    this.navCtrl.push(HomePage)
  }
}