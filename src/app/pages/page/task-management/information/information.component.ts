// import { ApplicationRepairComponent } from './../../../component/application-repair/application-repair.component';
import { ModalService } from './../../../../services/server/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../../services/data.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Output() saveNewData = new EventEmitter<any>()
  @Input() pageType: number = 0 //0任务管理中的查看、编辑、删除，1资料中心的基础设定，2申请中的新申请、维修品，3

  isVisible = false;
  transportWay: any = [
    { label: '空運', value: 1, disabled: true, checked: false },
    { label: '海運', value: 2, disabled: true, checked: false },
    { label: '公路', value: 3, disabled: true, checked: false },
    { label: '鐵路', value: 4, disabled: true, checked: false }
  ]

  unexpectStart: any = [
    { label: '開關帽', value: 1, disabled: false, checked: false },
    { label: '開關鎖', value: 2, checked: false },
    { label: '凹陷式開關', value: 3, checked: false },
    { label: '觸發鎖', value: 4, checked: false },
    { label: '熱敏式電滾斷路器', value: 5, checked: false },
    { label: '其他', value: 6, checked: false }
  ]

  disabled: boolean = false
  appointTime: number
  taskStatus = []

  appointLabel = [
    { name: '2個工作日（正常）', value: 0, checked: true },
    { name: '1個工作日（加急）', value: 1 },
    { name: '6～24小時（特急）', value: 2 }
  ]

  sample = {
    label: [
      { name: '留樣', value: 1 },
      { name: '退還', value: 2 },
      { name: '其他', value: 3 },
    ]
  }

  need = {
    label: [
      { name: '需要', value: 0 },
      { name: '不需要', value: 1 },
    ]
  }

  battery = {
    label: [
      { name: '是', value: 0 },
      { name: '否', value: 1 },
    ]
  }

  safeExhaust = {
    label: [
      { name: '有', value: 0 },
      { name: '無', value: 1 },
    ]
  }

  current = {
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  Wh = {
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  minBattery = {
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  dangerSign = {
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  batterySign = {
    label: [
      { name: '是', value: 1 },
      { name: '否', value: 2 },
    ]
  }

  condition: any = { task: '', num: 0, index: 0 }

  info: any = {
    Battery_SN: '',//number
    Button_Battery: '',//number
    Complete_Time: '',//number
    Consignor: '',
    Currents_Device: '',//number
    Dangerous_Label: '',//number
    Demand_Year: '',
    Entrust_Explain: '',
    Exhaust_Device: '',//number
    LithiumBattery_Label: '',//number
    Manufacturer: '',
    Packages_Qty: '',//number
    Placement_Mode: '',//number
    Plant: '',
    ProductName_EN: '',
    ProductName_ZH: '',
    Reference_SN: '',
    Sample_Dispose: '',//number
    Sample_Photo: '',//number
    Short_Circuit: '',
    Site: '',
    Special_Require: '',//number
    Task_SN: '',
    Transport_Report: {
      1: { status: false, number: 0 },
      2: { status: false, number: 0 },
      3: { status: false, number: 0 },
      4: { status: false, number: 0 }
    },
    UN383_SN: '',
    Unexpected_Start: [],
    Update_Time: '',
    Urgent: '',//number
    Verification_Code: '',
    Wh_Logo: '',//number
    id: ''//number
  }

  targetInfo: any = {
    Battery_PN: '',
    Communication_Record: '',
    Demand_Year: '',
    Entrust_No: '',
    Material_No: '',
    Plant: '',
    Project_Code: '',
    Shipment_Books: '',//number
    Shipment_Books_Desc: '',
    Task_Status: '',//number
    Task_Status_Desc: '',
    Task_Type: '',//number
    Task_Type_Desc: '',
    Testimonials_SN: '',
    Transport_Mode: []
  }
  Delete_Reason: string

  plant = JSON.parse(sessionStorage.getItem('plant'))
  searchInfo: string = JSON.parse(sessionStorage.getItem('man')).Plant
  permission: any = JSON.parse(sessionStorage.getItem('man')).Permission
  specialEdit: number = 0

  constructor(
    private http: DataService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: ModalService,
  ) {
    // 新申请或者维修品确定后处理基础数据
    this.modalService.getSubject().subscribe(res => {
      if (!res) return
      if (res.type == 'newApplication' && res.data.data) {
        this.info = res.data.data
        this.handleUnexpected_Start()
      }
      console.log(this.info, this.targetInfo, 111111111);
    })
  }

  async ngOnInit() {
    await this.getTaskStatus()

    if (this.pageType == 0) {
      // 任务管理模块里的 编辑（num=2） 删除（num=1）功能
      this.route.params.subscribe(res => {
        this.condition = JSON.parse(JSON.stringify(res))
        this.condition.index = Number(this.condition.index)
        this.condition.num = Number(this.condition.num)
        this.condition.Transport_Mode = Number(this.condition.Transport_Mode)
        this.specialEdit = this.permission['HOMEPAGE' + this.condition.index].Special_Edit
      })
      await this.getTargetInfo(this.condition['task'])
      await this.getInfo(this.condition['task'])
    }

    if (this.pageType == 1) {
      await this.getBaseData()
      this.plant.splice(0, 1)
    }

    this.changeStyle()


  }


  goBack() {
    history.go(-1)
  }

  // 获取任务状态的下拉栏位
  async getTaskStatus() {
    this.taskStatus = await this.http.getTaskStatus()
  }

  // 获取任务信息并处理数据
  async getTargetInfo(task) {
    let data = (await this.http.getTargetInfo(task))[0]
    if (data) {
      this.targetInfo = data
      this.handleTransport_Mode()
    }
  }

  // 获取任务信息以外的信息，并处理数据
  async getInfo(task) {
    let data = (await this.http.getInfo(task))[0]
    if (data) {
      this.info = data
      this.handleUnexpected_Start()
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  // 任务管理模块中删除资料触发的方法
  async delete() {
    let data = {
      Task_SN: this.info.Task_SN,
      Transport_Mode: this.condition.Transport_Mode,
      Delete_Reason: this.Delete_Reason,
      id: this.info.id
    }
    let info = await this.http.delete(data)
    let type = 1
    if (info.ChineseProduct.hasOwnProperty('error')) {
      this.message.create('error', '中文品名資料刪除失敗')
      type = 0
    }
    if (info.special.hasOwnProperty('error')) {
      this.message.create('error', '特殊資料刪除失敗')
      type = 0
    }
    if (info.deleteInfo.hasOwnProperty('error')) {
      this.message.create('error', '刪除原因提交失敗')
      type = 0
    }
    if (type) this.message.create('success', '資料刪除成功')
    this.close()
    this.goBack()
  }

  // 任務管理模塊的編輯保存，以及資料中心基礎設定的保存觸發的事件
  async save() {
    // let arr = []
    // this.unexpectStart.forEach(e => {
    //   if (e.checked) arr.push(e.value)
    // });
    // this.info.Unexpected_Start = arr
    this.saveUnexpected_Start()

    if (this.pageType == 1) {
      delete this.info.id
      delete this.info.Update_Time

      this.info.Complete_Time = JSON.stringify(this.info.Complete_Time)
      this.info.Sample_Dispose = Number(this.info.Sample_Dispose)
      this.info.Sample_Photo = Number(this.info.Sample_Photo)
      this.info.Exhaust_Device = Number(this.info.Exhaust_Device)
      this.info.Currents_Device = Number(this.info.Currents_Device)
      this.info.Wh_Logo = Number(this.info.Wh_Logo)
      this.info.Special_Require = Number(this.info.Special_Require)
      this.info.Dangerous_Label = Number(this.info.Dangerous_Label)
      this.info.LithiumBattery_Label = Number(this.info.LithiumBattery_Label)

      let res = await this.http.saveBasesata(this.info)
      // if (res.hasOwnProperty('error')) this.message.create('error', '保存失敗')
      if (!res.protocol41) {
        this.message.create('error', '保存失敗')
      } else {
        this.message.create('success', '保存成功')
      }
    }
  }

  // 触发生成任务的方法（触发须填写信息的保存）
  startTask() {
    this.saveNewData.next()
  }

  // 申请中的新申请和维修品，点击"生成任务"按钮触发的方法（生成任务）
  async generateTask(Task_SN) {
    // this.saveNewData.next()
    let newData = {
      TaskSn: '',
      Site: '',
      Plant: '',
      Urgent: 0,
      ProductName_ZH: '',
      ProductName_EN: '',
      Manufacturer: '',
      Complete_Time: 0,
      Transport_Report: '',
      Sample_Dispose: 0,
      Reference_SN: '',
      Sample_Photo: 0,
      Battery_SN: 1,
      Placement_Mode: 0,
      UN383_SN: '',
      Verification_Code: '',
      Button_Battery: 0,
      Exhaust_Device: 0,
      Currents_Device: 0,
      Wh_Logo: 0,
      Packages_Qty: 0,
      Short_Circuit: '',
      Unexpected_Start: '',
      Special_Require: 0,
      Dangerous_Label: 0,
      LithiumBattery_Label: 0,
      Entrust_Explain: ''
    }

    newData.TaskSn = Task_SN
    newData.Site = this.info.Site
    newData.Plant = this.info.Plant
    newData.Urgent = 0
    newData.ProductName_ZH = this.info.ProductName_ZH
    newData.ProductName_EN = this.info.ProductName_EN
    newData.Manufacturer = this.info.Manufacturer
    newData.Complete_Time = this.toNumber(this.info.Complete_Time)
    newData.Transport_Report = JSON.stringify(this.info.Transport_Report)
    newData.Sample_Dispose = this.toNumber(this.info.Sample_Dispose)
    newData.Reference_SN = this.info.Reference_SN
    newData.Sample_Photo = this.toNumber(this.info.Sample_Photo)
    newData.Battery_SN = 1
    // newData.Battery_SN = this.toNumber(this.info.Battery_SN)
    newData.Placement_Mode = this.handlePlacement_Mode(this.info.Placement_Mode)
    newData.UN383_SN = this.info.UN383_SN
    newData.Verification_Code = this.info.Verification_Code
    newData.Button_Battery = this.toNumber(this.info.Button_Battery)
    newData.Exhaust_Device = this.toNumber(this.info.Exhaust_Device)
    newData.Currents_Device = this.toNumber(this.info.Currents_Device)
    newData.Wh_Logo = this.toNumber(this.info.Wh_Logo)
    newData.Packages_Qty = this.toNumber(this.info.Packages_Qty)
    newData.Short_Circuit = this.info.Short_Circuit
    this.saveUnexpected_Start()
    newData.Unexpected_Start = JSON.stringify(this.info.Unexpected_Start)
    newData.Special_Require = this.toNumber(this.info.Special_Require)
    newData.Dangerous_Label = this.toNumber(this.info.Dangerous_Label)
    newData.LithiumBattery_Label = this.toNumber(this.info.LithiumBattery_Label)
    newData.Entrust_Explain = this.info.Entrust_Explain

    Object.keys(newData).forEach(e => {
      if (typeof (newData[e]) == 'undefined') {
        newData[e] = ''
      }
    })

    let status = await this.http.generateTask(newData)
    if (!status.protocol41) this.message.create('error', '详细信息保存失败')
    else this.message.create('success', '详细资料保存成功')


    // this.modalService.emitInfo({ type: 'saveNewData' })
  }

  // 资料中心的基础设定获取页面数据
  async getBaseData() {
    let baseData = await this.http.getBaseData(this.searchInfo)
    if (baseData.hasOwnProperty('error')) this.message.create('error', '獲取基本信息失敗')
    if (baseData.length == 0) this.message.create('warning', `該廠區目前暫無基本資料`)

    if (baseData.length > 0) {
      this.message.create('success', '獲取基本信息成功')
      this.info = baseData[0]
      // 防意外啟動的勾选框
      this.handleUnexpected_Start()
    }
  }

  // 当页面处于非任务管理模块中，改变样式
  changeStyle() {
    let base = document.getElementById('base')
    let content = document.getElementById('content')

    if (this.pageType == 2 || this.pageType == 3) {
      content.style.overflow = 'hidden'
      content.style.height = 'auto'
      content.style.padding = '0'
    }

    if (this.pageType != 0) {
      base.style.padding = '0'
    }

  }

  // 处理info中的Unexpected_Start，为防意外啟動  绑定勾选状态
  handleUnexpected_Start() {
    if (this.info.Unexpected_Start.length > 0) {
      if (typeof (this.info.Unexpected_Start) == 'string') {
        this.info.Unexpected_Start = JSON.parse(this.info.Unexpected_Start)
      }
      this.unexpectStart.forEach(e => {
        e.checked = false
      });

      this.info.Unexpected_Start.forEach(e => {
        this.unexpectStart[e - 1].checked = true
      })

    }
  }

  // 保存Unexpected_Start时的处理
  saveUnexpected_Start() {
    let arr = []
    this.unexpectStart.forEach(e => {
      if (e.checked) arr.push(e.value)
    });
    this.info.Unexpected_Start = arr
  }

  // 处理targetInfo中的Transport_Mode，为 运输方式 绑定默认勾选
  handleTransport_Mode() {
    if (this.targetInfo.Transport_Mode.length > 0) {

      this.transportWay.forEach(e => {
        e.checked = false
      });

      this.targetInfo.Transport_Mode.forEach(e => {
        this.transportWay[e - 1].checked = true
      })

    }
  }

  // 将字符串转换成数字
  toNumber(data) {

    if (data) {
      if (data.length > 0) {
        data = Number(data)
        return data
      } else {
        return data
      }
    } else {
      return 0
    }

  }

  handlePlacement_Mode(data) {
    if (data == '与设备包装在一起')
      return 0
    if (data = '安装在设备内')
      return 1
  }

  downLoad(url) {
    // window.location.href = url
    window.open(url)
  }

}
