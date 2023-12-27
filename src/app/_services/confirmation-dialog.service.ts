import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {
  [x: string]: any;
  constructor(private dialog: MatDialog) { }
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;
  public open(options: any) { // for delete dialog
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    });
  }

  public notification(options: any) { // for notification dialog
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        confirmText: options.confirmText
      }
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  public close() {
     this.dialog.closeAll()
  }
}
