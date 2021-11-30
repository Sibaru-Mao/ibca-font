import { TransportComponent } from './pages/page/apply/transport/transport.component';
import { RepairComponent } from './pages/page/apply/repair/repair.component';
import { PostponeComponent } from './pages/page/apply/postpone/postpone.component';
import { NewApplicationComponent } from './pages/page/apply/new-application/new-application.component';
import { ApplyComponent } from './pages/page/apply/apply.component';
import { TaskManagementComponent } from './pages/page/task-management/task-management.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './AuthGuard/authGuardA';


const applyChild = [
  { path: '', redirectTo: 'newApplication', pathMatch: 'full' },
  { path: 'newApplication', component: NewApplicationComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'postpone', component: PostponeComponent },
  { path: 'transport', component: TransportComponent },
]

const mainPart: Routes = [
  { path: '', redirectTo: 'taskManagement', pathMatch: 'full' },
  { path: 'taskManagement', component: TaskManagementComponent },
  {
    path: 'dataCenter', loadChildren: () => import('./pages/page/data-center/data-center-laod.module').then(e => e.DataCenterLaodModule)
  },
  { path: 'apply', component: ApplyComponent, children: applyChild },
  { path: 'information', loadChildren: () => import('./pages/page/task-management/information/information-load.module').then(e => e.InformationLoadModule) },
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
