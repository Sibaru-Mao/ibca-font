import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';

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

  constructor(private http: DataService) { }

  ngOnInit(): void {
    this.tableScrollHeight = 0.4 * Number(sessionStorage.getItem('height')) + 'px'
  }

  getData(data) {
    console.log(data);
    this.tableData = data
  }

  // 点击操作栏触发的方法
  operate(data) {
    this.nowData = data
    if (this.type == 'postpone') {
      const month = new Date().getMonth() + 1
      // if (month != 12) {
      //   this.modalStatus = true
      //   this.modalType = 'pmodal1'
      // }
      this.modalStatus = true
      this.modalType = 'pmodal2'
    }
    console.log(data, 111111111111111);
  }

  // 关闭模态框
  close() {
    this.modalStatus = false
  }

  // 客户声明同意按钮触发的方法
  async pmodal2() {
    this.info = await this.http.getInfo(this.nowData.Task_SN)
    this.modalType = 'pmodal3'
  }

  pmodal3() {

  }



}
