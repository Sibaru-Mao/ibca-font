import { BasicSettingsComponent } from './basic-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const route: Routes = [{ path: '', component: BasicSettingsComponent }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class BasicSettingsModule { }
