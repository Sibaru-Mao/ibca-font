import { ListComponent } from './../../../component/list/list.component';
import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {
  @ViewChild('list') list: ListComponent

  constructor() { }

  ngOnInit(): void {
  }

  sendData(data) {
    this.list.getData(data)
  }
}
