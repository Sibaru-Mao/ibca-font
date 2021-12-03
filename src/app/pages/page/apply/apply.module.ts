import { Routes, RouterModule } from '@angular/router';
import { ApplyComponent } from './apply.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


const applyChild: Routes = [
  { path: '', redirectTo: 'newApplication', pathMatch: 'full' },
  { path: 'newApplication', loadChildren: () => import('./new-application/new-application.module').then(e => e.NewApplicationModule) },
  { path: 'repair', loadChildren: () => import('./repair/repair.module').then(e => e.RepairModule) },
  { path: 'postpone', loadChildren: () => import('./postpone/postpone.module').then(e => e.PostponeModule) },
  { path: 'transport', loadChildren: () => import('./transport/transport.module').then(e => e.TransportModule) },
]

const route: Routes = [{ path: '', component: ApplyComponent, children: applyChild }]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class ApplyModule { }
