import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  language: string = 'tc'
  navigationBar = [
    { name: '任務管理', link: 'taskManagement' },
    { name: '資料中心', link: 'dataCenter' },
    { name: '申請', link: 'apply' },
    { name: '歷史資料', link: 'historyData' }
  ]
  man: any = JSON.parse(sessionStorage.getItem('man'))

  constructor(
    private keycloak: KeycloakService,
    private app: AppComponent,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    let url = (document.location.href).split('?yes')[0]
    window.location.href = url
    this.keycloak.logout();
  }

  changeLanguage() {
    this.app.changeLanguage(this.language)
  }

}
