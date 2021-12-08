import { InformationLoadModule } from './pages/page/task-management/information/information-load.module';
import { DataCenterLaodModule } from './pages/page/data-center/data-center-laod.module';
import { SpecialChineseComponent } from './pages/component/special-chinese/special-chinese.component';
import { ModalService } from './services/server/modal.service';
import { ConfigServiceService } from './services/configService/config-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxEchartsModule } from 'ngx-echarts';
import { HeaderComponent } from './pages/component/header/header.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TaskManagementComponent } from './pages/page/task-management/task-management.component';
import { DataCenterComponent } from './pages/page/data-center/data-center.component';
import { ApplyComponent } from './pages/page/apply/apply.component';
import { NavigationComponent } from './pages/page/task-management/navigation/navigation.component';
import { TopComponent } from './pages/page/task-management/top/top.component';
import { RightContentComponent } from './pages/page/task-management/right-content/right-content.component';
import { InformationComponent } from './pages/page/task-management/information/information.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { BatteryInfoComponent } from './pages/page/data-center/battery-info/battery-info.component';
import { ProductPackagingComponent } from './pages/page/data-center/product-packaging/product-packaging.component';
import { DropReportComponent } from './pages/page/data-center/drop-report/drop-report.component';
import { BasicSettingsComponent } from './pages/page/data-center/basic-settings/basic-settings.component';
import { SpecialArchitectureComponent } from './pages/page/data-center/special-architecture/special-architecture.component';
import { ChineseNameComponent } from './pages/page/data-center/chinese-name/chinese-name.component';
import { NewApplicationComponent } from './pages/page/apply/new-application/new-application.component';
import { RepairComponent } from './pages/page/apply/repair/repair.component';
import { PostponeComponent } from './pages/page/apply/postpone/postpone.component';
import { TransportComponent } from './pages/page/apply/transport/transport.component';
import { ApplicationRepairComponent } from './pages/component/application-repair/application-repair.component';
import { ListComponent } from './pages/component/list/list.component';
import { DeclareComponent } from './pages/page/data-center/declare/declare.component';
import { UploadComponent } from './pages/page/data-center/upload/upload.component';
import { SeeEditComponent } from './pages/page/data-center/battery-info/see-edit/see-edit.component';
import { SeeEditTableComponent } from './pages/page/data-center/battery-info/see-edit-table/see-edit-table.component';
import { LittleAddComponent } from './pages/page/data-center/battery-info/little-add/little-add.component';
import { PhotoEditComponent } from './pages/page/data-center/battery-info/photo-edit/photo-edit.component';
import { TotalAddComponent } from './pages/page/data-center/battery-info/total-add/total-add.component';
import { GetFileNamePipe, AddNamePipe } from './services/pipe/common-pipe.pipe';
import { GetIntNumDirective } from './services/directive/directive.directive';



export function configureProvider(loader: ConfigServiceService): () => Promise<void> {
  return async () => {
    await loader.loadConfigure([
      { path: 'assets/config/config.json', type: 'datasources' }
    ]);
  };
}

registerLocaleData(zh);

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

function initializeKeycloak(keycloak: KeycloakService) {
  const configjson = JSON.parse(sessionStorage.getItem('config'))
  return () =>
    keycloak.init({
      config: {
        url: configjson.wkskeycloak.url,
        realm: configjson.wkskeycloak.realm,
        clientId: configjson.wkskeycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silentCheckSso.html',
      },
    });
}

window.onload = function () {
  let url = document.location.href
  let time = new Date().getMinutes()
  time = time.toString().length > 1 ? time : Number('0' + time)
  if (url.indexOf('yes') == -1) {
    window.location.href = url + `?yes=${time}`
    // window.open(url + `?yes=${time}`)
  }
  // else {
  //   let num = Number((url.substr(url.indexOf('yes') + 4, 2)))
  //   if (time != num)
  //     window.location.href = url + `?yes=${time}`
  // }
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    TaskManagementComponent,
    DataCenterComponent,
    ApplyComponent,
    NavigationComponent,
    TopComponent,
    RightContentComponent,
    InformationComponent,
    BatteryInfoComponent,
    ProductPackagingComponent,
    DropReportComponent,
    BasicSettingsComponent,
    SpecialArchitectureComponent,
    ChineseNameComponent,
    SpecialChineseComponent,
    NewApplicationComponent,
    RepairComponent,
    PostponeComponent,
    TransportComponent,
    ApplicationRepairComponent,
    ListComponent,
    DeclareComponent,
    UploadComponent,
    SeeEditComponent,
    SeeEditTableComponent,
    LittleAddComponent,
    PhotoEditComponent,
    TotalAddComponent,
    GetFileNamePipe,
    AddNamePipe,
    GetIntNumDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxLoadingModule,
    NgxEchartsModule,
    NzSpinModule,
    NzButtonModule,
    NzSelectModule,
    NzTableModule,
    KeycloakAngularModule,
    NzTabsModule,
    NzPopoverModule,
    NzModalModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzMessageModule,
    NzCheckboxModule,
    HttpClientModule,
    NzRadioModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DataCenterLaodModule,
    InformationLoadModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configureProvider,
      deps: [ConfigServiceService],
      multi: true
    },
    ModalService,
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ]
})
export class AppModule { }
