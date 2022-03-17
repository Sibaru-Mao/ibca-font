import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';

interface modalData {
  plant: string,
  input1: string,
  input2: string,
  pdf: any
}

interface photoData {
  Plant: string,
  Project_Code: string,
  Special_SKU: string,
  Placement_Mode: number,
  Packages_Qty: any,
  User_ID: string,
  Maintain_Time: any,
  judgePro: boolean,
  judgePack: boolean
}

@Component({
  selector: 'app-special-chinese',
  templateUrl: './special-chinese.component.html',
  styleUrls: ['./special-chinese.component.css']
})
export class SpecialChineseComponent implements OnInit {
  @Input() id: string
  showTableData: any = []
  tableScrollHeight: string = ''
  tableHead: any = [
    { name: '序號' }, { name: '廠別' },
    { name: '特殊架構' }, { name: '產品系列' },
    { name: '上傳人' }, { name: '上傳時間' },
    { name: '編輯' }
  ]
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  nowPlant: any = JSON.parse(sessionStorage.getItem('nowPlant'))
  searchInfo = { PlantCode: this.nowPlant.PlantCode, Material_No: '', Project_Code: '' }
  specialChineseModal: boolean = false
  dropUploadModal: boolean = false
  modalInputTitle: any
  searchTitle: any
  modalInput: any = ['', '']
  tableKey: any
  photoModal: boolean = false
  productModalType: string
  pdfName: string = ''
  loading: boolean = false
  photoModalTitle: string = '查看'

  dRmodalInput: modalData = {
    plant: this.nowPlant.PlantCode,
    input1: '',
    input2: '',
    pdf: ''
  }

  batteryPlacement: any = [
    { name: '与设备包装在一起', value: 0 },
    { name: '安装在设备内', value: 1 },
  ]
  url: string = ''

  photoData: photoData = {
    Plant: this.nowPlant.PlantCode,
    Project_Code: '',
    Special_SKU: '/',
    Placement_Mode: 0,
    Packages_Qty: '',
    User_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
    Maintain_Time: '',
    judgePro: true,
    judgePack: true
  }

  allPhoto = {
    productPhoto: [{ name: '正面', en: 'front', url: '', file: '' }, { name: '反面', en: 'reverses', url: '', file: '' }, { name: '局部', en: 'part', url: '', file: '' }],
    packagePhoto: [{ name: '正面', en: 'front', url: '', file: '' }, { name: '反面', en: 'reverses', url: '', file: '' }, { name: '局部', en: 'part', url: '', file: '' }]
  }
  manAllInfo = JSON.parse(sessionStorage.getItem('manAllInfo'))
  permission: any = ''
  noPermission = { view: 0, Edit: 0, New: 0, Delete: 0, SpecialEdit: 0 }

  constructor(
    private http: DataService,
    private message: NzMessageService,
    private route: Router,
  ) { }

  async ngOnInit() {
    this.man.Permission = this.manAllInfo.Permission[this.nowPlant.PlantCode]
    sessionStorage.setItem('man', JSON.stringify(this.man))
    this.permission = this.man.Permission
    await this.initData()
    this.tableScrollHeight = 0.65 * Number(sessionStorage.getItem('height')) + 'px'
    this.plant.splice(0, 1)
    if (this.id == 'declare')
      this.dRmodalInput.input2 = '一致性申明'
  }

  handlePermission(name: string) {
    if (!this.man.Permission[name])
      return this.noPermission
    else
      return this.man.Permission[name]
  }

  async initData() {
    switch (this.id) {
      case 'special':
        this.searchTitle = this.modalInputTitle = ['特殊架構:', '產品系列:']
        this.permission = this.handlePermission('SPECIALSKU')
        break;

      case 'chinese':
        this.searchTitle = this.modalInputTitle = ['成品中文品名:', 'Product  Name:']
        this.tableHead[2].name = '成品中文品名'
        this.tableHead[2].width = '400px'
        this.tableHead[3].name = 'Product  Name'
        this.permission = this.handlePermission('ZHNAME')
        break;

      case 'product':
        this.searchTitle = ['特殊架構:', '產品系列:']
        this.tableHead = [
          { name: '廠別' }, { name: '产品系列' }, { name: '特殊架構' },
          { name: '電池放置方式' }, { name: '包裝內電池數量(顆)' }, { name: '產品照片&包裝照片' },
          { name: '上傳時間' }, { name: '上傳人' }, { name: '操作', width: '15%' }
        ]
        this.tableKey = [
          'Plant', 'Project_Code', 'Special_SKU',
          'Placement_Mode', 'Packages_Qty', '查看',
          'Maintain_Time ', 'User_ID',
        ]
        this.permission = this.handlePermission('PACKINFO')
        break

      case 'drop':
        this.searchTitle = ['產品系列:', '電池料號:']
        this.tableHead = [
          { name: '文件名稱' }, { name: '廠別' }, { name: '产品系列' },
          { name: '电池料号' }, { name: '上传人' }, { name: '上传时间' },
          { name: '操作', width: '13%' }
        ]
        this.tableKey = [
          'File_Name', 'Plant', 'Project_Code',
          'Battery_PN', 'User_ID', 'Maintain_Time '
        ]
        this.modalInput = ['產品系列:', '電池料號:']
        this.permission = this.handlePermission('FALLINFO')
        break

      case 'declare':
        this.searchTitle = ['使用年份:']
        this.tableHead = [
          { name: '文件名' }, { name: '廠別' }, { name: '使用年份' },
          { name: '文件類型' }, { name: '編輯' }]
        this.tableKey = ['File_Name', 'Plant', 'Maintain_Time', 'File_Type']
        this.modalInput = ['使用年份:', '文件類型:']
        this.permission = this.handlePermission('CONSISTENT')
        break

      case 'battery':
        this.searchTitle = ['電池料號:']
        this.tableHead = [{ name: '編號' }, { name: '廠別' }, { name: '料號' }, { name: '操作' }]
        this.tableKey = ['plant', 'battery_pn']
        this.permission = this.handlePermission('BTYINFO')
        break

      default:
        break;
    }
    await this.search()
  }

  async search(warn?: boolean) {
    let data: any = {
      PlantCode: this.searchInfo.PlantCode,
      Material_No: this.searchInfo.Material_No,
      Project_Code: this.searchInfo.Project_Code
    }
    if (this.searchInfo.Material_No.length < 1)
      data.Material_No = null
    if (this.searchInfo.Project_Code.length < 1)
      data.Project_Code = null

    switch (this.id) {
      case 'chinese':
        this.showTableData = await this.http.getChineseProduct(data)
        break;

      case 'special':
        this.showTableData = await this.http.getSpecialData(data)
        break;

      case 'product':
        this.showTableData = await this.http.productPacking(data)
        break;

      case 'drop':
        this.showTableData = await this.http.getDropReport(data)
        break

      case 'declare':
        this.showTableData = await this.http.getDeclare(data)
        break

      case 'battery':
        if (data.Material_No) {
          if (data.Material_No.includes('，'))
            data.Material_No = data.Material_No.replace(/，/ig, ',')
          data.Material_No = JSON.stringify(data.Material_No.split(','))
        }
        this.showTableData = await this.http.getBatteryInfo(data)
        break

      default:
        break;
    }
    if (!warn) {
      if (this.showTableData.hasOwnProperty('error') || this.showTableData.status)
        this.message.create('error', '資料查詢失敗')
      else if
        (this.showTableData.length == 0) this.message.create('warning', '查询资料为空')
      else
        this.message.create('success', '資料查詢成功')
    }
  }

  showModal() {
    if (this.permission.Edit) {
      if (['special', 'chinese'].includes(this.id))
        this.specialChineseModal = true
      if (['drop', 'declare'].includes(this.id)) {
        if (this.id == 'declare')
          this.dRmodalInput.input2 = '一致性申明'
        this.dropUploadModal = true
      }
      if (this.id == 'product') {
        this.photoData = {
          Plant: this.nowPlant.PlantCode,
          Project_Code: '',
          Special_SKU: '/',
          Placement_Mode: 0,
          Packages_Qty: '',
          User_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
          Maintain_Time: '',
          judgePro: true,
          judgePack: true
        }
        this.allPhoto = {
          productPhoto: [{ name: '正面', en: 'FRONT', url: '', file: '' }, { name: '反面', en: 'REVERSES', url: '', file: '' }, { name: '局部', en: 'PART', url: '', file: '' }],
          packagePhoto: [{ name: '正面', en: 'FRONT', url: '', file: '' }, { name: '反面', en: 'REVERSES', url: '', file: '' }, { name: '局部', en: 'PART', url: '', file: '' }]
        }
        this.productModalType = 'newAdd'
        this.photoModalTitle = '新增'
        this.photoModal = true
      }
      if (this.id == 'battery') {
        this.route.navigate(['home/dataCenter/batteryInfo/totalAdd'])
      }
    } else {
      this.message.warning('不好意思，你没有权限！！！')
    }
  }

  close() {
    this.specialChineseModal = false
    this.modalInput = []
  }

  async change() {
    if (this.id == 'special') {
      let data = { Plant: this.nowPlant.PlantCode, Material_No: this.modalInput[0] }
      let productLine = await this.http.getProductLine(data)
      if (productLine.length > 0)
        this.modalInput[1] = productLine[0].ModelFamily
      else
        this.modalInput[1] = ''
    }
  }

  async saveData() {
    let data
    let status
    if (!this.modalInput[0] || !this.modalInput[1]) {
      this.message.warning('请将所有的输入框都输入有效数据再提交')
      return
    }
    const input1 = this.modalInput[0].replace(/(^\s*)|(\s*$)/g, '')
    const input2 = this.modalInput[1].replace(/(^\s*)|(\s*$)/g, '')
    if (!input1 || !input2) {
      this.message.warning('请将所有的输入框都输入有效数据再提交')
      return
    }
    this.loading = true
    if (this.id == 'chinese') {
      data = {
        Site: this.nowPlant.Site,
        Plant: this.nowPlant.PlantCode,
        ProductName_ZH: this.modalInput[0],
        ProductName_EN: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addChineseName(data)
    } else {
      data = {
        Site: this.nowPlant.Site,
        Plant: this.nowPlant.PlantCode,
        Material_No: this.modalInput[0],
        Project_Code: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addSpecialArchitecture(data)
    }
    if (status.hasOwnProperty('error'))
      this.message.create('error', '資料保存失敗!!!')
    else if (status.msg == '已存在') {
      this.message.warning('该资料已经存在!!!')
    }
    else {
      this.message.success('資料保存成功')
      await this.search(true)
      this.close()
    }
    this.loading = false
  }

  async delete(data) {
    if (this.permission.Delete) {
      let status: any
      if (this.id == 'chinese')
        status = await this.http.deleteChineseName(data)
      else
        status = await this.http.deleteSpecialArchitecture(data)
      if (status.hasOwnProperty('error'))
        this.message.create('error', '資料刪除失敗')
      else {
        this.showTableData.find((e, i) => { if (e.id == data) this.showTableData.splice(i, 1) })
        this.showTableData = JSON.parse(JSON.stringify(this.showTableData))
        this.message.create('success', '資料刪除成功')
      }
    } else {
      this.message.warning('不好意思，你没有权限！！！')
    }
  }

  async showPhoto(type, item) {
    const info = {
      Plant: item.Plant,
      Project_Code: item.Project_Code,
      Special_SKU: item.Special_SKU
    }
    const data = (await this.http.getProductPackingPhoto(info))[0]
    this.productModalType = type
    this.handlePhoto(data)

    if (type == 'see') {
      if (this.permission.view) {
        this.photoModal = true
        this.photoModalTitle = '查看'
      } else {
        this.message.warning('不好意思，你没有权限！！！')
      }
    }

    if (type == 'edit') {
      if (this.permission.Edit) {
        this.photoModalTitle = '編輯'
        if (!data) {
          this.message.create('warning', '抱歉，暂无数据')
        } else {
          this.photoData.Plant = data.Plant
          this.photoData.Project_Code = data.Project_Code
          this.photoData.Special_SKU = data.Special_SKU
          this.photoData.Placement_Mode = data.Placement_Mode
          this.photoData.Packages_Qty = data.Packages_Qty
          this.photoModal = true
        }
      } else {
        this.message.warning('不好意思，你没有权限！！！')
      }
    }
  }

  async drUploadNewAdd() {
    this.loading = true
    const date = new Date()
    let status1: any
    let status2: any
    const data = {
      Plant: this.dRmodalInput.plant,
      Project_Code: '',
      Battery_PN: '',
      Use_Year: '',
      pdf: this.dRmodalInput.pdf
    }
    let addData: any

    if (this.id == 'drop') {
      data.Project_Code = this.dRmodalInput.input1
      data.Battery_PN = this.dRmodalInput.input2
      data.Use_Year = null
      addData = {
        Plant: data.Plant,
        Project_Code: data.Project_Code,
        Battery_PN: data.Battery_PN,
        User_ID: this.man.User_ID,
        Maintain_Time: date
      }
      if (!this.findEmpty(addData) || !data.pdf) {
        this.message.warning('请确认你正确已输入所有资料并且上传了PDF文档!!!')
        this.loading = false
        return
      }
      status2 = await this.http.dropNewAdd(addData)
    }
    if (this.id == 'declare') {
      data.Use_Year = this.dRmodalInput.input1
      data.Project_Code = null
      data.Battery_PN = null
      addData = {
        Plant: data.Plant,
        Use_Year: data.Use_Year,
        File_Type: this.dRmodalInput.input2,
        User_ID: this.man.User_ID,
        Maintain_Time: date
      }
      if (!this.findEmpty(addData) || !data.pdf) {
        this.loading = false
        this.message.warning('请确认你已正确输入所有资料并且上传了PDF文档!!!')
        return
      }
      status2 = await this.http.declareNewAdd(addData)
    }
    status1 = await this.http.uploadPdf(data)
    if (status1.hasOwnProperty('error') || status2.hasOwnProperty('error'))
      this.message.create('error', '上传失败')
    else if (status2.msg == '已存在')
      this.message.warning('该资料已经存在')
    else {
      this.message.create('success', '上传成功')
      await this.search(true)
      this.closeDropUploadModal()
    }
    this.loading = false
  }

  findEmpty(data) {
    return Object.values(data).every((e) => {
      if (typeof e == 'string')
        return e.replace(/(^\s*)|(\s*$)/g, '')
      else if (typeof e == 'number')
        return JSON.stringify(e)
      else
        return e
    })
  }

  pdf(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      const file: File = fileList[0]
      if (file.type != 'application/pdf') {
        this.message.warning('请上传PDF文档')
        return
      }
      this.pdfName = file.name
      this.dRmodalInput.pdf = new FormData()
      this.dRmodalInput.pdf.append('file', file)
    } else {
      this.dRmodalInput.pdf = ''
      this.pdfName = ''
    }
  }

  async showPdf(item, type) {
    const condition = {
      Plant: item.Plant,
      Project_Code: item.Project_Code,
      Battery_PN: item.Battery_PN
    }
    const url = await this.http.getDropPdf(condition)
    if (url.length > 0) {
      if (type == 'see') {
        if (this.permission.view) {
          window.open(url[0].File_Name)
        } else {
          this.message.warning('不好意思，你没有权限！！！')
        }
      } else {
        window.open(url[0].File_Name)
      }
    } else
      this.message.create('warning', '暂无PDF文件')
  }

  async declarePdf(data, type) {
    const condition = {
      Plant: data.Plant,
      Use_Year: data.Use_Year
    }
    if (type == 'download') {
      const url = await this.http.downDeclarePdf(condition)
      if (url.length == 0)
        this.message.create('warning', '没有PDF文件')
      else {
        window.open(url[0].File_Name)
      }
    }
    if (type == 'delete') {
      if (this.permission.Delete) {
        const status = await this.http.deleteDeclarPdf(condition)
        if (status.hasOwnProperty('error'))
          this.message.create('error', '删除失败')
        else {
          this.message.create('success', '删除成功')
          this.search(true)
        }
      } else {
        this.message.warning('不好意思，你没有权限！！！')
      }
    }
  }

  closeDropUploadModal() {
    this.dRmodalInput = {
      plant: this.nowPlant.PlantCode,
      input1: '',
      input2: '',
      pdf: ''
    }
    this.pdfName = ''
    this.dropUploadModal = false
  }

  closePhotoModal() {
    this.photoModal = false
  }

  getPhoto(event, type, index) {
    const file = event.target.files[0]
    if (file) {
      this.allPhoto[type][index].file = new FormData()
      this.allPhoto[type][index].file.append('file', file)
      this.allPhoto[type][index].url = window.URL.createObjectURL(file)
    }
    else {
      this.allPhoto[type][index].file = ''
      this.allPhoto[type][index].url = ''
    }
  }

  async savePhoto() {
    this.photoData.Maintain_Time = new Date()
    this.photoData.Placement_Mode = Number(this.photoData.Placement_Mode)
    this.photoData.Packages_Qty = Number(this.photoData.Packages_Qty)
    this.photoData.Special_SKU = this.photoData.Special_SKU ? this.photoData.Special_SKU : '/'

    if (!this.findEmpty(this.photoData)) {
      this.message.warning('请正确输入所有资料!!!')
      this.loading = false
      return
    }
    if (!(/(^[1-9]\d*$)/.test(this.photoData.Packages_Qty))) {
      this.message.warning('电池数量只能为正整数!!!')
      return
    }

    this.photoData.judgePack = !!this.allPhoto.packagePhoto[2].file
    this.photoData.judgePro = !!this.allPhoto.productPhoto[2].file
    let photoStatus = true
    this.allPhoto.packagePhoto.forEach((e, i) => {
      if (!e.url && i != 2) photoStatus = false
    })
    this.allPhoto.productPhoto.forEach((e, i) => {
      if (!e.url && i != 2) photoStatus = false
    })
    if (!photoStatus) {
      this.message.create('warning', '正面和反面的照片必须上传!!!')
      return
    }
    this.loading = true

    let photoInfo = {
      Plant: this.photoData.Plant,
      Project_Code: this.photoData.Project_Code,
      Special_SKU: this.photoData.Special_SKU ? this.photoData.Special_SKU : '/',
      PhotoType: '',
      place: '',
      file: ''
    }

    let status
    if (this.photoModalTitle == '新增')
      status = await this.http.productPackingNewAdd(this.photoData)
    if (this.photoModalTitle == '編輯')
      status = await this.http.productPackingEdit(this.photoData)

    this.allPhoto.productPhoto.forEach(async e => {
      if (e['file']) {
        photoInfo.PhotoType = 'PRODUCT'
        photoInfo.place = e.en
        photoInfo.file = e['file']
        await this.http.uploadPhoto(photoInfo)
      }
    })

    this.allPhoto.packagePhoto.forEach(async e => {
      if (e['file']) {
        photoInfo.PhotoType = 'PACKAGES'
        photoInfo.place = e.en
        photoInfo.file = e['file']
        await this.http.uploadPhoto(photoInfo)
      }
    })

    if (status.hasOwnProperty('error'))
      this.message.error('上传失败')
    else if (status.msg == '已存在')
      this.message.warning('该厂的该产品系列下的该特殊架构已经存在!!!')
    else {
      this.message.create('success', '上传成功')
      await this.search(true)
      this.closePhotoModal()
    }
    this.loading = false
  }

  handlePhoto(data) {
    const base = ['Front', 'Reverses', 'Part']
    this.allPhoto.productPhoto.forEach((e, i) => {
      e.url = data[`Product_Photo_${base[i]}`]
    })
    this.allPhoto.packagePhoto.forEach((e, i) => {
      e.url = data[`Packages_Photo_${base[i]}`]
    })
  }

  async deleteProductPacking(item) {
    if (this.permission.Delete) {
      const status = await this.http.deleteProductPacking(item)
      if (status.hasOwnProperty('error'))
        this.message.create('error', '删除失败')
      else {
        this.message.create('success', '删除成功')
        await this.search(true)
      }
    } else {
      this.message.warning('不好意思，你没有权限！！！')
    }
  }

  littleEdit(item, status) {
    if (this.permission.Edit) {
      item.status = status
      this.route.navigate(['home/dataCenter/batteryInfo/seeEdit', item])
    } else
      this.message.warning('不好意思，你没有权限！！！')
  }

  async delBatteryInfo(item) {
    if (this.permission.Delete) {
      this.loading = true
      const status = await this.http.delBatteryInfo(item)
      if (status?.code == 200) {
        this.message.success('删除成功')
        await this.search(true)
      } else
        this.message.error('删除失败')
      this.loading = false
    } else {
      this.message.warning('不好意思，你没有权限！！！')
    }
  }

}
