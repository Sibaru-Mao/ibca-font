import { UploadComponent } from './upload/upload.component';
import { DeclareComponent } from './declare/declare.component';
import { SpecialArchitectureComponent } from './special-architecture/special-architecture.component';
import { ProductPackagingComponent } from './product-packaging/product-packaging.component';
import { DropReportComponent } from './drop-report/drop-report.component';
import { ChineseNameComponent } from './chinese-name/chinese-name.component';
import { BasicSettingsComponent } from './basic-settings/basic-settings.component';
import { BatteryInfoComponent } from './battery-info/battery-info.component';
import { Routes, RouterModule } from '@angular/router';
import { DataCenterComponent } from './data-center.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



const dataChild: Routes = [
  { path: '', redirectTo: 'batteryInfo', pathMatch: 'full' },
  { path: 'batteryInfo', component: BatteryInfoComponent },
  { path: 'basicSetting', component: BasicSettingsComponent },
  { path: 'chineseName', component: ChineseNameComponent },
  { path: 'dropReport', component: DropReportComponent },
  { path: 'productPacking', component: ProductPackagingComponent },
  { path: 'specialArchitecture', component: SpecialArchitectureComponent },
  { path: 'declare', component: DeclareComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'batteryInfo/seeEdit', loadChildren: () => import('./battery-info/see-edit/see-edit.module').then(e => e.SeeEditModule) },
  { path: 'batteryInfo/littleAdd', loadChildren: () => import('./battery-info/little-add/little-add.module').then(e => e.LittleAddModule) },
  { path: 'batteryInfo/totalAdd', loadChildren: () => import('./battery-info/total-add/total-add.module').then(e => e.TotalAddModule) }
]

const route: Routes = [{ path: '', component: DataCenterComponent, children: dataChild }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class DataCenterLaodModule { }
