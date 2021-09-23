import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../../services/data.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() pageType: number = 0

  constructor(
    private http: DataService,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) { }

  isVisible = false;
  transportWay: any = [
    { label: '空運', value: 1, disabled: true, checked: false },
    { label: '海運', value: 2, disabled: true },
    { label: '公路', value: 3, disabled: true },
    { label: '鐵路', value: 4, disabled: true }
  ]

  unexpectStart: any = [
    { label: '開關帽', value: 1, disabled: false, checked: false },
    { label: '開關鎖', value: 2 },
    { label: '凹陷式開關', value: 3 },
    { label: '觸發鎖', value: 4 },
    { label: '熱敏式電滾斷路器', value: 5 },
    { label: '其他', value: 6 }
  ]

  disabled: boolean = false
  appointTime: number
  taskStatus = []

  appointLabel = [
    { name: '2個工作日（正常）', value: 0, checked: true },
    { name: '1個工作日（加急）', value: 1 },
    { name: '6～24小時（特急）', value: 2 }
  ]

  transport = {
    air: { status: true, num: '' },
    sea: { status: true, num: '' }
  }

  sample = {
    data: 1,
    label: [
      { name: '留樣', value: 1 },
      { name: '退還', value: 2 },
      { name: '其他', value: 3 },
    ]
  }

  need = {
    data: 1,
    label: [
      { name: '需要', value: 0 },
      { name: '不需要', value: 1 },
    ]
  }

  battery = {
    data: 1,
    label: [
      { name: '是', value: 0 },
      { name: '否', value: 1 },
    ]
  }

  safeExhaust = {
    data: 1,
    label: [
      { name: '有', value: 0 },
      { name: '無', value: 1 },
    ]
  }

  current = {
    data: 1,
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  Wh = {
    data: 1,
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  minBattery = {
    data: 1,
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  dangerSign = {
    data: 1,
    label: [
      { name: '有', value: 1 },
      { name: '無', value: 2 },
    ]
  }

  batterySign = {
    data: 1,
    label: [
      { name: '是', value: 1 },
      { name: '否', value: 2 },
    ]
  }

  condition: any = { task: '', num: 0, index: 0 }

  info = {
    Battery_SN: 0,
    Button_Battery: 0,
    Complete_Time: 0,
    Consignor: "",
    Currents_Device: 0,
    Dangerous_Label: null,
    Demand_Year: "",
    Entrust_Explain: "",
    Exhaust_Device: 0,
    LithiumBattery_Label: 0,
    Manufacturer: "",
    Packages_Qty: 0,
    Placement_Mode: 0,
    Plant: "",
    ProductName_EN: "",
    ProductName_ZH: "",
    Reference_SN: null,
    Sample_Dispose: 0,
    Sample_Photo: 0,
    Short_Circuit: "",
    Site: "",
    Special_Require: 0,
    Task_SN: "",
    Transport_Report: { 1: 0, 2: 0, 3: 0, 4: 0 },
    UN383_SN: "",
    Unexpected_Start: [],
    Update_Time: "",
    Urgent: 0,
    Verification_Code: null,
    Wh_Logo: 0,
    id: 0
  }

  targetInfo = {
    Battery_PN: "",
    Communication_Record: "",
    Demand_Year: "",
    Entrust_No: "",
    Material_No: "",
    Plant: "",
    Project_Code: "",
    Shipment_Books: 0,
    Shipment_Books_Desc: "",
    Task_Status: 0,
    Task_Status_Desc: "",
    Task_Type: 0,
    Task_Type_Desc: "",
    Testimonials_SN: "",
    Transport_Mode: []
  }
  Delete_Reason: string

  plant = JSON.parse(sessionStorage.getItem('plant'))
  searchInfo: string
  permission: any = JSON.parse(sessionStorage.getItem('man')).Permission
  specialEdit: number = 0

  async ngOnInit() {
    await this.getTaskStatus()
    this.route.params.subscribe(res => {
      this.condition = JSON.parse(JSON.stringify(res))
      this.condition.index = Number(this.condition.index)
      this.condition.num = Number(this.condition.num)
      this.condition.Transport_Mode = Number(this.condition.Transport_Mode)
      this.specialEdit = this.permission['HOMEPAGE' + this.condition.index].Special_Edit
    })
    await this.getTargetInfo(this.condition['task'])
    await this.getInfo(this.condition['task'])
    this.plant.splice(0, 1)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.pageType, 333333);
  }

  log(value): void {
    console.log(value);
  }

  goBack() {
    history.go(-1)
  }

  logTran() {
    console.log(this.transport, 2222);
  }

  async getTaskStatus() {
    this.taskStatus = await this.http.getTaskStatus()
  }

  // 获取任务信息并处理数据
  async getTargetInfo(task) {
    let data = (await this.http.getTargetInfo(task))[0]
    console.log(data, '任务信息');
    if (data) {
      this.targetInfo = data
      this.targetInfo.Transport_Mode.forEach(e => {
        this.transportWay[e - 1].checked = true
      });
    }
  }

  // 获取任务信息以外的信息，并处理数据
  async getInfo(task) {
    let data = (await this.http.getInfo(task))[0]
    console.log(data, '其他信息');
    if (data) {
      this.info = data
      this.info.Unexpected_Start.forEach(e => {
        this.unexpectStart[e - 1].disabled = true
        this.unexpectStart[e - 1].checked = true
      });

    }
  }

  search() {
    console.log(111);
  }

  showModal(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

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

}
