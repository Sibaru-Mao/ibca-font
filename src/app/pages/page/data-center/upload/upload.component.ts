import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EncryptService } from 'src/app/services/encrypt/encrypt.service';

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
  year: any = [{ Demand_Year: 'all' }]
  manAllInfo = JSON.parse(sessionStorage.getItem('manAllInfo'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  permission = this.man.Permission
  nowPlant: any = JSON.parse(sessionStorage.getItem('nowPlant'))
  transport = 1
  transportWay: any = [
    { label: '空運', value: 1, disabled: false, checked: false },
    { label: '海運', value: 2, disabled: false, checked: false },
    { label: '公路', value: 3, disabled: false, checked: false },
    { label: '鐵路', value: 4, disabled: false, checked: false }
  ]
  searchTitle: any = [
    { name: '產品系列:', data: null },
    { name: '電池料號:', data: null },
    { name: '電池型號:', data: null },
    { name: '任務編碼:', data: null }
  ]
  searchTitleOne: any = [
    { name: '委託單號:', data: null },
    { name: '鑑定書編碼:', data: null }
  ]
  searchInfo = {
    "Plant": this.nowPlant.PlantCode,
    "Demand_Year": 'all',
  }
  editInfo: any = {}
  code: any = { status: 0 }
  filePdf
  loading: boolean
  isVisible: boolean
  isEdit: boolean
  isUpdate: boolean
  load: boolean = false
  Shipment_Books_List = [{ "name": "生產賬冊", "value": 0 }, { "name": "維修賬冊", "value": 1 }]

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

  constructor(
    private http: DataService,
    private message: NzMessageService,
    private encrypt: EncryptService
  ) { }

  async ngOnInit() {
    this.initYear()
    this.man.Permission = this.manAllInfo.Permission[this.nowPlant.PlantCode]
    sessionStorage.setItem('man', JSON.stringify(this.man))
    this.permission = this.man.Permission
    this.isVisible = false
    this.plant.splice(0, 1)
    this.search()
  }

  // 搜索方法
  async search() {
    let data = {
      Plant: this.searchInfo.Plant,
      Demand_Year: typeof this.searchInfo.Demand_Year == 'string' ? this.searchInfo.Demand_Year : JSON.stringify(this.searchInfo.Demand_Year),
      Project_Code: this.handleData(this.searchTitle[0]['data']),
      Battery_PN: this.handleData(this.searchTitle[1]['data']),
      Battery_Model: this.handleData(this.searchTitle[2]['data']),
      Task_SN: this.handleData(this.searchTitle[3]['data']),
      Entrust_No: this.handleData(this.searchTitleOne[0]['data']),
      Testimonials_SN: this.handleData(this.searchTitleOne[1]['data'])
    }
    if (this.searchInfo.Demand_Year == 'all')
      data.Demand_Year = 'null'
    this.showTableData = await this.http.searchFilter(data)
  }

  // 打开模态框
  showModal() {
    if (!this.permission.TSLUPLOAD) {
      this.message.warning('不好意思，你没有权限！！！')
    } else {
      if (this.permission.TSLUPLOAD.Edit) {
        this.isVisible = true
      } else {
        this.message.warning('不好意思，你没有权限！！！')
      }
    }
  }

  // 关闭模态框
  async close() {
    this.isVisible = false
    this.isUpdate = false
    if (this.code.status == 200) {
      await this.search()
      this.isEdit = false
    }
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
      Plant: this.nowPlant.PlantCode,
      Project_Code: "",
      Material_No: "/",
      Battery_PN: "",
      Demand_Year: "",
      Shipment_Books: "0",
      Transport_Mode: "",
      Testimonials_SN: "點擊上傳",
      Create_ID: "",
      Create_Time: "",
      Entrust_No: "",
      Battery_Model: "",
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
    let name = this.plitFileName(event.target.files[0].name)
    this.code = await this.http.systemMission(name)
    if (this.code['status'] == 200) {
      const file = new FormData()
      file.append('file', event.target.files[0])
      await this.http.originFileUpload(file, this.encrypt.encrypt(event.target.files[0].name))
    }
    this.loading = false
  }

  uploadPdf(event) {
    this.filePdf = event.target.files[0]
    if (this.filePdf) {
      this.editInfo.Testimonials_SN = this.plitFileName(this.filePdf.name)
    }
  }

  showPdf(data, operation) {
    if (operation) {
      window.open(data.url)
    } else {
      if (!this.permission.TSLUPLOAD) {
        this.message.warning('不好意思，你没有权限！！！')
      } else {
        if (this.permission.TSLUPLOAD.view) {
          window.open(data.url)
        } else {
          this.message.warning('不好意思，你没有权限！！！')
        }
      }
    }
  }

  async saveData() {
    let date = new Date
    this.editInfo.Create_ID = this.man.User_ID
    this.editInfo.Create_Time = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
    try {
      Object.keys(this.editInfo).forEach(element => {
        if (this.editInfo[element].replace(/^\s*$/) == 'undefined') {
          this.message.warning('请正确输入所有资料!!!')
          throw "return"
        }
      });
    } catch (error) {
      return 0
    }
    this.load = true
    this.editInfo.Testimonials_SN = this.encrypt.encrypt(this.editInfo.Testimonials_SN)
    this.code = await this.http.noSystemMission(this.editInfo)
    if (this.code.status == 200) {
      const file = new FormData()
      file.append('file', this.filePdf)
      await this.http.originFileUpload(file, this.encrypt.encrypt(this.filePdf.name))
      await this.search()
    }
    this.isUpdate = true
    this.load = false
  }

  handleEmpty() {
    this.editInfo.Material_No = this.editInfo.Material_No.replace(/^\s*$/, '/')
  }

  handleData(data) {
    if (data) return data
    else return 'null'
  }

  initYear() {
    const nowYear = new Date().getFullYear()
    for (let i = nowYear + 1; i >= 2021; i--) {
      this.year.push({ Demand_Year: `${i}` })
    }
  }

}
