import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chinese-name',
  templateUrl: './chinese-name.component.html',
  styleUrls: ['./chinese-name.component.css']
})
export class ChineseNameComponent implements OnInit {
  @Input() id: number
  constructor() { }

  ngOnInit(): void {

  }


}
