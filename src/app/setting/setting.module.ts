import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule
  ]
})
export class SettingModule { }
