import { ModalService } from './../../../../services/server/modal.service';
import { DataService } from './../../../../services/data.service';
import { Component, OnInit } from '@angular/core';

interface search {
  Task_SN: string
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
  plantName: Array<any> = []
  searchInfo: search = {
    Task_SN: '',
    Project_Code: '',
    Battery_PN: '',
    Demand_Year: 'all',
    Transport_Mode_Desc: 'all'
  }
  year: Array<any> = []
  deliveryMode: any[] = []
  man: any = JSON.parse(sessionStorage.getItem('man'))
  manAllInfo = JSON.parse(sessionStorage.getItem('manAllInfo'))

  constructor(private http: DataService, private modalService: ModalService) { }

  async ngOnInit() {
    await this.initPlantYearDelivery()
    if (sessionStorage.getItem('nowPlant')) {
      this.plantName.forEach(e => {
        if (e.PlantCode == JSON.parse(sessionStorage.getItem('nowPlant')).PlantCode) {
          e.status = true
        }
      })
    } else {
      this.plantName[0].status = true
      sessionStorage.setItem('nowPlant', JSON.stringify(this.plantName[0]))
    }
    this.sendSearch()
  }

  // 初始化plantName、year、deliveryMode
  async initPlantYearDelivery() {
    this.plantName = await this.http.getPlant()
    this.plantName = this.plantName.filter(e => { return Object.keys(this.manAllInfo.Permission).includes(e.PlantCode) })
    let allPlant = [{ Plant: 'ALL', PlantCode: 'ALL', status: true }]
    allPlant.push(...this.plantName)
    sessionStorage.setItem('plant', JSON.stringify(allPlant))
    this.year = [{ Demand_Year: "all" }]
    const time = new Date()
    const nowYear = time.getFullYear()
    const yearData = [{ Demand_Year: `${nowYear}` }, { Demand_Year: `${nowYear + 1}` }]
    this.year.push(...yearData)
    sessionStorage.setItem('year', JSON.stringify(this.year))
    this.deliveryMode = [{ Transport_Mode_Desc: "all", Transport_Mode: 'all' },]
    const allDeliveryMode = await this.http.getDliveryMode()
    this.deliveryMode.push(...allDeliveryMode.filter(e => { return e.Transport_Mode_Desc }))
  }

  // 选择plant触发的方法
  async choicePlant(key, status) {
    if (!status) {
      this.plantName.forEach(element => {
        element.status = false
      });
      this.plantName[key]['status'] = true
    }
    sessionStorage.setItem('nowPlant', JSON.stringify(this.plantName[key]))
    this.man.Permission = this.manAllInfo.Permission[this.plantName[key].PlantCode]
    sessionStorage.setItem('man', JSON.stringify(this.man))
    await this.sendSearch()
  }

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
    let condition = { Plant: [], Task_SN: '', Project_Code: '', Battery_PN: '', Demand_Year: '', Transport_Mode_Desc: '' }
    this.plantName.forEach((e, i) => { if (e.status) condition.Plant.push(e.PlantCode) })
    condition.Task_SN = !this.searchInfo.Task_SN ? null : this.searchInfo.Task_SN
    condition.Project_Code = !this.searchInfo.Project_Code ? null : this.searchInfo.Project_Code
    condition.Battery_PN = !this.searchInfo.Battery_PN ? null : this.searchInfo.Battery_PN
    condition.Demand_Year = this.searchInfo.Demand_Year
    condition.Transport_Mode_Desc = this.searchInfo.Transport_Mode_Desc
    this.modalService.emitInfo({ type: 'tableContion', data: condition })
  }

}
