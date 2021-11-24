import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { base64ToFileOrBlob, saveFileToBlob, saveFileToLink } from 'web-downloadfile';

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
  Packages_Qty: number,
  User_ID: string,
  Maintain_Time: any
}

@Component({
  selector: 'app-special-chinese',
  templateUrl: './special-chinese.component.html',
  styleUrls: ['./special-chinese.component.css']
})
export class SpecialChineseComponent implements OnInit {
  // bodyStyle = {
  //   background: 'rgba(32, 48, 51, 1)',
  //   'max-height': '450px',
  //   'min-height': '300px',
  //   padding: '10px 20px',
  //   // 'overflow-y': 'scroll',
  //   color: '#fff',
  // };
  @Input() id: string//0  special  1 chinese
  showTableData: any = []
  tableScrollHeight: string = ''
  tableHead: any = [
    { name: '序號' }, { name: '廠別：' },
    { name: '特殊架構' }, { name: '產品系列' },
    { name: '上傳人' }, { name: '上傳時間' },
    { name: '編輯' }
  ]
  plant: any = JSON.parse(sessionStorage.getItem('plant'))
  man: any = JSON.parse(sessionStorage.getItem('man'))
  searchInfo = { PlantCode: this.man.Plant, Material_No: '', Project_Code: '' }
  specialChineseModal: boolean = false
  dropUploadModal: boolean = false
  modalInputTitle: any
  searchTitle: any
  modalInput: any = []
  tableKey: any
  photoModal: boolean = false
  productModalType: string

  photoModalTitle: string = '查看'

  dRmodalInput: modalData = {
    plant: this.man.Plant,
    input1: '',
    input2: '',
    pdf: ''
  }

  batteryPlacement: any = [
    // { name: '与设备包装在一起', value: 0, checked: true },
    { name: '与设备包装在一起', value: 0 },
    { name: '安装在设备内', value: 1 },
  ]
  url: string = ''

  photoData: photoData = {
    Plant: JSON.parse(sessionStorage.getItem('man')).Plant,
    Project_Code: '',
    Special_SKU: '',
    Placement_Mode: 0,
    Packages_Qty: 0,
    User_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
    Maintain_Time: ''
  }

  allPhoto = {
    productPhoto: [{ name: '正面', en: 'front', url: '', }, { name: '反面', en: 'reverses', url: '' }, { name: '局部', en: 'part', url: '' }],
    packagePhoto: [{ name: '正面', en: 'front', url: '' }, { name: '反面', en: 'reverses', url: '' }, { name: '局部', en: 'part', url: '' }]
  }

  constructor(
    private http: DataService,
    private message: NzMessageService,
    private route: Router
  ) { }

  async ngOnInit() {
    await this.initData()
    this.tableScrollHeight = 0.65 * Number(sessionStorage.getItem('height')) + 'px'
    this.plant.splice(0, 1)
  }

  async initData() {
    switch (this.id) {
      case 'special':
        this.searchTitle = this.modalInputTitle = ['特殊架構：', '產品系列：']
        break;

      case 'chinese':
        this.searchTitle = this.modalInputTitle = ['成品中文品名：', 'Product  Name：']
        this.tableHead[2].name = '成品中文品名'
        this.tableHead[2].width = '400px'
        this.tableHead[1].name = 'Product  Name'
        break;

      case 'product':
        this.searchTitle = ['特殊架構：', '產品系列：']
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
        break

      case 'drop':
        this.searchTitle = ['產品系列：', '電池料號：']
        this.tableHead = [
          { name: '文件名稱' }, { name: '廠別' }, { name: '产品系列' },
          { name: '电池料号' }, { name: '上传人(顆)' }, { name: '上传时间' },
          { name: '操作', width: '13%' }
        ]
        this.tableKey = [
          'File_Name', 'Plant', 'Project_Code',
          'Battery_PN', 'User_ID', 'Maintain_Time '
        ]
        this.modalInput = ['產品系列：', '電池料號：']
        break

      case 'declare':
        this.searchTitle = ['使用年份：']
        this.tableHead = [
          { name: '文件名' }, { name: '廠別' }, { name: '使用年份' },
          { name: '文件類型' }, { name: '編輯' }]
        this.tableKey = ['File_Name', 'Plant', 'Maintain_Time', 'File_Type']
        this.modalInput = ['使用年份：', '文件類型：']
        break

      case 'battery':
        this.searchTitle = ['電池料號：']
        this.tableHead = [{ name: '編號' }, { name: '廠別' }, { name: '料號' }, { name: '操作' }]
        this.tableKey = ['plant', 'battery_pn']
        break

      default:
        break;
    }
    await this.search()
  }

  // 搜索方法
  async search() {
    let data = {
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
        this.showTableData = await this.http.getBatteryInfo(data)
        break

      default:
        break;
    }
    if (this.showTableData.hasOwnProperty('error'))
      this.message.create('error', '資料查詢失敗')
    else if
      (this.showTableData.length == 0) this.message.create('warning', '查询资料为空')
    else
      this.message.create('success', '資料查詢成功')
    console.log(this.showTableData, 11111);
  }

  // 打开模态框
  showModal() {
    if (['special', 'chinese'].includes(this.id))
      this.specialChineseModal = true

    if (['drop', 'declare'].includes(this.id))
      this.dropUploadModal = true

    if (this.id == 'product') {
      this.photoModal = true
      this.productModalType = 'newAdd'
      this.photoModalTitle = '新增'
    }
  }

  // 关闭模态框
  close() {
    this.specialChineseModal = false
    this.modalInput = []
  }

  async change() {
    if (this.id == 'special') {
      let data = { Plant: this.man.Plant, Material_No: this.modalInput[0] }
      let productLine = await this.http.getProductLine(data)
      if (productLine.length > 0)
        this.modalInput[1] = productLine[0].ModelFamily
      else this.modalInput[1] = ''
      console.log(this.modalInput)
    }
  }

  async saveData() {
    let data
    let status
    if (this.id == 'chinese') {
      data = {
        Site: this.man.Site,
        Plant: this.man.Plant,
        ProductName_ZH: this.modalInput[0],
        ProductName_EN: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addChineseName(data)
    } else {
      data = {
        Site: this.man.Site,
        Plant: this.man.Plant,
        Project_Code: this.modalInput[0],
        Material_No: this.modalInput[1],
        User_ID: this.man.User_ID
      }
      status = await this.http.addSpecialArchitecture(data)
    }
    if (status.hasOwnProperty('error'))
      this.message.create('error', '資料保存失敗')
    else {
      this.message.create('success', '資料保存成功')
      await this.search()
      this.close()
    }
  }

  async delete(data) {
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
      this.photoModal = true
      this.photoModalTitle = '查看'
    }

    if (type == 'edit') {
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
    }

  }

  async drUploadNewAdd() {
    const man = JSON.parse(sessionStorage.getItem('man'))
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
        User_ID: man.User_ID,
        Maintain_Time: date
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
        User_ID: man.User_ID,
        Maintain_Time: date
      }
      status2 = await this.http.declareNewAdd(addData)
    }
    status1 = await this.http.uploadPdf(data)
    if (status1.hasOwnProperty('error') && status2.hasOwnProperty('error'))
      this.message.create('error', '上传失败')
    else
      this.message.create('success', '上传成功')
    await this.search()
    this.dropUploadModal = false
    console.log(this.dRmodalInput, 222222222);
  }

  pdf(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      const file: File = fileList[0]
      this.dRmodalInput.pdf = new FormData()
      this.dRmodalInput.pdf.append('file', file)
    } else this.dRmodalInput.pdf = ''
    console.log(this.dRmodalInput.pdf);
  }

  async showPdf(item, type) {
    const condition = {
      Plant: item.Plant,
      Project_Code: item.Project_Code,
      Battery_PN: item.Battery_PN
    }
    const url = await this.http.getDropPdf(condition)
    if (url.length > 0) {
      if (type == 'see')
        window.open(url[0].File_Name)
      else {
        // const iframe = document.createElement("iframe");
        // iframe.style.display = "none";
        // iframe.style.height = '0';
        // iframe.src = url[0].File_Name;
        // document.body.appendChild(iframe)
        // iframe.click()
        // iframe.remove()

        // const link = document.createElement('a')
        // link.href = 'blob:' + url[0].File_Name
        // link.download = '测试.pdf'
        // document.body.appendChild(link);
        // link.click()
        // document.body.removeChild(link)
        // window.URL.revokeObjectURL(link.href)



        // this.downloadExportFile(url[0].File_Name, 'test', 'pdf')

        // saveFileToLink(url[0].File_Name, 'test', 'pdf')

        window.location.href = url[0].File_Name

        // this.downloadFile(url[0].File_Name, 'text.pdf')
      }
    } else
      this.message.create('warning', '暂无PDF文件')
  }

  // downloadExportFile(blob, tagFileName, fileType) {
  //   let downloadElement = document.createElement('a');
  //   let href = blob;
  //   if (typeof blob == 'string') {
  //     downloadElement.target = '_blank';
  //   } else {
  //     href = window.URL.createObjectURL(blob); //创建下载的链接
  //   }
  //   downloadElement.href = href;
  //   downloadElement.download = tagFileName + new Date().getTime() + '.' + fileType; //下载后文件名
  //   document.body.appendChild(downloadElement);
  //   downloadElement.click(); //点击下载
  //   document.body.removeChild(downloadElement); //下载完成移除元素
  //   if (typeof blob != 'string') {
  //     window.URL.revokeObjectURL(href); //释放掉blob对象
  //   }
  // }

  // downloadFile(record, fileName) {
  //   var request = new XMLHttpRequest();
  //   request.responseType = "blob";//定义响应类型
  //   request.open("GET", 'http://localhost:4200/' + record);
  //   request.onload = function () {
  //     var url = window.URL.createObjectURL(this.response);
  //     var a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.href = url;
  //     a.download = fileName
  //     a.click();
  //   }
  //   request.send();
  // }


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
        window.location.href = url[0].File_Name
      }

    }

    if (type == 'delete') {
      const status = await this.http.deleteDeclarPdf(condition)
      if (status.hasOwnProperty('error'))
        this.message.create('error', '删除失败')
      else {
        this.message.create('success', '删除成功')
        this.search()
      }
    }

  }

  closeDropUploadModal() {
    this.dRmodalInput = {
      plant: this.man.Plant,
      input1: '',
      input2: '',
      pdf: ''
    }
    this.dropUploadModal = false
  }

  closePhotoModal() {
    this.photoData = {
      Plant: JSON.parse(sessionStorage.getItem('man')).Plant,
      Project_Code: '',
      Special_SKU: '',
      Placement_Mode: 0,
      Packages_Qty: 0,
      User_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
      Maintain_Time: ''
    }
    this.allPhoto = {
      productPhoto: [{ name: '正面', en: 'FRONT', url: '', }, { name: '反面', en: 'REVERSES', url: '' }, { name: '局部', en: 'PART', url: '' }],
      packagePhoto: [{ name: '正面', en: 'FRONT', url: '' }, { name: '反面', en: 'REVERSES', url: '' }, { name: '局部', en: 'PART', url: '' }]
    }
    this.photoModal = false
  }

  getPhoto(event, type, index) {
    const file = event.target.files[0]
    if (file) {
      this.allPhoto[type][index].file = new FormData()
      this.allPhoto[type][index].file.append('file', file)

      // this.allPhoto[type][index].file

      this.allPhoto[type][index].url = window.URL.createObjectURL(file)
    }
    else {
      this.allPhoto[type][index].file = ''
      this.allPhoto[type][index].url = ''
    }
    console.log(this.allPhoto);
  }

  async savePhoto() {
    this.photoData.Maintain_Time = new Date()
    this.photoData.Placement_Mode = Number(this.photoData.Placement_Mode)
    this.photoData.Packages_Qty = Number(this.photoData.Packages_Qty)
    this.photoData.Special_SKU = this.photoData.Special_SKU ? this.photoData.Special_SKU : null
    let status = true

    this.allPhoto.packagePhoto.forEach(e => {
      if (!e.url) status = false
    })
    this.allPhoto.productPhoto.forEach(e => {
      if (!e.url) status = false
    })
    if (!status) {
      this.message.create('warning', '请上传所有的照片！！！')
      return
    }

    let photoInfo = {
      Plant: this.photoData.Plant,
      Project_Code: this.photoData.Project_Code,
      Special_SKU: this.photoData.Special_SKU,
      PhotoType: '',
      place: '',
      file: ''
    }

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
      this.message.create('error', '上传失败，该厂的该产品可能已经存在')
    else {
      this.message.create('success', '上传成功')
      await this.search()
      this.closePhotoModal()
    }

    console.log(this.photoData, 2222222222222222);

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
    const status = await this.http.deleteProductPacking(item)
    if (status.hasOwnProperty('error'))
      this.message.create('error', '删除失败')
    else {
      this.message.create('success', '删除成功')
      await this.search()
    }
  }

  littleEdit(item, status) {
    item.status = status
    this.route.navigate(['home/dataCenter/batteryInfo/seeEdit', item])
  }

}
