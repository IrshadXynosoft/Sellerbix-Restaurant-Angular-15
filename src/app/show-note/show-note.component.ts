import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-note',
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss']
})
export class ShowNoteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: any, note: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<ShowNoteComponent>) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
}
