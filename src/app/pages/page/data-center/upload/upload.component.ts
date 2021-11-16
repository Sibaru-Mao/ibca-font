import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  showTableData: any = []
  tableScrollHeight: string = '400px'
  tableHead: any = [
    { name: '序號' }, { name: '廠別' }, { name: '任務編碼' }, { name: '項次' }, { name: '產品系列' },
    { name: '特殊架構' }, { name: '電池料號' }, { name: '電池型號' }, { name: '需求年份' }, { name: '出貨賬冊' },
    { name: '運輸方式' }, { name: '委託單號' }, { name: '鑑定書編號' }, { name: '操作' }
  ]
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  year: any = JSON.parse(sessionStorage.getItem('year'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  transportWay: any = [
    { label: '空運', value: 1, disabled: false, checked: false },
    { label: '海運', value: 2, disabled: false, checked: false },
    { label: '公路', value: 3, disabled: false, checked: false },
    { label: '鐵路', value: 4, disabled: false, checked: false }
  ]
  searchTitle: any = [
    { name: '產品系列：', data: null },
    { name: '電池料號：', data: null },
    { name: '電池型號：', data: null },
    { name: '任務編碼：', data: null }
  ]
  searchTitleOne: any = [
    { name: '委託單號：', data: null },
    { name: '鑑定書編碼：', data: null }
  ]
  searchInfo = {
    "Plant": this.man.Plant,
    "Demand_Year": new Date().getFullYear(),
  }
  isVisible: boolean
  isEdit: boolean
  isUpdate: boolean
  modalInputTitle: any
  modalInput: any = []
  tableKey: any
  id
  bodyStyle = {
    'background-color': 'rgba(32, 48, 51, 100)',
    'height': '200px',
    'padding': '0px'
  }

  editStyle = {
    'position': 'absolute',
    'background-color': 'rgb(32, 48, 51)',
    'height': '420px',
    'width': '100%',
    'padding': '0',
    'transform': 'translate(0, -24px)'
  }





  constructor(private http: DataService, private message: NzMessageService) { }

  async ngOnInit() {
    // await this.initData()
    this.isVisible = false
    this.plant.splice(0, 1)
    this.year.splice(0, 1)
    this.search()
  }

  // async initData() {
  //   switch (this.id) {
  //     case 'special':
  //       this.searchTitle = this.modalInputTitle = ['特殊架構：', '產品系列：']
  //       break;

  //     case 'chinese':
  //       this.searchTitle = this.modalInputTitle = ['成品中文品名：', 'Product  Name：']
  //       this.tableHead[2].name = '成品中文品名'
  //       this.tableHead[2].width = '400px'
  //       this.tableHead[1].name = 'Product  Name'
  //       break;

  //     case 'product':
  //       this.searchTitle = ['特殊架構：', '產品系列：']
  //       this.tableHead = [
  //         { name: '廠別' }, { name: '产品系列' }, { name: '特殊架構' },
  //         { name: '電池放置方式' }, { name: '包裝內電池數量(顆)' }, { name: '產品照片&包裝照片' },
  //         { name: '上傳時間' }, { name: '上傳人' }, { name: '操作', width: '100px' }
  //       ]
  //       this.tableKey = [
  //         'Plant', 'Project_Code', 'Special_SKU',
  //         'Placement_Mode', 'Packages_Qty', '查看',
  //         'Maintain_Time ', 'User_ID',
  //       ]

  //     default:
  //       break;
  //   }
  // await this.search()
  // }

  // 搜索方法
  async search() {
    let data = {
      Plant: this.searchInfo.Plant,
      Demand_Year: JSON.stringify(this.searchInfo.Demand_Year),
      Project_Code: this.handleData(this.searchTitle[0]['data']),
      Battery_PN: this.handleData(this.searchTitle[1]['data']),
      Battery_Mo: this.handleData(null),
      Task_SN: this.handleData(this.searchTitle[3]['data']),
      Entrust_No: this.handleData(this.searchTitleOne[0]['data']),
      Testimonials_SN: this.handleData(this.searchTitleOne[1]['data'])
    }
    this.showTableData = await this.http.searchFilter(data)
    console.log(this.showTableData);

  }

  // 打开模态框
  showModal() {
    this.isVisible = true
  }

  // 关闭模态框
  close() {
    this.isVisible = false
    this.isEdit = false
    this.isUpdate = false
    this.modalInput = []
  }

  upData() {
    this.isVisible = false
    this.isUpdate = true
  }

  editData() {
    this.isVisible = false
    this.isEdit = true
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

  handleData(data) {
    if (data) return data
    else return 'null'
  }
}
