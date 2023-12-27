import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';


@Component({
  selector: 'app-show-reservations',
  templateUrl: './show-reservations.component.html',
  styleUrls: ['./show-reservations.component.scss'],
})
export class ShowReservationsComponent implements OnInit {
  branch_id: any;
  historyArray: any = [];
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ShowReservationsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { reservationList: any },
  ) {
  
  }

  ngOnInit(): void {
   
  }
  close() {
    this.dialogRef.close();
  }

}
