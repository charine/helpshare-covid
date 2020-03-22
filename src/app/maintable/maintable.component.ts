import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-maintable',
  templateUrl: './maintable.component.html',
  styleUrls: ['./maintable.component.scss']
})
export class MaintableComponent implements OnInit {
  helpLog: any = [];

  constructor(private domSanitizer: DomSanitizer,) { }

  ngOnInit() {
    // โหลดข้อมูลความช่วยเหลือ
    this.loadHelpLog();
  }

  loadHelpLog(){
    let getValue = localStorage.getItem('helpLog');

    if(getValue){
      let gethelpLog = JSON.parse(getValue);

      gethelpLog.forEach(ele => {
        // image
        if(ele.images){
          ele.images = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'+ele.images);
        }
        // date
        if (ele.date_create) {
          let getdate = new Date(ele.date_create);

          ele.date_create = getdate.getDate()+" / "+getdate.getMonth()+" / "+getdate.getFullYear();
        } else {
          ele.date_create = "-";
        }

        this.helpLog.push(ele);
      });
      console.log("maintable helplog: ", this.helpLog);
    }
  }

}
