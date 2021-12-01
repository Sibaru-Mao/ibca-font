import { ConfigServiceService } from './../../../services/configService/config-service.service';
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
  version: string
  navigationBar = [
    { name: '任務管理', link: 'taskManagement' },
    { name: '資料中心', link: 'dataCenter' },
    { name: '申請', link: 'apply' }
  ]
  man: any = JSON.parse(sessionStorage.getItem('man'))

  constructor(
    private keycloak: KeycloakService,
    private app: AppComponent,
    private configServe: ConfigServiceService
  ) { }

  ngOnInit(): void {
    this.version = this.configServe.getSpecificConfigure('datasources').version
  }

  logout() {
    this.keycloak.logout();
  }

  changeLanguage() {
    this.app.changeLanguage(this.language)
  }

}
