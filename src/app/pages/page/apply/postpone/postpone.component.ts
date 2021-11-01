import { ListComponent } from './../../../component/list/list.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-postpone',
  templateUrl: './postpone.component.html',
  styleUrls: ['./postpone.component.css']
})
export class PostponeComponent implements OnInit {
  @ViewChild('list') list: ListComponent
  show: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

  sendData(data) {
    this.list.getData(data)
  }

}
