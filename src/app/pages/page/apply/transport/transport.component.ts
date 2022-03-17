import { ListComponent } from './../../../component/list/list.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationRepairComponent } from 'src/app/pages/component/application-repair/application-repair.component';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {
  @ViewChild('list') list: ListComponent
  @ViewChild('appRe') appRe: ApplicationRepairComponent
  show: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  sendData(data) {
    this.list.getData(data)
  }

  back() {
    this.appRe.initData()
  }

}
