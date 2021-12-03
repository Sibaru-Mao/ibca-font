import { HomepageComponent } from './homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './AuthGuard/authGuardA';

const mainPart: Routes = [
  { path: '', redirectTo: 'taskManagement', pathMatch: 'full' },
  {
    path: 'taskManagement', loadChildren: () => import('./pages/page/task-management/task-management.module')
      .then(e => e.TaskManagementModule)
  },
  {
    path: 'dataCenter', loadChildren: () => import('./pages/page/data-center/data-center-laod.module')
      .then(e => e.DataCenterLaodModule)
  },
  {
    path: 'apply', loadChildren: () => import('./pages/page/apply/apply.module')
      .then(e => e.ApplyModule)
  },
  {
    path: 'information', loadChildren: () => import('./pages/page/task-management/information/information-load.module')
      .then(e => e.InformationLoadModule)
  },
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
