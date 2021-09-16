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
  baseHead: any
  allHead: any
  tableHead: Array<string> = []
  title: string
  index: number
  tableContion: any = {}
  tableData: any = []
  showTableData: any = []
  tableScrollHeight: string

  constructor(
    private modalService: ModalService,
    private http: DataService,
    private https: HttpService,
    private message: NzMessageService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.tableScrollHeight = 0.66 * Number(sessionStorage.getItem('height')) + 'px'
    this.baseHead = await this.getConfig()
    this.allHead = JSON.parse(JSON.stringify(this.baseHead))
    this.title = '獲取資料'
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
    })
    // await this.getTableData()
  }

  // 根据左侧导航栏加载右侧表头的栏位
  initTableHead(index: number) {
    switch (index) {
      case 1:
        this.tableHead = this.allHead[0]
        break;

      case 2:
        this.tableHead = this.allHead[1]
        break;

      case 3:
        this.tableHead = this.allHead[2]
        break;

      case 4:
        this.tableHead = this.allHead[3]
        break;

      case 5:
        this.tableHead = this.allHead[4]
        break;

      case 6:
        this.tableHead = this.allHead[5]
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
    // if (!this.tableData.hasOwnProperty('error')) {
    //   if (this.tableData.length > 0) this.message.create('success', '資料請求成功')
    //   else this.message.create('warning', '暫無資料')
    // }
    // else this.message.create('error', '資料請求失敗')
  }

  async getConfig() {
    return await this.https.getConfig('head')
  }

  goToInfo(task, num) {
    this.router.navigate(['home/information', { task, num }])
  }

  handleShowData() {
    if (this.index) this.showTableData = this.tableData.filter(e => { return e.Task_Status == this.index })
  }

}
