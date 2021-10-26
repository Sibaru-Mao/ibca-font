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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import * as configjson from '../assets/config/config.json';
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


registerLocaleData(zh);
function initializeKeycloak(keycloak: KeycloakService) {
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

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function configureProvider(loader: ConfigServiceService): () => Promise<void> {
  return async () => {
    await loader.loadConfigure([
      { path: 'assets/config/config.json', type: 'datasources' }
    ]);
  };
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
    ApplicationRepairComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxLoadingModule,
    NgxEchartsModule,
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
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    ModalService,
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configureProvider,
      deps: [ConfigServiceService],
      multi: true
    }
  ]
})
export class AppModule { }
