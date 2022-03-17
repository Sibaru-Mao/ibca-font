import { EncryptService } from './../../../../../services/encrypt/encrypt.service';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-little-add',
  templateUrl: './little-add.component.html',
  styleUrls: ['./little-add.component.css']
})
export class LittleAddComponent implements OnInit {
  loading: boolean = false
  man: any = JSON.parse(sessionStorage.getItem('man'))
  baseInfo: any
  year: any = JSON.parse(sessionStorage.getItem('year'))
  transportMode: any = [
    { name: '空運', value: 1 },
    { name: '海運', value: 2 },
    { name: '公路', value: 3 },
    { name: '鐵路', value: 4 },
  ]

  testimonialInfo: any = {
    Plant: '',
    Battery_PN: '',
    File_Name: '',
    Testimonial_SN: '',
    Use_Year: '',
    Transport_Mode: '',
    User_ID: '',
    Maintain_Time: ''
  }

  un38: any = {
    Plant: '',
    Battery_PN: '',
    File_Name: '',
    File_Encoding: '',
    Verification_Code: '',
    User_ID: '',
    Maintain_Time: ''
  }

  authorization: any = {
    Plant: '',
    Battery_PN: '',
    File_Name: '',
    Start_Date: '',
    End_Date: '',
    User_ID: '',
    Maintain_Time: ''
  }

  other: any = {
    Plant: '',
    Battery_PN: '',
    File_Name: '',
    Remark: '',
    User_ID: '',
    Maintain_Time: ''
  }

  pdfFile: any
  pdfName: string = ''
  date = null;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private http: DataService,
    private enecrypt: EncryptService
  ) { }

  ngOnInit(): void {
    this.year.splice(0, 1)
    this.route.params.subscribe(res => {
      this.baseInfo = res
    })
  }

  goBack() {
    history.go(-1)
  }

  pdf(event) {
    const fileList = event.target.files
    if (fileList.length > 0) {
      const file = fileList[0]
      if (file.type != 'application/pdf') {
        this.message.create('warning', '请上传PDF文件，谢谢')
        return
      }
      this.pdfName = Date.now() + '^' + this.enecrypt.encrypt(file.name)
      this.pdfFile = new FormData()
      this.pdfFile.append('file', file)
    } else {
      this.pdfFile = ''
      this.pdfName = ''
    }
  }

  async sure() {
    if (!this.pdfFile) {
      this.message.create('warning', '不好意思，请先上传PDF文件')
      return
    }
    this.loading = true
    let status
    let pdfStatus
    this.pdfName = this.enecrypt.encrypt(this.pdfName)
    switch (this.baseInfo.type) {
      case '鑑定書':
        this.testimonialInfo.Plant = this.baseInfo.plant
        this.testimonialInfo.Maintain_Time = new Date()
        this.testimonialInfo.User_ID = this.man.User_ID
        this.testimonialInfo.Battery_PN = this.baseInfo.battery_pn
        this.testimonialInfo.File_Name = this.pdfName
        status = await this.http.addTestimonial(this.testimonialInfo)
        pdfStatus = await this.http.uploadBatteryPdf('Battery\\Testimonial', this.pdfFile, this.pdfName)
        break;

      case 'UN38.3试验概要':
        this.un38.Plant = this.baseInfo.plant
        this.un38.Maintain_Time = new Date()
        this.un38.User_ID = this.man.User_ID
        this.un38.Battery_PN = this.baseInfo.battery_pn
        this.un38.File_Name = this.pdfName
        status = await this.http.addUN38(this.un38)
        pdfStatus = await this.http.uploadBatteryPdf('Battery\\UN383', this.pdfFile, this.pdfName)
        break;

      case '授权书':
        this.authorization.Plant = this.baseInfo.plant
        this.authorization.Maintain_Time = new Date()
        this.authorization.User_ID = this.man.User_ID
        this.authorization.Battery_PN = this.baseInfo.battery_pn
        this.authorization.File_Name = this.pdfName
        status = await this.http.addAuthorization(this.authorization)
        pdfStatus = await this.http.uploadBatteryPdf('Battery\\Authorization', this.pdfFile, this.pdfName)
        break;

      case '其他':
        this.other.Plant = this.baseInfo.plant
        this.other.Maintain_Time = new Date()
        this.other.User_ID = this.man.User_ID
        this.other.Battery_PN = this.baseInfo.battery_pn
        this.other.File_Name = this.pdfName
        status = await this.http.addOther(this.other)
        pdfStatus = await this.http.uploadBatteryPdf('Battery\\Other', this.pdfFile, this.pdfName)
        break;

      default:
        break;
    }
    if (status.hasOwnProperty('error'))
      this.message.create('error', '不好意思，信息新增失败')
    else if (status.status == 500) {
      this.message.create('warning', '不好意思，信息已存在')
    }
    else {
      this.message.create('success', '信息新增成功')
      this.goBack()
    }

    if (pdfStatus.hasOwnProperty('error'))
      this.message.create('error', '不好意思，PDF上传失败')
    else
      this.message.create('success', '恭喜，PDF上传成功')
    this.loading = false
  }

  onChange(result: Date[]): void {
    this.authorization.Start_Date = result[0].toLocaleDateString()
    this.authorization.End_Date = result[1].toLocaleDateString()
  }

}
