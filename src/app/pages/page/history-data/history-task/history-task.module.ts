import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryTaskComponent } from './history-task.component';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [{ path: '', component: HistoryTaskComponent }]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class HistoryTaskModule { }
