import { ApplicationRepairComponent } from './../../../component/application-repair/application-repair.component';
import { ModalService } from './../../../../services/server/modal.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent implements OnInit {
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
