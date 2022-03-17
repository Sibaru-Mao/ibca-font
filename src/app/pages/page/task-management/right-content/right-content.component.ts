import { Router } from '@angular/router';
import { HttpService } from './../../../../services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../../services/data.service';
import { ModalService } from './../../../../services/server/modal.service';
import { Component, OnInit } from '@angular/core';

import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class RightContentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent;
  private destroy$ = new Subject();

  // listOfData: ItemData[] = []
  tableHead: Array<string> = []
  title: string
  index: number
  tableContion: any = {}
  tableData: any = []
  showTableData: any = []
  tableScrollHeight: string
  permission: any
  man: any = JSON.parse(sessionStorage.getItem('man'))
  manAllInfo: any = JSON.parse(sessionStorage.getItem('manAllInfo'))
  nowPlant: any = ''
  // handleTableata = {}////

  constructor(
    private modalService: ModalService,
    private http: DataService,
    private https: HttpService,
    private message: NzMessageService,
    private router: Router
  ) {
    // 监听左侧导航栏状态，响应搜索事件
    this.modalService.getSubject().subscribe(async res => {
      if (!res) { return }
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
  }

  async ngOnInit() {
    setTimeout(() => {
      this.nowPlant = JSON.parse(sessionStorage.getItem('nowPlant'))
      this.man.Permission = this.manAllInfo.Permission[this.nowPlant.PlantCode]
      sessionStorage.setItem('man', JSON.stringify(this.man))
      this.permission = this.man.Permission
    }, 500);


    this.tableScrollHeight = 0.66 * Number(sessionStorage.getItem('height')) + 'px'
    this.title = '獲取資料'
  }


  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.pipe(takeUntil(this.destroy$)).subscribe((data: number) => {
      // console.log('scroll index to', data);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }

  trackByIndex(_: number, data): number {
    return data.index;
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
  }

  async getConfig() {
    return await this.https.getConfig('head')
  }

  goToInfo(task, num, Transport_Mode, Task_Type?) {
    this.permission = JSON.parse(sessionStorage.getItem('man')).Permission

    if (!this.permission['HOMEPAGE' + this.index]) {
      this.message.warning('不好意思，你没有权限！！！')
      return
    }
    else if (!num || (num > 0 && (this.permission['HOMEPAGE' + this.index].Edit == 1 || this.permission['HOMEPAGE' + this.index].Delete == 1))) {
      this.router.navigate(['home/information', { task, num, index: this.index, Transport_Mode, Task_Type }])
    } else {
      if (num == 1) this.message.create('warning', '你沒有刪除權限！！！')
      if (num == 2) this.message.create('warning', '你沒有編輯權限！！！')
    }
  }

  handleShowData() {
    if (this.index)
      this.showTableData = this.tableData.filter(e => { return e.Task_Status == this.index })
  }

  async downZip(data) {
    const baseUrl = (await this.https.getConfig('config'))['zipFtp']
    window.location.href = baseUrl + `${data.Plant}_${data.Task_SN}_${data.Task_Type_Desc}.zip`
  }
}
