import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface baseInfo {
  battery_pn: string,
  plant: string
  status: string
}

interface allData {
  Authorization: any[],
  Other: any[]
  Photo: any[]
  Testimonial: any[]
  UN383: any[]
}

@Component({
  selector: 'app-see-edit-table',
  templateUrl: './see-edit-table.component.html',
  styleUrls: ['./see-edit-table.component.css']
})
export class SeeEditTableComponent implements OnInit {
  @Input() title: string
  @Input() showTableData: any
  @Input() baseInfo: baseInfo
  @Output() sendPhoto = new EventEmitter<any>()

  tableHead: any
  tableKey: any
  allData: allData

  constructor(private http: DataService, private router: Router, private message: NzMessageService) { }

  async ngOnInit() {
    await this.getBatteryDetails()
    this.initTable()
  }

  initTable() {
    switch (this.title) {
      case '鑑定書':
        this.tableHead = [
          { name: '文件名称' }, { name: '鉴定书编码' }, { name: '使用年份' },
          { name: '运输方式' }, { name: '上傳人' }, { name: '上傳時間' }, { name: '操作', width: '12%' }
        ]
        this.tableKey = ['Testimonial_SN', 'Testimonial_SN', 'Use_Year', 'Description_ZH', 'User_ID', 'Maintain_Time']
        this.showTableData = this.allData.Testimonial
        break;

      case 'UN38.3试验概要':
        this.tableHead = [
          { name: '文件名称' }, { name: '文件编码' }, { name: '驗證碼' },
          { name: '上傳人' }, { name: '上傳時間' }, { name: '操作', width: '12%' }
        ]
        this.tableKey = ['Battery_PN', 'File_Encoding', 'Verification_Code', 'User_ID', 'Maintain_Time']
        this.showTableData = this.allData.UN383
        break;

      case '授权书':
        this.tableHead = [
          { name: '文件名称' }, { name: '開始日期' }, { name: '結束日期' },
          { name: '上傳人' }, { name: '上傳時間' }, { name: '操作', width: '12%' }
        ]
        this.tableKey = ['Battery_PN', 'Start_Date', 'End_Date', 'User_ID', 'Maintain_Time']
        this.showTableData = this.allData.Authorization
        break;

      case '其他':
        this.tableHead = [
          { name: '文件名称' }, { name: '上傳人' }, { name: '上傳時間' },
          { name: '備註' }, { name: '操作', width: '12%' }
        ]
        this.tableKey = ['Testimonial_SN', 'User_ID', 'Maintain_Time', 'Remark']
        this.showTableData = this.allData.Other
        break;

      default:
        break;
    }
  }

  async getBatteryDetails() {
    this.allData = await this.http.getBatteryDetails(this.baseInfo)
    // this.sendPhoto.emit(this.allData.Photo)
    console.log(this.allData, 1111111111111);
  }

  seeOrDownload(item, type) {

    if (type == 'see') {
      window.open(item.File_Name)
    }

    if (type == 'download') {
      window.location.href = item.File_Name
    }

  }

  async deleteBatteryData(item) {
    let status
    switch (this.title) {
      case '鑑定書':
        status = await this.http.delTestimonial(item, this.baseInfo)
        break;

      case 'UN38.3试验概要':

        status = await this.http.delUN383(item, this.baseInfo)
        break;

      case '授权书':

        status = await this.http.delAuthorization(item, this.baseInfo)
        break;

      case '其他':

        status = await this.http.delOther(item, this.baseInfo)
        break;

      default:
        break;
    }

    if (status.statusCode)
      this.message.create('error', '不好意思，删除失败')

    else {
      this.message.create('success', '恭喜，删除成功')
      await this.getBatteryDetails()
      this.initTable()
    }
  }

  goToLittleAdd() {
    this.router.navigate([
      'home/dataCenter/batteryInfo/littleAdd',
      { battery_pn: this.baseInfo.battery_pn, plant: this.baseInfo.plant, type: this.title }
    ])
  }

}
