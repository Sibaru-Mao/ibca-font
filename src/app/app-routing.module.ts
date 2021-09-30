import { TransportComponent } from './pages/page/apply/transport/transport.component';
import { RepairComponent } from './pages/page/apply/repair/repair.component';
import { PostponeComponent } from './pages/page/apply/postpone/postpone.component';
import { NewApplicationComponent } from './pages/page/apply/new-application/new-application.component';
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

const applyChild = [
  { path: '', redirectTo: 'newApplication', pathMatch: 'full' },
  { path: 'newApplication', component: NewApplicationComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'postpone', component: PostponeComponent },
  { path: 'transport', component: TransportComponent },
]

const mainPart: any = [
  { path: '', redirectTo: 'taskManagement', pathMatch: 'full' },
  { path: 'taskManagement', component: TaskManagementComponent },
  { path: 'dataCenter', component: DataCenterComponent, children: dataChild },
  { path: 'apply', component: ApplyComponent, children: applyChild },
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
