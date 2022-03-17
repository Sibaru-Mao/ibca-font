import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {
  tab: any = [
    { name: '新申请' },
    { name: '维修品' },
    { name: '延期' },
    { name: '运输' }
  ]
  link = ['newApplication', 'repair', 'postpone', 'transport']
  searchInfo: any = {
    plantCode: '',
    Battery_PN: ''
  }
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
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
