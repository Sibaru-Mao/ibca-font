import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-special-chinese',
  templateUrl: './special-chinese.component.html',
  styleUrls: ['./special-chinese.component.css']
})
export class SpecialChineseComponent implements OnInit {
  @Input() id: string//0  special  1 chinese
  showTableData: any = []
  tableScrollHeight: string = ''
  tableHead: any = [
    { name: '序號' }, { name: '廠別：' },
    { name: '特殊架構' }, { name: '產品系列' },
    { name: '上傳人' }, { name: '上傳時間' },
    { name: '編輯' }
  ]
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  searchInfo = { PlantCode: this.man.Plant, Material_No: '', Project_Code: '' }
  isVisible: boolean
  modalInputTitle: any
  searchTitle: any
  modalInput: any = []
  tableKey: any

  constructor(private http: DataService, private message: NzMessageService) { }

  async ngOnInit() {
    await this.initData()
    this.isVisible = false
    // this.searchInfo.PlantCode = this.man.Plant
    this.tableScrollHeight = 0.69 * Number(sessionStorage.getItem('height')) + 'px'
    this.plant.splice(0, 1)
  }

  // async ngOnChanges(changes: SimpleChanges) {
  //   await this.initData()
  // }

  async initData() {
    switch (this.id) {
      case 'special':
        this.searchTitle = this.modalInputTitle = ['特殊架構：', '產品系列：']
        break;

      case 'chinese':
        this.searchTitle = this.modalInputTitle = ['成品中文品名：', 'Product  Name：']
        this.tableHead[2].name = '成品中文品名'
        this.tableHead[2].width = '400px'
        this.tableHead[1].name = 'Product  Name'
        break;

      case 'product':
        this.searchTitle = ['特殊架構：', '產品系列：']
        this.tableHead = [
          { name: '廠別' }, { name: '产品系列' }, { name: '特殊架構' },
          { name: '電池放置方式' }, { name: '包裝內電池數量(顆)' }, { name: '產品照片&包裝照片' },
          { name: '上傳時間' }, { name: '上傳人' }, { name: '操作' }
        ]
        this.tableKey = [
          'Plant', 'Plant', 'Special_SKU',
          'Plant', 'Plant', 'Plant',
          'Plant', 'Plant', 'Plant',
        ]

      default:
        break;
    }
    await this.search()
  }

  // 搜索方法
  async search() {
    let data = {
      PlantCode: this.searchInfo.PlantCode,
      Material_No: this.searchInfo.Material_No,
      Project_Code: this.searchInfo.Project_Code
    }

    if (this.searchInfo.Material_No.length < 1)
      data.Material_No = null
    if (this.searchInfo.Project_Code.length < 1)
      data.Project_Code = null

    switch (this.id) {
      case 'chinese':
        this.showTableData = await this.http.getChineseProduct(data)
        break;

      case 'special':
        this.showTableData = await this.http.getSpecialData(data)
        break;

      case 'product':
        this.showTableData = await this.http.productPacking(data)
        break;

      default:
        break;
    }

    // if (this.id == 'chinese')
    //   this.showTableData = await this.http.getChineseProduct(data)
    // else
    //   this.showTableData = await this.http.getSpecialData(data)

    if (this.showTableData.hasOwnProperty('error'))
      this.message.create('error', '資料查詢失敗')
    else if
      (this.showTableData.length == 0) this.message.create('warning', '查询资料为空')
    else
      this.message.create('success', '資料查詢成功')
    console.log(this.showTableData, 11111);
  }

  // 打开模态框
  showModal() {
    this.isVisible = true
  }

  // 关闭模态框
  close() {
    this.isVisible = false
    this.modalInput = []
  }

  async change() {
    if (this.id == 'special') {
      let data = { Plant: this.man.Plant, Material_No: this.modalInput[0] }
      let productLine = await this.http.getProductLine(data)
      if (productLine.length > 0)
        this.modalInput[1] = productLine[0].ModelFamily
      else this.modalInput[1] = ''
      console.log(this.modalInput)
    }
  }

  async saveData() {
    let data
    let status
    if (this.id == 'chinese') {
      data = {
        Site: this.man.Site,
        Plant: this.man.Plant,
        ProductName_ZH: this.modalInput[0],
        ProductName_EN: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addChineseName(data)
    } else {
      data = {
        Site: this.man.Site,
        Plant: this.man.Plant,
        Project_Code: this.modalInput[0],
        Material_No: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addSpecialArchitecture(data)
    }
    if (status.hasOwnProperty('error'))
      this.message.create('error', '資料保存失敗')
    else {
      this.message.create('success', '資料保存成功')
      await this.search()
      this.close()
    }
  }

  async delete(data) {
    let status
    if (this.id == 'chinese')
      status = await this.http.deleteChineseName(data)
    else
      status = await this.http.deleteSpecialArchitecture(data)

    if (status.hasOwnProperty('error'))
      this.message.create('error', '資料刪除失敗')
    else {
      this.showTableData.find((e, i) => { if (e.id == data) this.showTableData.splice(i, 1) })
      this.showTableData = JSON.parse(JSON.stringify(this.showTableData))
      this.message.create('success', '資料刪除成功')
    }
  }

}
