import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-see-edit',
  templateUrl: './see-edit.component.html',
  styleUrls: ['./see-edit.component.css']
})
export class SeeEditComponent implements OnInit {
  baseInfo: any
  photoData: any

  constructor(
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(async res => {
      this.baseInfo = res
    })
  }

  goBack() {
    history.go(-1)
  }

  sendPhoto(event) {
    this.photoData = event
  }

}
