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
    this.loadHelpLog();
  }

  loadHelpLog(){
    let getValue = localStorage.getItem('helpLog');

    if(getValue){
      let gethelpLog = JSON.parse(getValue);

      gethelpLog.forEach(ele => {
        if(ele.images){
          ele.images = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'+ele.images);
        }

        this.helpLog.push(ele);
      });
      console.log("maintable helplog: ", this.helpLog);
    }
  }

}
