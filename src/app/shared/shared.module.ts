import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { InventoryHeaderComponent } from './inventory-header/inventory-header.component';
import { DemoMaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    InventoryHeaderComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HeaderComponent,
    InventoryHeaderComponent,
  ]
})
export class SharedModule { }
