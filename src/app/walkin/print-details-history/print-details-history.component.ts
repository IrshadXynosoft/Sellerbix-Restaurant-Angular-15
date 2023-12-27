import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-details-history',
  templateUrl: './print-details-history.component.html',
  styleUrls: ['./print-details-history.component.scss']
})
export class PrintDetailsHistoryComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PrintDetailsHistoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      print:any;
    }
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  modifiercheck(modifierList: any) {
    let flag = false;
    for (let list of modifierList) {
      if (list.status) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  canPrintExists(): boolean {
    return this.data.print && this.data.print.some((item: { canPrint: any; }) => item.canPrint);
  }
}
