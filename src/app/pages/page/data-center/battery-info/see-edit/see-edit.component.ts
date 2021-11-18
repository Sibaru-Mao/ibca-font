import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// interface baseInfo {
//   battery_pn: string,
//   plant: string
// }

@Component({
  selector: 'app-see-edit',
  templateUrl: './see-edit.component.html',
  styleUrls: ['./see-edit.component.css']
})
export class SeeEditComponent implements OnInit {
  baseInfo: any

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.baseInfo = res
      console.log(this.baseInfo);
    })
  }

}
