import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-report-detail',
  templateUrl: './order-report-detail.component.html',
  styleUrls: ['./order-report-detail.component.scss']
})
export class OrderReportDetailComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');

  constructor(@Inject(MAT_DIALOG_DATA) public data: { Orders: any },
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrderReportDetailComponent>) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }

}

