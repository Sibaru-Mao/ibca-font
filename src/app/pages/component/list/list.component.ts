import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { title } from 'process';
interface defer {
  Site: string,
  Plant: string,
  Project_Code: string,
  Material_No: string,
  Battery_PN: string,
  Demand_Year: string,
  Transport_Mode: number,
  Transport_Report: object,
  Task_SN: string,
  Shipment_Books: number,
  Create_ID: string
}

interface airToSea {
  Site: string,
  Plant: string,
  Project_Code: string,
  Material_No: string,
  Battery_PN: string,
  Demand_Year: string,
  Transport_Report: object,
  Task_SN: string,
  Task_Status: number,
  Shipment_Books: number,
  Create_ID: string,
  Complete_Time: string
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() type: string
  tableScrollHeight: string
  tableHead: string[] = [
    '廠別', '任務編碼', '項次', '任務狀態', 'Project code',
    '特殊架構', '電池料號', '需求年份', '出貨賬冊', '運輸方式',
    '鑑定書類型', '委託單號', '鑑定書編碼', '操作'
  ]

  tableData: object[]
  td: string[] = [
    'Plant', 'Task_SN', 'Item_Time', 'Task_Status', 'Project_Code',
    'Material_No', 'Battery_PN', 'Demand_Year', 'Shipment_Books', 'Transport_Mode',
    'Task_Type', 'Entrust_No', 'Testimonials_SN'
  ]

  modalStatus: boolean = false
  modalType: string
  // 当前延期或者运输的资料信息
  nowData: any

  taskInfo: any = {
    Plant: "",
    Project_Code: "",
    Material_No: "",
    Battery_PN: "",
    Demand_Year: "",
    Shipment_Books: 1,
    Shipment_Books_Desc: "",
    Task_Type: 1,
    Task_Type_Desc: "",
    Entrust_No: null,
    Testimonials_SN: null,
    Communication_Record: null,
    Task_Status: 1,
    Task_Status_Desc: "",
    Transport_Mode: [0],
  }

  info: any = {
    Battery_SN: 1,//number
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

  modaltitle: string = title == '延期' ? '延期申请' : '空轉海'

  constructor(private http: DataService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.tableScrollHeight = 0.4 * Number(sessionStorage.getItem('height')) + 'px'
  }

  // 接收来自application-repair查询的资料
  getData(data) {
    this.tableData = data
  }

  // 点击操作栏触发的方法
  operate(data) {
    this.nowData = data
    if (this.type == 'postpone') {
      const month = new Date().getMonth() + 1
      if (month != 12) {
        this.modalStatus = true
        this.modalType = 'pmodal1'
        return
      }
      this.modalStatus = true
      this.modalType = 'pmodal2'
    }
    if (this.type == 'transport') {
      this.pmodal2()
      this.modalStatus = true
      let transport = document.getElementById('transportReport')
      transport.style.height = ''
      console.log(transport);
    }
    console.log(data, 111111111111111);
  }

  // 关闭模态框
  close() {
    this.modalStatus = false
  }

  // 客户声明同意按钮触发的方法
  async pmodal2() {
    this.taskInfo = (await this.http.getTargetInfo(this.nowData.Task_SN))[0]


    if (this.taskInfo) this.taskInfo['useYear'] = Number(this.taskInfo.Demand_Year) + 1
    let input = document.getElementsByClassName('listInput')
    for (let i = 0; i < input.length; i++) {
      input[i].setAttribute('disabled', 'disabled')
    }
    input[this.nowData.Transport_Mode - 1].removeAttribute('disabled')
    let img: any = document.getElementsByClassName('asterisk')
    for (let i = 0; i < img.length; i++) {
      img[i]['style'].visibility = 'hidden'
    }
    img[this.nowData.Transport_Mode - 1]['style'].visibility = 'visible'

    this.info = (await this.http.getInfo(this.nowData.Task_SN))[0]
    this.modalType = 'pmodal3'

  }

  // 延期申请或空转海里的确定触发的方法
  async pmodal3() {
    let status: any
    if (this.type == 'postpone') {
      let data: defer = {
        Site: this.info.Site,
        Plant: this.taskInfo.Plant,
        Project_Code: this.taskInfo.Project_Code,
        Material_No: this.taskInfo.Material_No,
        Battery_PN: this.taskInfo.Battery_PN,
        Demand_Year: this.taskInfo.Demand_Year,
        Transport_Mode: this.taskInfo.Transport_Mode[0],
        Transport_Report: this.info.Transport_Report,
        Task_SN: this.info.Task_SN,
        Shipment_Books: this.taskInfo.Shipment_Books,
        Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID
      }
      status = await this.http.applyForDefer(data)
    } else {
      let data: airToSea = {
        Site: this.info.Site,
        Plant: this.taskInfo.Plant,
        Project_Code: this.taskInfo.Project_Code,
        Material_No: this.taskInfo.Material_No,
        Battery_PN: this.taskInfo.Battery_PN,
        Demand_Year: this.taskInfo.Demand_Year,
        Transport_Report: this.info.Transport_Report,
        Task_SN: this.info.Task_SN,
        Task_Status: this.taskInfo.Task_Status,
        Shipment_Books: this.taskInfo.Shipment_Books,
        Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
        Complete_Time: `${this.info.Complete_Time}`
      }
      status = await this.http.airToSea(data)
    }

    if (status.code == 200) {
      this.message.create('success', status.msg)
      this.modalStatus = false
    }
    else this.message.create('error', status.msg)
    console.log(status);
  }



}
