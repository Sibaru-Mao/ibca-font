import { Routes, RouterModule } from '@angular/router';
import { SpecialArchitectureComponent } from './special-architecture.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const route: Routes = [{ path: '', component: SpecialArchitectureComponent }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class SpecialArchitectureModule { }
