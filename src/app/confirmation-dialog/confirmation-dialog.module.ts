import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        
    ],
    declarations: [
        ConfirmationDialogComponent
    ],
    exports: [ConfirmationDialogComponent],
    entryComponents: [ConfirmationDialogComponent],
    providers: [ConfirmationDialogService]
  })
  export class ConfirmDialogModule {
  }