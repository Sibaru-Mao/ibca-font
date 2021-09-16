import { HttpService } from './../services/http.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getClientHeight()
  }

  getClientHeight() {
    let clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
      clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    sessionStorage.setItem('height', JSON.stringify(clientHeight))
  }

}
