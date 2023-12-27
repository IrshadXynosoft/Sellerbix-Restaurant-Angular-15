import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { UploadRoutingModule } from './upload-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    UploadComponent
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
    SharedModule
  ]
})
export class UploadModule { }
