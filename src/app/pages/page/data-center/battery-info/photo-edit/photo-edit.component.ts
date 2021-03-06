import { DataService } from './../../../../../services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {
  @Input() baseInfo: any
  @Input() type: string

  allPhoto: { name: string, en: string, url: string, file: any }[] = [
    { name: '正面', en: 'FRONT', url: '', file: '' }, { name: '反面', en: 'REVERSES', url: '', file: '' },
    { name: '局部', en: 'PART', url: '', file: '' }
  ]
  allData: any
  photoData: any = { User_ID: '', Maintain_Time: '' }

  constructor(private message: NzMessageService, private http: DataService) { }

  async ngOnInit() {
    await this.getBatteryDetails()
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
      if (this.type == '照片') {
        const data = {
          Plant: this.baseInfo.plant,
          Battery_PN: this.baseInfo.battery_pn,
          place: this.allPhoto[index].en
        }
        const status = await this.http.uploadBatteryPhoto(data, this.allPhoto[index].file)
        if (status.hasOwnProperty('error'))
          this.message.create('error', '不好意思，图片上传失败')
        else {
          this.message.create('success', '图片上传成功')
          await this.getBatteryDetails()
        }
      }
      if (this.type == '新增照片')
        this.allPhoto[index].url = window.URL.createObjectURL(file)
    }
    else {
      this.allPhoto[index].file = ''
      this.allPhoto[index].url = ''
    }
  }

  async getBatteryDetails() {
    this.allData = await this.http.getBatteryDetails(this.baseInfo)
    if (this.allData.Photo) {
      if (this.allData.Photo.length > 0) {
        this.photoData = this.allData.Photo[0]
        this.handlePhoto()
      }
    }
  }

  handlePhoto() {
    this.allPhoto[0].url = this.photoData.Photo_Front
    this.allPhoto[1].url = this.photoData.Photo_Reverses
    this.allPhoto[2].url = this.photoData.Photo_Part
  }

  seeOrDown(item, type) {
    if (item.url) {
      switch (type) {
        case 'see':
          window.open(item.url)
          break;
        case 'down':
          window.open(item.url)
          break;
        default:
          break;
      }
    }
  }

}
