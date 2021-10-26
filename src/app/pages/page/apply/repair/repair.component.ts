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
  show: boolean = false

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.show = false
    this.modalService.getSubject().subscribe(res => {
      if (!res) return
      if (res.type == 'newApplication') this.show = res.data.status
    })
  }

  async saveNewData() {
    await this.appRe.saveNewData()
  }

}
