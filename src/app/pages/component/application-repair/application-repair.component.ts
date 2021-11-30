import { ModalService } from './../../../services/server/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-application-repair',
  templateUrl: './application-repair.component.html',
  styleUrls: ['./application-repair.component.css']
})
export class ApplicationRepairComponent implements OnInit {
  // @Input() type: number
  @Input() title: string
  @Output() sendData = new EventEmitter<any>()
  @Output() generateTask = new EventEmitter<any>()


  // 新申请或者维修品需填寫信息参数
  newData: any = {
    Create_ID: JSON.parse(sessionStorage.getItem('man')).User_ID,
    Site: JSON.parse(sessionStorage.getItem('man')).Site,
    Plant: JSON.parse(sessionStorage.getItem('man')).Plant,
    Project_Code: '',
    Material_No: '',
    Battery_PN: '',
    Demand_Year: '',
    Shipment_Books: '',//number
    Transport_Mode: []
  }

  isVisible = false;
  isConfirmLoading = false;
  Shipment_Books: string

  plant: Array<any> = JSON.parse(sessionStorage.getItem('plant'))
  year: Array<any> = JSON.parse(sessionStorage.getItem('year'))
  transportWay: any = [
    { label: '空運', value: 1, disabled: false, checked: false },
    { label: '海運', value: 2, disabled: false, checked: false },
    { label: '公路', value: 3, disabled: false, checked: false },
    { label: '鐵路', value: 4, disabled: false, checked: false }
  ]

  constructor(
    private http: DataService,
    private message: NzMessageService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalService.emitInfo({ type: 'newApplication', data: { status: false, data: '' } })
    // this.modalService.getSubject().subscribe(async res => {
    //   if (!res) return
    //   else {
    //     if (res.type == 'saveNewData') await this.saveNewData()
    //   }
    // })
    this.plant.splice(0, 1)
    this.year.splice(0, 1)

    if (this.title == '运输') {
      this.transportWay.forEach((e, i) => {
        e.disabled = true
        if (i == 0) e.checked = true
      });
    }

    this.handleShipmentBooks()

  }

  // 新申请和维修品 或 延期和运输 中点击确认触发的方法
  async sure() {
    this.newData.Shipment_Books = Number(this.newData.Shipment_Books)
    this.handleTransport_Mode()
    let exist = JSON.parse(JSON.stringify(this.newData))
    delete exist.Create_ID
    delete exist.Site

    if (this.title == '新申请' || this.title == '维修品') {
      delete exist.Transport_Mode
      // 查询已经存在的运输方式
      let existData = await this.http.getExist(exist)

      if (existData.status) {
        this.message.create('error', '输入的资料有误，请检查')
      } else {
        if (existData.length > 0) {
          this.handleTransport_Mode()

          if (this.newData.Transport_Mode.length < 1) {
            this.message.create('warning', '請至少選擇一種運輸方式')
          } else {
            let modalStatus = false

            this.transportWay.forEach(t => {
              t.Task_SN = ''

              existData.forEach(e => {
                // 本次选择的运输方式如果已经存在，打开提醒的模态框
                if (t.checked && t.label == e.Description_ZH) {
                  modalStatus = true
                }
                // 将重复资料的Task_SN加入transportWay,用于模态框的显示
                if (t.label == e.Description_ZH) {
                  t.Task_SN = e.Task_SN
                }
              });

            });

            this.isVisible = modalStatus
            // 未发现重复申请的运输方式，直接进入资料编辑
            if (!modalStatus)
              await this.handleOk()
          }

        } else {
          // 继续申请
          await this.handleOk()
        }
      }

    } else {

      // 处理延期和运输的逻辑
      exist.Transport_Mode = JSON.stringify(exist.Transport_Mode)
      // 获取延期或运输的table资料
      let data = await this.http.getPostponeTransport(exist)
      console.log(data);


      if (data.status) {
        this.message.create('error', '查询资料失败')
        return
      }

      if (data.length == 0) this.message.create('warning', '查询资料为空')

      if (data.length > 0) {
        this.message.create('success', '资料查询成功')
        this.sendData.next(data)
      }
    }

  }

  // 保存新申请和维修品的须填写资料
  async saveNewData() {
    this.handleTransport_Mode()
    // 维修品或者新申请提交后，返回的状态
    let res = await this.http.applicationRepair(this.newData)

    if (res.code == 200) {
      this.message.create('success', res.msg)
    } else {
      this.message.create('warning', res.msg)
    }
    this.generateTask.next(res.Task_SN)
  }

  // 处理Transport_Mode和Shipment_Books
  handleTransport_Mode() {
    this.newData.Transport_Mode = []
    this.transportWay.forEach(e => {
      if (e.checked) this.newData.Transport_Mode.push(e.value)
    });
    this.newData.Shipment_Books = Number(this.newData.Shipment_Books)
  }

  // 继续申请
  async handleOk() {
    this.isConfirmLoading = true;

    // 获取基本资料
    let baseData = await this.http.getNewApplyBaseData(this.newData)
    if (baseData.status) {
      this.message.error('获取基本资料失败')
      return
    } else {
      this.message.success('获取基本资料成功')
    }
    // 给information模块发送基本资料并且触发方法处理资料
    this.modalService.emitInfo({ type: 'newApplication', data: { status: true, data: baseData } })

    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  // 取消申请
  handleCancel(): void {
    this.isVisible = false;
  }

  handleShipmentBooks() {
    if (['新申请', '运输', '延期'].includes(this.title)) {
      this.newData.Shipment_Books = 0
      this.Shipment_Books = '生產賬冊'
    }

    if (['维修品'].includes(this.title)) {
      this.newData.Shipment_Books = 1
      this.Shipment_Books = '維修賬冊'
    }

  }

}
