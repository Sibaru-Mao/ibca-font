import { AppComponent } from './../../../app.component';
import { DataService } from './../../../services/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  language: string = 'tc'
  version: string
  navigationBar = [
    { name: '任務管理', link: 'taskManagement' },
    { name: '資料中心', link: 'dataCenter' },
    { name: '申請', link: 'apply' }
  ]
  man: any = JSON.parse(sessionStorage.getItem('man'))

  constructor(
    private router: Router,
    private keycloak: KeycloakService,
    private http: DataService,
    private app: AppComponent,
  ) { }

  ngOnInit(): void { }

  // selectNavigate(item) {
  //   this.navigationBar.forEach((e) => { e.status = false })
  //   item.status = true
  //   this.router.navigate([item.link])
  // }


  logout() {
    this.keycloak.logout();
  }

  changeLanguage() {
    this.app.changeLanguage(this.language)
  }

}
