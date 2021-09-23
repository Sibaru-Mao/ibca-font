import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../../services/data.service';
import { ModalService } from './../../../../services/server/modal.service';
import { Component, OnInit } from '@angular/core';

interface ItemData {
  name: string;
  age: number;
  address: string;
  num: string
  a1: string
  acl: string
}

@Component({
  selector: 'app-right-content',
  templateUrl: './right-content.component.html',
  styleUrls: ['./right-content.component.css']
})
export class RightContentComponent implements OnInit {
  listOfData: ItemData[] = []
  tableHead: Array<string> = []
  title: string
  index: number
  tableContion: any = {}
  tableData: any = []
  showTableData: any = []
  tableScrollHeight: string
  permission: any

  constructor(
    private modalService: ModalService,
    private http: DataService,
    private https: HttpService,
    private message: NzMessageService,
    private router: Router
  ) {
    // 监听左侧导航栏状态，响应搜索事件
    this.modalService.getSubject().subscribe(async res => {
      if (!res) { console.log('rightContentModalService', res); return }
      if (res.type == 'navigation') {
        this.title = res.data.title
        this.index = res.data.index
        this.initTableHead(res.data.index)
        this.handleShowData()
      }
      if (res.type == 'tableContion') {
        this.tableContion = res.data
        await this.getTableData()
        this.handleShowData()
      }
      // this.handleShowData()
    })
  }

  async ngOnInit() {
    this.tableScrollHeight = 0.66 * Number(sessionStorage.getItem('height')) + 'px'
    this.title = '獲取資料'
    // 获取权限数据
    this.permission = JSON.parse(sessionStorage.getItem('man')).Permission
    console.log(this.permission);
  }

  // 根据左侧导航栏加载右侧表头的栏位
  async initTableHead(index: number) {
    let allHead = await this.getConfig()
    switch (index) {
      case 1:
        this.tableHead = allHead[0]
        break;

      case 2:
        this.tableHead = allHead[1]
        break;

      case 3:
        this.tableHead = allHead[2]
        break;

      case 4:
        this.tableHead = allHead[3]
        break;

      case 5:
        this.tableHead = allHead[4]
        break;

      case 6:
        this.tableHead = allHead[5]
        break;

      default:
        break;
    }
  }

  dataClone(data) {
    return JSON.parse(JSON.stringify(data))
  }

  // 获取table资料
  async getTableData() {
    this.tableData = await this.http.getTableData(this.tableContion)
    console.log(this.tableData);
    // if (!this.tableData.hasOwnProperty('error')) {
    //   if (this.tableData.length > 0) this.message.create('success', '資料請求成功')
    //   else this.message.create('warning', '暫無資料')
    // }
    // else this.message.create('error', '資料請求失敗')
  }

  async getConfig() {
    return await this.https.getConfig('head')
  }

  goToInfo(task, num, Transport_Mode) {
    if (!num || (num > 0 && (this.permission['HOMEPAGE' + this.index].Edit == 1 || this.permission['HOMEPAGE' + this.index].Delete == 1))) {
      this.router.navigate(['home/information', { task, num, index: this.index, Transport_Mode }])
    } else {
      if (num == 1) this.message.create('warning', '你沒有刪除權限')
      if (num == 2) this.message.create('warning', '你沒有編輯權限')
    }
  }

  handleShowData() {
    if (this.index) this.showTableData = this.tableData.filter(e => { return e.Task_Status == this.index })
  }
}
