import { InformationComponent } from './../../task-management/information/information.component';
import { ApplicationRepairComponent } from './../../../component/application-repair/application-repair.component';
import { ModalService } from './../../../../services/server/modal.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {
  @ViewChild('appRe') appRe: ApplicationRepairComponent
  @ViewChild('information') information: InformationComponent
  show: boolean = false
  loading: boolean = false
  Task_SN: string = ''
  showModal: boolean = false
  selectedTransport_Mode: number[]

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.show = false
    this.modalService.getSubject().subscribe(res => {
      if (!res) return
      if (res.type == 'newApplication') this.show = res.data.status
    })
  }

  async saveNewData() {
    this.loading = true
    this.Task_SN = await this.appRe.saveNewData()
    if (!this.Task_SN)
      this.loading = false
  }

  async generateTask(Task_SN) {
    const status = await this.information.generateTask(Task_SN)
    if (status)
      this.showModal = true
    this.loading = false
  }

  getTransport_Mode(event) {
    this.selectedTransport_Mode = event
  }

  back() {
    this.appRe.initData()
    this.show = false
    this.showModal = false
  }

}
