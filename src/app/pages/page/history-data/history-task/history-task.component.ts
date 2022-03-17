import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-history-task',
  templateUrl: './history-task.component.html',
  styleUrls: ['./history-task.component.css']
})
export class HistoryTaskComponent implements OnInit {
  excelTitle = ['厂别', '任务编码', 'Line', '任务类型', '任务状态', '产品系列', '特殊架构', '电池料号', '需求年份', '出货账册', '运输方式', '委托单号', '鉴定书编码', '源委托单号', '源鉴定书编码']
  excelContent = [
    "Plant",
    "Task_SN",
    "item_time",
    "Task_Type_Desc",
    "Task_Status",
    "Project_Code",
    "Material_No",
    "Battery_PN",
    "Demand_Year",
    "Shipment_Books_Desc",
    "Transport_Mode_Desc",
    "Entrust_No",
    "Testimonials_SN",
    "Source_Entrust_No",
    "Source_Task_SN"
  ]
  excelName = '历史任务'
  excel = ''
  editInfo: any = {}
  plant: any = JSON.parse(sessionStorage.getItem('nowPlant')).PlantCode
  year: any = [{ Demand_Year: 'all' }]
  Shipment_Books: any = ['all', '生產賬冊', '維修賬冊']

  constructor(
    private http: DataService,
  ) { }

  ngOnInit(): void {
    this.initYear()
    this.formatEditData()
  }

  async submit() {
    let data = JSON.parse(JSON.stringify(this.editInfo))
    data.Transport_Mode = []
    this.editInfo.Transport_Mode.filter(element => {
      if (element.checked) {
        data.Transport_Mode.push(element.value)
      }
    });
    data.Transport_Mode = JSON.stringify(data.Transport_Mode)
    if (data.Demand_Year == 'all') {
      data.Demand_Year = ''
    }
    switch (data.Shipment_Books) {
      case 'all':
        data.Shipment_Books = ''
        break;

      case '生產賬冊':
        data.Shipment_Books = '0'
        break;

      case '維修賬冊':
        data.Shipment_Books = '1'
        break;

      default:
        break;
    }
    this.getData(await this.http.historyDownload(data))
  }

  getData(data) {
    this.excel = "<tr>"
    this.excelTitle.forEach(element => {
      this.excel += "<th>" + element + " </th>"
    });
    this.excel += "</tr>"
    data.forEach(element => {
      this.excel += "<tr>"
      this.excelContent.forEach(elem => {
        if (elem == "Task_Status") {
          element[elem] = this.transform(element[elem])
        }
        this.excel += "<td>" + element[elem] + " </td>"
      });
      this.excel += "</tr>"
    });
    this.downExcel()
  }

  downExcel() {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${this.excelName}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${this.excel}</table></body></html>`;
    //下载模板
    // window.location.href = uri + this.base64(template)
    const time = new Date()
    const link = document.createElement('a')
    link.href = uri + this.base64(template)
    link.download = `歷史任務${time.getFullYear()}${'0' + (time.getMonth() + 1).toString()}${time.getDate()}.xls`
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
  //输出base64编码
  base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }

  formatEditData() {
    this.editInfo = {
      Plant: this.plant,
      Task_SN: "",
      Project_Code: "",
      Material_No: "/",
      Battery_PN: "",
      Demand_Year: "all",
      Shipment_Books: "all",
      Transport_Mode: [
        { label: '空運', value: 1, checked: true },
        { label: '海運', value: 2, checked: true },
        { label: '公路', value: 3, checked: false },
        { label: '鐵路', value: 4, checked: false }
      ],
      Entrust_No: "",
      Testimonials_SN: "",
      DateStart: "",
      DateEnd: ""
    }
  }

  handleEmpty() {
    this.editInfo.Material_No = this.editInfo.Material_No.replace(/^\s*$/, '/')
  }

  onChange(result: Date): void {
    // console.log('onChange: ', result);
  }

  transform(value: any): string {
    if (value == 0)
      return '已完成'
    if (value == 1)
      return '获取资料'
    if (value == 2)
      return '待RPA读取'
    if (value == 3)
      return '填写委托'
    if (value == 4)
      return '待接收'
    if (value == 5)
      return '检测中'
    if (value == 6)
      return '待上传PDF'
    if (value == 9)
      return '手动删除'
  }

  initYear() {
    const nowYear = new Date().getFullYear()
    for (let i = nowYear + 1; i >= 2021; i--) {
      this.year.push({ Demand_Year: `${i}` })
    }
  }

}
