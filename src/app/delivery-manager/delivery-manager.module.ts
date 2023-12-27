import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../material-module';
import { DeliveryManagerRoutingModule } from './delivery-manager-routing.module';
import { DeliveryManagerComponent } from './delivery-manager.component';


@NgModule({
  declarations: [
    DeliveryManagerComponent
  ],
  imports: [
    CommonModule,
    DeliveryManagerRoutingModule,
    DemoMaterialModule
  ]
})
export class DeliveryManagerModule { }
