import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-center',
  templateUrl: './data-center.component.html',
  styleUrls: ['./data-center.component.css']
})
export class DataCenterComponent implements OnInit {
  tab: any = [
    { name: '電池信息' },
    { name: '產品包裝信息' },
    { name: '跌落報告' },
    { name: '基礎設定' },
    { name: '特殊架構' },
    { name: '中文品名' }
  ]

  link = ['batteryInfo', 'productPacking', 'dropReport',
    'basicSetting', 'specialArchitecture', 'chineseName']

  searchInfo: any = {
    plantCode: '',
    Battery_PN: ''
  }

  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  batteryPN: any = [{ name: '11', code: 1 }]
  index: number

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.tab.forEach((e, i) => { e.link = this.link[i] })
  }

  selectTab(item) {
    this.tab.forEach((e) => { e.status = false })
    item.status = true
    this.router.navigate([item.link])
  }

  getIndex(data) {
    this.index = data
  }
}
