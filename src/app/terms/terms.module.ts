import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    TermsRoutingModule,
    SharedModule
  ]
})
export class TermsModule { }
