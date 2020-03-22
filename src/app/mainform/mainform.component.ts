import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAIN_CATEGORY } from '../services/config';
import Geolocation from 'ol/Geolocation';

@Component({
  selector: 'app-mainform',
  templateUrl: './mainform.component.html',
  styleUrls: ['./mainform.component.scss']
})
export class MainformComponent implements OnInit {
  addForm: FormGroup;
  invalid: boolean = false;
  userProfile: any =[];
  locations: any =[];
  imageData: any;
  imagePath: any;
  errFile: boolean = false;
  helpLog: any = [];
  category: any = MAIN_CATEGORY;
  today: any;

  constructor(private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private api: ApiService) { }

  ngOnInit() {
    this.today = new Date();
    // ดึงข้อมูล locations
    this.loadUserLocations();
    // ดึงข้อมูล user
    this.getUserProfile();
    // ดึงข้อมูลความช่วยเหลือ
    this.loadHelpLog();

    this.addForm = this.formBuilder.group({
      category: [1, Validators.required],
      title: ['ทดสอบให้ความช่วยเหลือ', Validators.required],
      detail: ['ทดสอบให้ความช่วยเหลือ', Validators.required]
    });
  }

  loadHelpLog(){
    let getValue = localStorage.getItem('helpLog');
    // console.log("getValue: ",getValue);

    if(getValue){
      let gethelpLog = JSON.parse(getValue);
      console.log("gethelpLog: ", gethelpLog);

      gethelpLog.forEach(ele => {
        this.helpLog.push(ele);
      });
      console.log("helplog: ", this.helpLog);
    }
  }

  // สามารถเข้าถึงฟังก์ชันได้ในหน้า html โดยที่ไม่ต้องใช้ event เพื่อเรียกใช้งาน (เช่น onclick เป็นต้น)
  // อันนี้เอามาใช้ในการเช็ค error กรณียังไม่ได้กรอกข้อมูล ถ้ากด summit form ไปแล้ว
  get f() {
    return this.addForm.controls; 
  }

  getUserProfile(){
    this.userProfile.push(JSON.parse(localStorage.getItem('userProfile')));
    console.log("userProfile: ", this.userProfile);
  }

  onSubmit(formdata) {
    console.log("formdata: ",formdata);
    console.log("userProfile: ", this.userProfile);
    console.log("locations: ", this.locations);
    
    if (this.addForm.invalid) {
      console.log("invalid");
      this.invalid = true;
    }else{
      this.invalid = false;
      let cat_id, cat_name, social_id;

      // get category id & name.
      this.category.forEach(ele=>{
        if (ele.cat_id == formdata.category) {
          cat_id = ele.cat_id;
          cat_name = ele.cat_name;
        }
      })

      // ถ้าโหลด locations ไม่ได้ ให้โหลดอีกรอบ
      if (this.locations.length == 0) {
        console.log("load again!");
        this.loadUserLocations();
      }

      // ตรวจสอบ social ที่เข้าใช้งาน
      if(this.userProfile[0].provider == "GOOGLE"){
        social_id = this.userProfile[0].gg_id;
      }else{
        social_id = this.userProfile[0].fb_id;
      }

      let preparingData = {
        "cat_id": cat_id,
        "cat_name": cat_name,
        "title":formdata.title,
        "detail":formdata.detail,
        "images": this.imageData,
        "lat": this.locations[1], //lat
        "lng": this.locations[0], //long
        "email": this.userProfile[0].email,
        "first_name": this.userProfile[0].first_name,
        "last_name": this.userProfile[0].last_name,
        "social_id": social_id,
        "provider": this.userProfile[0].provider,
        "date_create": this.today.getTime()
      };

      // push เพิ่มเข้าไป
      this.helpLog.push(preparingData);
      // บันทึกลง localStorage
      localStorage.setItem('helpLog', JSON.stringify(this.helpLog));
      // ให้เป็นค่าว่างเพื่อรับค่าใหม่
      this.helpLog = [];

      console.log("preparingData: ", preparingData);
      this.api.alertSuccess('บันทึกข้อมูลสำเร็จ', ['/map']);
      this.loadHelpLog();
    }
  }

  picked(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.handleInputChange(file); //turn into base64
    }
  }
  handleInputChange(files) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.errFile = true;
      // alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.imageData = base64result;
    this.imagePath = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'+this.imageData);
  }

  loadUserLocations(){
    var geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true
      }
    });

    // เปิดตัว tracking
    geolocation.setTracking(true);

    // เช็คตำแหน่งมีการเปลี่ยนแปลง
    geolocation.on('change:position', ()=> {
      var coordinates = geolocation.getPosition(); // lng, lat
      this.locations = geolocation.getPosition();
      console.log("coordinates: ",coordinates);
    });
  }
}
