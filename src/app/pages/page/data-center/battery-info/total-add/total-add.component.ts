import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit } from '@angular/core';
import { EncryptService } from 'src/app/services/encrypt/encrypt.service';

@Component({
  selector: 'app-total-add',
  templateUrl: './total-add.component.html',
  styleUrls: ['./total-add.component.css']
})
export class TotalAddComponent implements OnInit {

  loading: boolean = false
  man: any = JSON.parse(sessionStorage.getItem('man'))
  year: any = JSON.parse(sessionStorage.getItem('year'))
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  base = {
    Plant: '',
    battery_pn: ''
  }

  testimonialInfo = {
    data: {
      Plant: '',
      Battery_PN: '',
      File_Name: '',
      Testimonial_SN: '',
      Use_Year: '',
      Transport_Mode: '',
      User_ID: '',
      Maintain_Time: ''
    },
    transportMode: [
      // { name: '与设备包装在一起', value: 0, checked: true },
      { name: '空運', value: 1 },
      { name: '海運', value: 2 },
      { name: '公路', value: 3 },
      { name: '鐵路', value: 4 },
    ],
    file: ''
  }

  un38: any = {
    data: {
      Plant: '',
      Battery_PN: '',
      File_Name: '',
      File_Encoding: '',
      Verification_Code: '',
      User_ID: '',
      Maintain_Time: ''
    },
    file: ''
  }

  authorization: any = {
    data: {
      Plant: '',
      Battery_PN: '',
      File_Name: '',
      Start_Date: '',
      End_Date: '',
      User_ID: '',
      Maintain_Time: ''
    },
    file: ''
  }

  other: any = {
    data: {
      Plant: '',
      Battery_PN: '',
      File_Name: '',
      Remark: '',
      User_ID: '',
      Maintain_Time: ''
    },
    file: ''
  }

  date: any
  allTestimonialInfo: any = []
  allUn38: any = []
  allAuthorization: any = []
  allOther: any = []
  status: boolean = true

  allPhoto: { name: string, en: string, url: string, file: any }[] = [
    { name: '正面', en: 'FRONT', url: '', file: '' }, { name: '反面', en: 'REVERSES', url: '', file: '' },
    { name: '局部', en: 'PART', url: '', file: '' }
  ]

  constructor(
    private message: NzMessageService,
    private http: DataService,
    private encrypt: EncryptService
  ) { }

  ngOnInit(): void {
    this.init()
  }

  goBack() {
    history.go(-1)
  }

  init() {
    this.year.splice(0, 1)
    this.plant.splice(0, 1)

    this.allTestimonialInfo.push(this.dpClone(this.testimonialInfo))
    this.allUn38.push(this.dpClone(this.un38))
    this.allAuthorization.push(this.dpClone(this.authorization))
    this.allOther.push(this.dpClone(this.other))
  }

  pdf(event, key) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      const file: File = fileList[0]
      if (file.type != 'application/pdf') {
        this.message.create('warning', '请上传PDF文件，谢谢')
        return
      }
      key.data.File_Name = Date.now() + '^' + this.encrypt.encrypt(file.name)
      key.file = new FormData()
      key.file.append('file', file)
    } else {
      key.file = ''
      key.data.File_Name = ''
    }
  }

  onChange(result: Date[], item): void {
    if (result.length > 0) {
      item.data.Start_Date = result[0].toLocaleDateString()
      item.data.End_Date = result[1].toLocaleDateString()
    } else {
      item.data.Start_Date = ''
      item.data.End_Date = ''
    }
  }

  async sure() {
    if (!(this.base.Plant && this.base.battery_pn)) {
      this.message.create('warning', '不好意思，请将廠別和料号填写完整')
      return
    }

    const existStatus = await this.http.getBatteryExist(this.base)
    if (existStatus.length > 0) {
      this.message.create('warning', '不好意思，该廠別已经有该料号的数据')
      return
    }

    this.allTestimonialInfo.forEach(e => {
      this.handleData(e)
    });

    this.allUn38.forEach(e => {
      this.handleData(e)
    });

    this.allAuthorization.forEach(e => {
      this.handleData(e)
    });

    this.allOther.forEach(e => {
      this.handleData(e)
    });

    const allTestimonialInfoEmpty = this.handleEmptyData(this.allTestimonialInfo, '新增鑑定書')
    if (allTestimonialInfoEmpty) return

    const allUn38Empty = this.handleEmptyData(this.allUn38, '新增UN38.3试验概要')
    if (allUn38Empty) return

    const allAuthorizationEmpty = this.handleEmptyData(this.allAuthorization, '新增授权书')
    if (allAuthorizationEmpty) return

    const photoStatus = this.allPhoto.every(e => { return e.url })
    if (!photoStatus) {
      this.message.create('warning', '不好意思，请上传所有的照片')
      return
    }

    this.loading = true

    this.allTestimonialInfo.forEach(async (e, i) => {
      await this.postData(e, '鑑定書', i)
    });

    this.allUn38.forEach(async (e, i) => {
      await this.postData(e, 'UN38.3试验概要', i)
    });

    this.allAuthorization.forEach(async (e, i) => {
      await this.postData(e, '授权书', i)
    });

    this.allOther.forEach(async (e, i) => {
      await this.postData(e, '其他', i)
    });

    await this.postPhoto()

    const photoInfoStatus = await this.http.upBatteryPhotoInfo({
      Plant: this.base.Plant,
      Battery_PN: this.base.battery_pn,
      User_ID: this.man.User_ID,
      Maintain_Time: new Date()
    })

    if (photoInfoStatus.status != 200) {
      this.message.error('照片信息上传失败')
      this.status = false
    }

    if (this.status) {
      this.message.create('success', '恭喜你，资料上传成功')
      this.goBack()
    }
    this.loading = false
  }

  handleEmptyData(data: any, name: string): boolean {
    let emptyStatus: boolean = false
    data.forEach((item, index) => {
      const value = Object.keys(item.data)
      let valueStatus: boolean = true
      value.forEach(e => {
        if (e != 'File_Name') {
          if (!item.data[e])
            valueStatus = false
        }
      });
      const pdfStatus = !!item.file
      let status = `${name}的第${index + 1}笔资料有缺失`

      if (!valueStatus)
        status += ` ,基本信息未填写完整`
      if (!pdfStatus)
        status += `  , PDF档案未上传`

      if (!valueStatus || !pdfStatus) {
        this.message.warning(status)
        emptyStatus = true
      }
    });
    return emptyStatus
  }

  async postData(data, type, i) {
    let dataStatus
    let pdfStatus
    switch (type) {
      case '鑑定書':
        if (data.data && data.file) {
          dataStatus = await this.http.addTestimonial(data.data)
          pdfStatus = await this.http.uploadBatteryPdf('Battery\\Testimonial', data.file, data.data.File_Name)
        }
        break;

      case 'UN38.3试验概要':
        if (data.data && data.file) {
          dataStatus = await this.http.addUN38(data.data)
          pdfStatus = await this.http.uploadBatteryPdf('Battery\\UN383', data.file, data.data.File_Name)
        }
        break;

      case '授权书':
        if (data.data && data.file) {
          dataStatus = await this.http.addAuthorization(data.data)
          pdfStatus = await this.http.uploadBatteryPdf('Battery\\Authorization', data.file, data.data.File_Name)
        }
        break;

      case '其他':
        if (data.data && data.file) {
          dataStatus = await this.http.addOther(data.data)
          pdfStatus = await this.http.uploadBatteryPdf('Battery\\Other', data.file, data.data.File_Name)
        }

        break;

      default:
        break;
    }

    if (dataStatus.hasOwnProperty('error')) {
      this.message.create('error', `${type}，第${i + 1}条信息上传失败`)
      this.status = false
    }

    if (pdfStatus.hasOwnProperty('error')) {
      this.message.create('error', `${type}，第${i + 1}个PDF上传失败`)
      this.status = false
    }

  }

  async postPhoto() {
    const data = {
      Plant: this.base.Plant,
      Battery_PN: this.base.battery_pn,
      place: ''
    }
    this.allPhoto.forEach(async (e, i) => {
      data.place = e.en
      const photoStatus = await this.http.uploadBatteryPhoto(data, e.file)
      if (photoStatus.hasOwnProperty('error')) {
        this.message.create('error', `不好意思，第${i}张图片上传失败`)
        this.status = false
      }
    });
  }


  handleData(item) {
    item.data.Plant = this.base.Plant
    item.data.Battery_PN = this.base.battery_pn
    item.data.Maintain_Time = new Date()
    item.data.User_ID = this.man.User_ID
  }

  dpClone(data) {
    return JSON.parse(JSON.stringify(data))
  }

  add(type) {
    switch (type) {
      case '鑑定書':
        this.allTestimonialInfo.push(this.dpClone(this.testimonialInfo))
        break;

      case 'UN38.3试验概要':
        this.allUn38.push(this.dpClone(this.un38))
        break;

      case '授权书':
        this.allAuthorization.push(this.dpClone(this.authorization))
        break;

      case '其他':
        this.allOther.push(this.dpClone(this.other))
        break;

      default:
        break;
    }
  }

  async getPhoto(event, index) {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.includes('image')) {
        this.message.create('warning', '请上传图片文件')
        return
      }
      this.allPhoto[index].file = new FormData()
      this.allPhoto[index].file.append('file', file)
      this.allPhoto[index].url = window.URL.createObjectURL(file)
    }
    else {
      this.allPhoto[index].file = ''
      this.allPhoto[index].url = ''
    }
  }

  seePhoto(item) {
    if (item.url)
      window.open(item.url)
    else
      this.message.create('warning', '不好意思，暂无照片可看')
  }


}
