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
  selectedImg = []
  tab = []
  contion: any = {}
  index: number = 1
  notSelectImg = []

  constructor(
    private modalService: ModalService,
    private http: DataService
  ) { }

  ngOnInit(): void {
    this.modalService.getSubject().subscribe(async res => {
      if (!res) { return }
      if (res.type == 'tableContion') {
        this.baseTab = await this.http.getNavigation(res.data)
        this.modalService.emitInfo({ type: 'navigation', data: { title: this.baseTab[this.index].taskName, index: this.index } })
        this.initImg()
      }
    })
  }

  selectTab(nowIndex) {
    if (nowIndex == 0) { return }
    this.modalService.emitInfo({ type: 'navigation', data: { title: this.baseTab[nowIndex].taskName, index: nowIndex } })
    this.tab[this.index].status = false
    this.tab[this.index].img = this.notSelectImg[this.index]
    this.tab[nowIndex].status = true
    this.tab[nowIndex].img = this.selectedImg[nowIndex - 1]
    this.index = nowIndex
  }

  // 初始化左边导航栏的数据
  initImg() {
    this.baseTab.forEach((e, i) => {
      e.img = `assets/imgs/navigation0${i + 1}.png`
      this.notSelectImg.push(e.img)
      if (i == this.index) { e.status = true }
      else { e.status = false }
    })
    this.tab = this.baseTab
    for (let i = 2; i <= 7; i++) {
      let img = `assets/imgs/Snavigation0${i}.png`
      this.selectedImg.push(img)
    }
    this.tab[this.index].img = this.selectedImg[0]
  }

}
