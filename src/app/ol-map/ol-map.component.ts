import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import Geolocation from 'ol/Geolocation';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import * as proj from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {toLonLat} from 'ol/proj';
import TileJSON from 'ol/source/TileJSON';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit {
  map: any;
  view: any;
  position: any;
  user: SocialUser;
  loggedIn: boolean = false;
  btnShare: boolean = false;
  helpLog: any = [];

  constructor(private authService:AuthService,
    private router:Router,
    private domSanitizer: DomSanitizer,
    private api: ApiService) { }

  ngOnInit() {
    // สร้าง map ก่อนให้ point ที่ประเทศไทย
    this.initilizeMap();
    // ดึงข้อมูลความช่วยเหลือ
    this.loadHelpLog();
    // mark จุดที่ต้องการ/ให้ความช่วยเหลือบนแผน
    this.initilizeHelpLog();
    // check user login
    this.checkStatusLogin();
  }

  chackStatusUserlogIn(type) {
    console.log("type: ",type);
    
    this.authService.authState.subscribe((user) => {
      console.log("get user: ",user);
      this.user = user;
      this.loggedIn = (user != null);
      let setUser;
      
      if(this.user){
        if (this.user.provider == "FACEBOOK") {
          console.log("Login Facebook.");
          setUser = {
            "first_name": this.user.facebook.first_name,
            "last_name": this.user.facebook.last_name,
            "fb_id": this.user.facebook.id,
            "email": this.user.facebook.email,
            "picture": this.user.facebook.picture,
            "provider": this.user.provider
          };
        }else{
          console.log("Login Google.");
          setUser = {
            "first_name": this.user.firstName,
            "last_name": this.user.lastName,
            "gg_id": this.user.id,
            "email": this.user.email,
            "picture": this.user.photoUrl,
            "provider": this.user.provider
          };
        }

        // เก็บข้อมูลลงบน localstorage
        localStorage.setItem('loggedIn', JSON.stringify(this.loggedIn));
        localStorage.setItem('userProfile', JSON.stringify(setUser));
        // ปิด popup ฟลังทำงานเสร็จ
        $('#modalContent').modal('hide');
      }
      this.btnShare = true;
    });
  } 

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

    this.chackStatusUserlogIn('facebook');
  } 

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.chackStatusUserlogIn('google');
  } 
 
  signOut(): void {
    // this.authService.signOut;
    // ลบข้อมูลออกจาก localstorage
    this.loggedIn = false;
    this.btnShare = false;
    localStorage.setItem('loggedIn', JSON.stringify(this.loggedIn));
    localStorage.setItem('userProfile', '');
    
    this.authService.signOut().then(res=>{
      console.log("signOut: ", res);
      
    });

    console.log("logout!!!");
  }

  checkStatusLogin(){
    let  checkLogin = JSON.parse(localStorage.getItem('loggedIn'));
    console.log("checkLogin: ", JSON.parse(checkLogin));
    
    if (checkLogin) {
      this.btnShare = true;
    } else {
      this.btnShare = false;
    }
  }

  loadHelpLog(){
    let getValue = localStorage.getItem('helpLog');

    if(getValue){
      let gethelpLog = JSON.parse(getValue);

      gethelpLog.forEach(ele => {
        this.helpLog.push(ele);
      });
      console.log("helplog: ", this.helpLog);
    }
  }

  initilizeMap(){
    this.view = new View({
      center: proj.fromLonLat([100.4930264, 13.7245601]),
      zoom: 10
    });

    this.map = new Map({
      target: 'map',
      view: this.view,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ]
    });
    
    var geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: this.view.getProjection()
    });

    // เปิดตัว tracking
    geolocation.setTracking(true);

    var accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', function() {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    // var positionFeature = new Feature();
    // positionFeature.setStyle(new Style({
    //   image: new CircleStyle({
    //     radius: 6,
    //     fill: new Fill({
    //       color: '#3399CC'
    //     }),
    //     stroke: new Stroke({
    //       color: '#000',
    //       width: 2
    //     })
    //   })
    // }));

    // เช็คตำแหน่งมีการเปลี่ยนแปลง
    geolocation.on('change:position', ()=> {
      var coordinates = geolocation.getPosition();

      // เปลี่ยน center ไปตามตำแหน่งที่ได้
      // setTimeout(() => {
      //   this.view.animate({
      //     center: coordinates,
      //     duration: 5000,
      //     zoom: 9
      //   });
      // }, 3000);
      
      // positionFeature.setGeometry(coordinates ?
      //   new Point(coordinates) : null);
    });

    // new VectorLayer({
    //   map: this.map,
    //   source: new VectorSource({
    //     features: [accuracyFeature, positionFeature]
    //   })
    // });

  }

  initilizeHelpLog(){
    var iconFeatures = [];
    var element = document.getElementById('popup');
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    // รูปแบบ icon
    var iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'http://maps.google.com/mapfiles/ms/micons/blue.png'
      })
    });

    // รูปแบบ popup
    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(overlay);
    
    // เพิ่ม markers บนแผนที่
    this.helpLog.forEach(coor => {

      if(coor.lng && coor.lat){
        var iconFeature = new Feature({
          geometry: new Point(proj.fromLonLat([coor.lng, coor.lat])),
          title: coor.title,
          category: coor.cat_name,
          detail: coor.detail,
          create: coor.date_create,
          population: 4000,
          rainfall: 500
        })

        // ใส่ icon style ให้ markers
        iconFeature.setStyle(iconStyle);
        // รวม markers ที่ใส่ icon แล้ว
        iconFeatures.push(iconFeature);
      }
    });
    
    var vectorSource = new VectorSource({
      features: iconFeatures
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });
    
    // รูปแบบแผนที่
    // var rasterLayer = new TileLayer({
    //   source: new TileJSON({
    //     url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json',
    //     crossOrigin: ''
    //   })
    // });

    // เพิ่ม markers ลงบนแผนที่
    this.map.addLayer(vectorLayer);
    
    // var popup = new Overlay({
    //   element: element,
    //   positioning: 'bottom-center',
    //   stopEvent: false,
    //   offset: [0, -50]
    // });
    // this.map.addOverlay(popup);
    
    // display popup on click
    this.map.on('click', (evt)=> {
      var feature = evt.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();

        // -- ลองใส่รูปแล้วไม่ได้ --
        // let images = "";
        // if (feature.get('images')) {
        //   let setimg = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'+feature.get('images'));
        //   images = '<img class="card-img-top" src="'+setimg+'">';
        // }

        let getDate = new Date(feature.get('create'));
        console.log("getDate: ",feature.get('create'));
        
        let date;
        if (feature.get('create')) {
          date = getDate.getDate()+" / "+ getDate.getMonth()+" / "+getDate.getFullYear();
        }else{
          date = "-";
        }
         
        let setContent = '<div>'+
              '<small><p class="card-subtitle mb-2 text-muted">ประเภท: '+feature.get('category')+'</p></small>'+
              '<h5 class="card-title">'+feature.get('title')+'</h5>'+
              '<p class="card-text text-details">'+feature.get('detail')+'</p>'+
              '<small><p class="card-subtitle mb-2 text-muted">สร้างเมื่อ: '+date+'</p></small>'+
          '</div>';

        content.innerHTML = setContent;
        overlay.setPosition(coordinates);
      }
    });
    
    // change mouse cursor when over marker
    this.map.on('pointermove', (e)=> {
      if (e.dragging) {
        $(element).popover('destroy');
        return;
      }
      var pixel = this.map.getEventPixel(e.originalEvent);
      var hit = this.map.hasFeatureAtPixel(pixel);
      // this.map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    // ปุ่มกดปิด popup
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
  }
  
}
