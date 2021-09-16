import { SpecialArchitectureComponent } from './pages/page/data-center/special-architecture/special-architecture.component';
import { ProductPackagingComponent } from './pages/page/data-center/product-packaging/product-packaging.component';
import { DropReportComponent } from './pages/page/data-center/drop-report/drop-report.component';
import { ChineseNameComponent } from './pages/page/data-center/chinese-name/chinese-name.component';
import { BasicSettingsComponent } from './pages/page/data-center/basic-settings/basic-settings.component';
import { BatteryInfoComponent } from './pages/page/data-center/battery-info/battery-info.component';
import { InformationComponent } from './pages/page/task-management/information/information.component';
import { ApplyComponent } from './pages/page/apply/apply.component';
import { DataCenterComponent } from './pages/page/data-center/data-center.component';
import { TaskManagementComponent } from './pages/page/task-management/task-management.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './AuthGuard/authGuardA';

const dataChild: any = [
  { path: '', redirectTo: 'batteryInfo', pathMatch: 'full' },
  { path: 'batteryInfo', component: BatteryInfoComponent },
  { path: 'basicSetting', component: BasicSettingsComponent },
  { path: 'chineseName', component: ChineseNameComponent },
  { path: 'dropReport', component: DropReportComponent },
  { path: 'productPacking', component: ProductPackagingComponent },
  { path: 'specialArchitecture', component: SpecialArchitectureComponent },
]

const mainPart: any = [
  { path: '', redirectTo: 'taskManagement', pathMatch: 'full' },
  { path: 'taskManagement', component: TaskManagementComponent },
  {
    path: 'dataCenter', component: DataCenterComponent, children: dataChild
  },
  { path: 'apply', component: ApplyComponent },
  { path: 'information', component: InformationComponent },
]

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard], children: mainPart },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
