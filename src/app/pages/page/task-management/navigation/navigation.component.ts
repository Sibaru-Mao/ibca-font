import { DataService } from './../../../../services/data.service';
import { ModalService } from './../../../../services/server/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  baseTab = []
  flowName = ['任務總數量', '獲取資料', '待RPA讀取', '填寫委托', '待接收', '檢驗中', '待上傳PDF']
  selectedImg = []
  tab = []
  contion: any = {}
  index: number = 1

  constructor(
    private modalService: ModalService,
    private http: DataService
  ) { }

  ngOnInit(): void {
    this.modalService.getSubject().subscribe(async res => {
      if (!res) { console.log('navigationModalService:', res); return }
      if (res.type == 'tableContion') {
        this.baseTab = await this.http.getNavigation(res.data)
        this.modalService.emitInfo({ type: 'navigation', data: { title: this.baseTab[this.index].taskName, index: this.index } })
        this.initImg()
      }
    })
  }

  // 点击导航栏后的操作
  selectTab(nowIndex) {
    if (nowIndex == 0) { return }
    this.index=nowIndex
    // 组件之间进行交互
    this.modalService.emitInfo({ type: 'navigation', data: { title: this.baseTab[nowIndex].taskName, index: nowIndex } })
    this.tab = this.clone(this.baseTab)
    this.tab.forEach(e => { e.status = false })
    this.tab[nowIndex].status = true
    this.tab[nowIndex].img = this.selectedImg[nowIndex - 1]
  }

  // 初始化左边导航栏的数据
  initImg() {
    this.baseTab.forEach((e, i) => {
      e.img = `assets/imgs/navigation0${i + 1}.png`
      if (i == this.index) { e.status = true }
      else { e.status = false }
    })
    this.tab = this.clone(this.baseTab)
    for (let i = 2; i <= 7; i++) {
      let img = `assets/imgs/Snavigation0${i}.png`
      this.selectedImg.push(this.clone(img))
    }
    this.tab[this.index].img = this.selectedImg[0]
  }

  // 实现不含function的深拷贝
  clone(data) {
    return JSON.parse(JSON.stringify(data))
  }

}
