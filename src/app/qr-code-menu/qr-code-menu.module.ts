import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QRCodeMenuRoutingModule } from './qr-code-menu-routing.module';
import { QRCodeMenuComponent } from './qr-code-menu.component';


@NgModule({
  declarations: [
    QRCodeMenuComponent
  ],
  imports: [
    CommonModule,
    QRCodeMenuRoutingModule
  ]
})
export class QRCodeMenuModule {

  showFiller = false;
  classApplied = false;


  toggleClass() {
    this.classApplied = !this.classApplied;
  }

 }
