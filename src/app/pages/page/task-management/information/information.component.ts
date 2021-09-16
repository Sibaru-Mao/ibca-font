import { DataService } from './../../../../services/data.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() pageType: number = 0

  constructor(private http: DataService, private route: ActivatedRoute, private router: Router) { }

  checkOptionsThree: any = [
    { label: '空運', value: 'Apple', disabled: false, checked: false },
    { label: '海運', value: 'Pear', },
    { label: '公路', value: 'Orange' },
    { label: '鐵路', value: 'red' }
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

  condition = { task: '', num: 0 }

  info = {
    Battery_SN: 1,
    Button_Battery: 1,
    Complete_Time: 0,
    Consignor: " ",
    Currents_Device: 1,
    Dangerous_Label: null,
    Demand_Year: " ",
    Entrust_Explain: " ",
    Exhaust_Device: 1,
    LithiumBattery_Label: 1,
    Manufacturer: " ",
    Packages_Qty: 1,
    Placement_Mode: 1,
    Plant: " ",
    ProductName_EN: " ",
    ProductName_ZH: "",
    Reference_SN: null,
    Sample_Dispose: 3,
    Sample_Photo: 1,
    Short_Circuit: " ",
    Site: " ",
    Special_Require: 1,
    Task_SN: " ",
    Transport_Report: { 1: 1, 2: 2 },
    UN383_SN: " ",
    Unexpected_Start: [],
    Update_Time: " ",
    Urgent: 1,
    Verification_Code: null,
    Wh_Logo: 1,
    id: 2
  }

  targetInfo = {
    Battery_PN: " ",
    Communication_Record: " ",
    Demand_Year: " ",
    Entrust_No: " ",
    Material_No: " ",
    Plant: " ",
    Project_Code: " ",
    Shipment_Books: 1,
    Shipment_Books_Desc: " ",
    Task_Status: 1,
    Task_Status_Desc: " ",
    Task_Type: 1,
    Task_Type_Desc: " ",
    Testimonials_SN: " ",
    Transport_Mode: [1]
  }

  editData: {

  }

  plant = JSON.parse(sessionStorage.getItem('plant'))
  searchInfo: string

  async ngOnInit() {
    await this.getTaskStatus()
    this.route.params.subscribe(res => { this.condition = JSON.parse(JSON.stringify(res)) })
    await this.getTargetInfo(this.condition['task'])
    await this.getInfo(this.condition['task'])
    this.plant.splice(0, 1)
    console.log(this.pageType, 222222);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
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
    if (data) {
      this.targetInfo = data
      this.targetInfo.Transport_Mode.forEach(e => {
        this.checkOptionsThree[e - 1].disabled = true
        this.checkOptionsThree[e - 1].checked = true
      });
    }
    console.log(this.targetInfo, 333333);
  }

  // 获取任务信息以外的信息，并处理数据
  async getInfo(task) {
    let data = (await this.http.getInfo(task))[0]
    if (data) {
      this.info = (await this.http.getInfo(task))[0]
      this.info.Unexpected_Start.forEach(e => {
        this.unexpectStart[e - 1].disabled = true
        this.unexpectStart[e - 1].checked = true
      });
    }
    console.log(this.info, 222222)
  }

  search() {
    console.log(111);

  }


}
