import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-data',
  templateUrl: './history-data.component.html',
  styleUrls: ['./history-data.component.css']
})
export class HistoryDataComponent implements OnInit {

  tab: any = [
    { name: '歷史任務查詢', link: 'historyTask' },
  ]

  constructor() { }

  ngOnInit(): void {
  }



}
