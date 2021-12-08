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
  tableScrollHeight: string = '390px'
  tableHead: any = [
    { name: '序號' }, { name: '廠別' }, { name: '任務編碼' }, { name: '項次' }, { name: '產品系列' },
    { name: '特殊架構' }, { name: '電池料號' }, { name: '電池型號' }, { name: '需求年份' }, { name: '出貨賬冊' },
    { name: '運輸方式' }, { name: '委託單號' }, { name: '鑑定書編號' }, { name: '操作' }
  ]
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  year: any = JSON.parse(sessionStorage.getItem('year'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  transport = 1
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
  editInfo: any = {}
  code: any = { status: 0 }
  filePdf
  loading: boolean
  isVisible: boolean
  isEdit: boolean
  isUpdate: boolean

  Shipment_Books_List = ["生產賬冊", "維修賬冊"]
  // modalInputTitle: any
  // modalInput: any = []
  // tableKey: any
  // id

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

  // 搜索方法
  async search() {
    let data = {
      Plant: this.searchInfo.Plant,
      Demand_Year: typeof this.searchInfo.Demand_Year == 'string' ? this.searchInfo.Demand_Year : JSON.stringify(this.searchInfo.Demand_Year),
      Project_Code: this.handleData(this.searchTitle[0]['data']),
      Battery_PN: this.handleData(this.searchTitle[1]['data']),
      Battery_Mo: this.handleData(null),
      Task_SN: this.handleData(this.searchTitle[3]['data']),
      Entrust_No: this.handleData(this.searchTitleOne[0]['data']),
      Testimonials_SN: this.handleData(this.searchTitleOne[1]['data'])
    }
    console.log(data);
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
    this.isUpdate = false
    // this.modalInput = []
  }

  //系統任務
  upData() {
    this.code = { status: 0 }
    this.isVisible = false
    this.isUpdate = true
  }

  //非系統任務
  editData() {
    this.isVisible = false
    this.isEdit = true
    this.formatEditData()
  }

  formatEditData() {
    this.editInfo = {
      Plant: this.man.Plant,
      Project_Code: "/",
      Material_No: "",
      Battery_PN: "",
      Demand_Year: "",
      Shipment_Books: "生產賬冊",
      Transport_Mode: "",
      Testimonials_SN: "點擊上傳",
      Create_ID: "",
      Create_Time: ""
    }
  }

  async closeEdit() {
    this.isEdit = false
    await this.search()
  }

  //取无后缀文件名
  plitFileName(text) {
    var pattern = /\.{1}[a-z]{1,}$/;
    if (pattern.exec(text) !== null) {
      return (text.slice(0, pattern.exec(text).index));
    } else { return text; }
  }

  async change(event) {
    this.loading = true
    this.isUpdate = true
    console.log(event.target.files[0]);
    let name = this.plitFileName(event.target.files[0].name)
    this.code = await this.http.systemMission(name)
    if (this.code['status'] == 200) {
      const file = new FormData()
      file.append('file', event.target.files[0])
      await this.http.originFileUpload(file)
    }
    this.loading = false
  }

  uploadPdf(event) {
    this.filePdf = event.target.files[0]
    if (this.filePdf) {
      this.editInfo.Testimonials_SN = this.plitFileName(this.filePdf.name)
    }
    console.log(event);
  }

  async saveData() {
    let date = new Date
    this.editInfo.Create_ID = this.man.User_ID
    this.editInfo.Create_Time = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
    this.editInfo.Project_Code = this.editInfo.Project_Code == "" ? "/" : this.editInfo.Project_Code
    this.code = await this.http.noSystemMission(this.editInfo)
    if (this.code.status == 200) {
      const file = new FormData()
      file.append('file', this.filePdf)
      await this.http.originFileUpload(file)
    }
    this.isUpdate = true
  }

  // async delete(data) {
  //   let status
  //   if (this.id == 'chinese')
  //     status = await this.http.deleteChineseName(data)
  //   else
  //     status = await this.http.deleteSpecialArchitecture(data)

  //   if (status.hasOwnProperty('error'))
  //     this.message.create('error', '資料刪除失敗')
  //   else {
  //     this.showTableData.find((e, i) => { if (e.id == data) this.showTableData.splice(i, 1) })
  //     this.showTableData = JSON.parse(JSON.stringify(this.showTableData))
  //     this.message.create('success', '資料刪除成功')
  //   }
  // }

  handleData(data) {
    if (data) return data
    else return 'null'
  }
}
