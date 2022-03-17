import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  Create_ID: string,
  Entrust_No: string,
  Source_Task_SN: string,
  Battery_Model: string,
  Entrust_Explain: string,
  Reference_SN: string,
  Sample_Dispose: string
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
  Complete_Time: string,
  Source_Task_SN: string,
  Battery_Model: string,
  Entrust_Explain: string,
  Reference_SN: string,
  Sample_Dispose: string
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() type: string
  @Input() title: string  //延期、运输
  @Output() backInit = new EventEmitter<any>()
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

  appointLabel = [
    { name: '2個工作日（正常）', value: '0' },
    { name: '1個工作日（加急）', value: 1 },
    { name: '6～24小時（特急）', value: 2 },
    { name: '3小时特急', value: 3 }
  ]

  modaltitle: string
  loading: boolean = false
  showModal: boolean = false
  Task_SN: string = ''

  constructor(private http: DataService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.tableScrollHeight = 0.4 * Number(sessionStorage.getItem('height')) + 'px'
    this.modaltitle = this.title == '延期' ? '延期申请' : '空轉海'
  }

  // 接收来自application-repair查询的资料
  getData(data) {
    this.tableData = data
  }

  // 点击操作栏触发的方法
  async operate(data) {
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
      await this.pmodal2()
      this.modalStatus = true
      setTimeout(() => {
        let transport = document.getElementById('transportReport')
        transport.style.height = ''
      }, 20);
    }
  }

  // 关闭模态框
  close() {
    this.modalStatus = false
  }

  // 客户声明同意按钮触发的方法
  async pmodal2() {
    this.taskInfo = await this.http.getTargetInfo(this.nowData.Task_SN)
    if (this.taskInfo) {
      if (this.title == '延期')
        this.taskInfo['useYear'] = Number(this.taskInfo.Demand_Year) + 1
      else
        this.taskInfo['useYear'] = Number(this.taskInfo.Demand_Year)
    }
    this.info = await this.http.getInfo(this.nowData.Task_SN)
    if (this.info.status) {
      this.message.error('获取基本信息失败')
      return
    } else {
      this.info = this.info[0]
    }

    if (this.title == '延期')
      this.info.Entrust_Explain = this.taskInfo.Entrust_Postpone

    if (this.title == '运输')
      this.info.Entrust_Explain = this.taskInfo.Entrust_Transfer

    this.modalType = 'pmodal3'

    if (this.title == '延期')
      setTimeout(() => {
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
      }, 20);
  }

  // 延期申请或空转海里的确定触发的方法
  async pmodal3() {
    let status: any
    this.loading = true
    if (this.type == 'postpone') {
      let data: defer = {
        Site: this.info.Site,
        Plant: this.taskInfo.Plant,
        Project_Code: this.taskInfo.Project_Code,
        Material_No: this.taskInfo.Material_No,
        Battery_PN: this.taskInfo.Battery_PN,
        Demand_Year: this.taskInfo.Demand_Year,
        Transport_Mode: this.nowData.Transport_Mode,
        Transport_Report: this.info.Transport_Report,
        Task_SN: this.info.Task_SN,
        Shipment_Books: this.taskInfo.Shipment_Books,
        Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
        Entrust_No: this.taskInfo.Entrust_No,
        Source_Task_SN: this.info.Task_SN,
        Battery_Model: this.nowData.Battery_Model ? this.nowData.Battery_Model : '',
        Entrust_Explain: this.info.Entrust_Explain,
        Reference_SN: this.info.Reference_SN,
        Sample_Dispose: this.info.baseWindowsUp.Sample_Dispose
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
        Complete_Time: `${this.info.baseWindowsUp.Complete_Time}`,
        Source_Task_SN: this.info.Task_SN,
        Battery_Model: this.nowData.Battery_Model ? this.nowData.Battery_Model : '',
        Entrust_Explain: this.info.Entrust_Explain,
        Reference_SN: this.info.Reference_SN,
        Sample_Dispose: this.info.baseWindowsUp.Sample_Dispose
      }
      data.Transport_Report[2] = this.info.airTosea
      status = await this.http.airToSea(data)
    }
    if (status.code == 200) {
      this.message.create('success', status.msg)
      this.modalStatus = false
      this.Task_SN = status.Task_SN
      this.showModal = true
    }
    else
      this.message.create('error', status.msg)
    this.loading = false
  }

  back() {
    this.backInit.next()
    this.tableData = []
    this.showModal = false
  }

}
