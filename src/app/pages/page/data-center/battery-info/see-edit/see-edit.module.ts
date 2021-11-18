import { Routes, RouterModule } from '@angular/router';
import { SeeEditComponent } from './see-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const route: Routes = [{ path: '', component: SeeEditComponent }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class SeeEditModule { }
