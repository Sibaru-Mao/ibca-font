import { ModalService } from './../../../services/server/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-application-repair',
  templateUrl: './application-repair.component.html',
  styleUrls: ['./application-repair.component.css']
})
export class ApplicationRepairComponent implements OnInit {
  @Input() title: string
  @Output() sendData = new EventEmitter<any>()
  @Output() generateTask = new EventEmitter<any>()
  @Output() Transport_Mode = new EventEmitter<any>()

  loading: boolean = false
  nowPlant: any = JSON.parse(sessionStorage.getItem('nowPlant'))
  newData: any = {
    Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
    Site: this.nowPlant.Site,
    Plant: this.nowPlant.PlantCode,
    Project_Code: '',
    Material_No: '/',
    Battery_PN: '',
    Demand_Year: '',
    Shipment_Books: '',//number
    Transport_Mode: []
  }

  isVisible = false;
  isConfirmLoading = false;
  Shipment_Books: string

  plant: Array<any> = JSON.parse(sessionStorage.getItem('plant'))
  year: Array<any> = JSON.parse(sessionStorage.getItem('year'))
  transportWay: any = [
    { label: '空運', value: 1, disabled: false, checked: false },
    { label: '海運', value: 2, disabled: false, checked: false },
    { label: '公路', value: 3, disabled: false, checked: false },
    { label: '鐵路', value: 4, disabled: false, checked: false }
  ]
  Shipment: any = [{ name: '生產賬冊', value: 0 }, { name: '維修賬冊', value: 1 }]
  manAllInfo = JSON.parse(sessionStorage.getItem('manAllInfo'))
  man = JSON.parse(sessionStorage.getItem('man'))
  permission = this.man.Permission

  constructor(
    private http: DataService,
    private message: NzMessageService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.man.Permission = this.manAllInfo.Permission[this.nowPlant.PlantCode]
    sessionStorage.setItem('man', JSON.stringify(this.man))
    this.permission = this.man.Permission
    this.modalService.emitInfo({ type: 'newApplication', data: { status: false, data: '' } })
    this.plant.splice(0, 1)
    this.year.splice(0, 1)
    this.initData()
  }

  async sure() {
    this.newData.Shipment_Books = Number(this.newData.Shipment_Books)
    this.handleTransport_Mode()
    if (!Object.values(this.newData).every(e => {
      if (typeof e == 'object' && e['length'] < 1) {
        return false
      }
      else if (!['string', 'object'].includes(typeof e))
        return JSON.stringify(e)
      else
        return e
    })) {
      this.message.warning('请填写完所有信息，并且至少选择一种运输方式!!!')
      return
    }
    let exist = JSON.parse(JSON.stringify(this.newData))
    delete exist.Create_ID
    delete exist.Site
    this.loading = true
    if (this.title == '新申请' || this.title == '维修品') {
      if (this.title == '新申请') {
        if (!this.permission.NEWAPPLY) {
          this.message.warning('不好意思，你没有权限！！！')
          this.loading = false
          return
        } else if (!this.permission.NEWAPPLY.New) {
          this.message.warning('不好意思，你没有权限！！！')
          this.loading = false
          return
        }
      }
      let existData = await this.http.getExist(exist)
      if (existData.status) {
        this.message.create('error', '输入的资料有误，请检查')
      } else {
        if (existData.length > 0) {
          this.handleTransport_Mode()
          let modalStatus = false
          this.transportWay.forEach(t => {
            t.Task_SN = ''
            existData.forEach(e => {
              if (t.checked && t.label == e.Description_ZH) {
                modalStatus = true
              }
              if (t.label == e.Description_ZH) {
                t.Task_SN = e.Task_SN
              }
            });
          });

          this.isVisible = modalStatus
          if (!modalStatus)
            await this.handleOk()
        } else {
          await this.handleOk()
        }
      }
    } else {
      exist.Transport_Mode = JSON.stringify(exist.Transport_Mode)
      let data = await this.http.getPostponeTransport(exist)
      if (data.status) {
        this.message.create('error', '查询资料失败')
        return
      }

      if (data.length == 0) {
        this.sendData.next([])
        this.message.create('warning', '查询资料为空')
      }

      if (data.length > 0) {
        this.message.create('success', '资料查询成功')
        this.sendData.next(data)
      }
    }
    this.loading = false
  }

  // 保存新申请和维修品的须填写资料
  async saveNewData() {
    this.handleTransport_Mode()
    let res = await this.http.applicationRepair(this.newData)
    if (res.hasOwnProperty('error')) {
      this.message.error('基础资料保存失败')
      return ''
    }
    this.generateTask.next(res.Task_SN)
    return res.Task_SN
  }

  // 处理Transport_Mode和Shipment_Books
  handleTransport_Mode() {
    this.newData.Transport_Mode = []
    this.transportWay.forEach(e => {
      if (e.checked) this.newData.Transport_Mode.push(e.value)
    });
    this.newData.Shipment_Books = Number(this.newData.Shipment_Books)
  }

  // 继续申请
  async handleOk() {
    this.isConfirmLoading = true;
    let baseData = await this.http.getNewApplyBaseData(this.newData)
    if (baseData.status) {
      this.message.error('获取基本资料失败')
      return
    }
    else if (Object.keys(baseData).length <= 12) {
      this.message.warning(`请在资料中心的基础设定中设定
        ${this.plant.find(e => { return e.PlantCode == this.newData.Plant }).Plant}
        的基本资料`)
      return
    }
    else {
      this.message.success('获取基本资料成功')
    }
    this.Transport_Mode.next(this.newData.Transport_Mode)
    baseData.Demand_Year = this.newData.Demand_Year
    this.modalService.emitInfo({ type: 'newApplication', data: { status: true, data: baseData } })
    this.isConfirmLoading = false;
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleShipmentBooks() {
    if (['新申请', '运输', '延期'].includes(this.title)) {
      this.newData.Shipment_Books = 0
      this.Shipment_Books = '生產賬冊'
    }
    if (['维修品'].includes(this.title)) {
      this.newData.Shipment_Books = 1
      this.Shipment_Books = '維修賬冊'
    }
  }

  changeMaterial_No(data) {
    if (!data.replace(/(^\s*)|(\s*$)/g, ''))
      this.newData.Material_No = '/'
  }

  initData() {
    this.newData = {
      Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
      Site: this.nowPlant.Site,
      Plant: this.nowPlant.PlantCode,
      Project_Code: '',
      Material_No: '/',
      Battery_PN: '',
      Demand_Year: '',
      Shipment_Books: '',//number
      Transport_Mode: []
    }
    this.transportWay.forEach(e => {
      e.checked = false
    });
    if (this.title == '运输') {
      this.transportWay.forEach((e, i) => {
        e.disabled = true
        if (i == 0) e.checked = true
      });
    }
    this.handleShipmentBooks()
  }

}
