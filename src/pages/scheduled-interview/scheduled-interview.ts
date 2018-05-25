import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Toast } from '@ionic-native/toast'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

declare var google:any;
@Component({
  selector: 'page-scheduled-interview',
  templateUrl: 'scheduled-interview.html'
})
export class ScheduledInterviewPage {
  map:any
  lat:number
  lng:number
  markers = [];
  address:any
  user_lat:any
  user_lng:any

constructor(public storage: Storage,
                private navParams: NavParams, 
                public navCtrl: NavController, 
                public platform: Platform,
                private network: NetworkServiceProvider,
                private ga: GoogleAnalytics,
                private toast: Toast,) {
              let latlong = this.navParams.get('location')
              this.address = this.navParams.get('address')
              let latlongarray = latlong.split(",")
              this.lat = parseFloat(latlongarray[0]);
              this.lng = parseFloat(latlongarray[1]); 
              this.user_lat = this.navParams.get('user_lat')
              this.user_lng = this.navParams.get('user_lng')   
              
              this.storage.get('id').then((id) => {
              this.platform.ready().then(() => {
                  this.ga.trackEvent("Scheduled Interview Page", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Scheduled Interview")
                });
              })
    }

ngOnInit() {
        this.initMap();
   }

private initMap() {
        if(this.network.noConnection()){
              this.network.showNetworkAlert()
          }else{
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var point = {lat: this.lat, lng: this.lng}; 
            let divMap = (<HTMLInputElement>document.getElementById('map'));
            this.map = new google.maps.Map(divMap, {
                center: point,
                zoom: 15,
                disableDefaultUI: true,
                //draggable: false,
                zoomControl: true,
                scrollwheel: false,
                gestureHandling: 'cooperative'
            });
              directionsDisplay.setMap(this.map);
              this.calculateAndDisplayRoute(directionsService, directionsDisplay);
      }  
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay) {          
          var waypts = [];  
          directionsService.route({      
          origin: {lat: this.user_lat, lng: this.user_lng},
          destination: {lat: this.lat, lng :this.lng},
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            } else {            
          }
        });
    }
} 