import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-special-architecture',
  templateUrl: './special-architecture.component.html',
  styleUrls: ['./special-architecture.component.css']
})
export class SpecialArchitectureComponent implements OnInit {
  constructor(private routerInfo: ActivatedRoute) { }

  ngOnInit(): void {
    // this.index = this.routerInfo.snapshot.queryParams["id"]
  }

}
