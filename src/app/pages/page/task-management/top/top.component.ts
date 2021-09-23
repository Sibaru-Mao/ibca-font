import { ModalService } from './../../../../services/server/modal.service';
import { DataService } from './../../../../services/data.service';
import { Component, OnInit } from '@angular/core';

interface search {
  Project_Code: string
  Battery_PN: string
  Demand_Year: string
  Transport_Mode_Desc: string
}

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  //勾选框右边的厂区名字
  plantName: Array<any> = []
  searchInfo: search = {
    Project_Code: '',
    Battery_PN: '',
    Demand_Year: 'all',
    Transport_Mode_Desc: 'all'
  }
  year: Array<any> = []
  deliveryMode: Array<any> = []

  constructor(private http: DataService, private modalService: ModalService) { }

  async ngOnInit() {
    await this.initPlantYearDelivery()
    // setTimeout(() => {
    this.sendSearch()
    // },150);
  }

  // 初始化plantName、year、deliveryMode
  async initPlantYearDelivery() {
    this.plantName = [{ Plant: 'ALL', PlantCode: 'ALL', status: true }]
    let plant = await this.http.getPlant()
    this.plantName.push(...plant)
    sessionStorage.setItem('plant', JSON.stringify(this.plantName))

    this.plantName.forEach(e => { e['status'] = true })

    this.year = [{ Demand_Year: "all" }]
    this.year.push(...await this.http.getYear())

    this.deliveryMode = [{ Transport_Mode_Desc: "all", Transport_Mode: 'all' },]
    this.deliveryMode.push(...await this.http.getDliveryMode())
  }

  // 选择plant触发的方法
  async choicePlant(key, status) {
    if (key == 0) {
      if (status == false) {
        this.plantName.forEach(e => { e['status'] = true })
      } else {
        this.plantName.forEach(e => { e['status'] = false })
      }
    } else {
      this.plantName[key]['status'] = !this.plantName[key]['status']
      if (status == true) {
        this.plantName[0]['status'] = false
      } else {
        let status = true
        this.plantName.forEach((e, i) => { if (i != 0 && e['status'] == false) status = false })
        this.plantName[0]['status'] = status
      }
    }
  }

  // 鼠标悬浮在右边勾选框或者右边plant名字上面触发的方法
  chang(item, index) {
    let dotWord = document.getElementsByClassName('dot-word')
    let dot = document.getElementsByClassName('dot')
    if (item) {
      dotWord[index].setAttribute('style', 'font-size:18px')
      dot[index].setAttribute('style', 'box-shadow: 0 0 10px #41D9D9;width: 20px;height: 20px;background-size: 19px;')
    } else {
      dotWord[index].setAttribute('style', 'font-size:12px')
      dot[index].setAttribute('style', 'width: 14px;height: 14px;background-size: 13px;')
    }
  }

  // 点击搜索按钮触发的方法
  sendSearch() {
    let condition = { Plant: [], Project_Code: '', Battery_PN: '', Demand_Year: '', Transport_Mode_Desc: '' }
    this.plantName.forEach((e, i) => { if (i > 0 && e.status) condition.Plant.push(e.PlantCode) })
    condition.Project_Code = !this.searchInfo.Project_Code ? null : this.searchInfo.Project_Code
    condition.Battery_PN = !this.searchInfo.Battery_PN ? null : this.searchInfo.Battery_PN
    condition.Demand_Year = this.searchInfo.Demand_Year
    condition.Transport_Mode_Desc = this.searchInfo.Transport_Mode_Desc
    this.modalService.emitInfo({ type: 'tableContion', data: condition })
  }

}
