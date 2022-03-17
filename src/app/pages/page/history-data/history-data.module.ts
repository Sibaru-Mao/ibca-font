import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HistoryDataComponent } from './history-data.component';

const child: Routes = [
  { path: '', redirectTo: 'historyTask', pathMatch: 'full' },
  { path: 'historyTask', loadChildren: () => import('./history-task/history-task.module').then(e => e.HistoryTaskModule) }
]

const route: Routes = [{ path: '', component: HistoryDataComponent, children: child }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class HistoryDataModule { }
