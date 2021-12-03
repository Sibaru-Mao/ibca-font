import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewApplicationComponent } from './new-application.component';

const route: Routes = [{ path: '', component: NewApplicationComponent }]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class NewApplicationModule { }
