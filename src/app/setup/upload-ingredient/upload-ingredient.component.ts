import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-ingredient',
  templateUrl: './upload-ingredient.component.html',
  styleUrls: ['./upload-ingredient.component.scss']
})
export class UploadIngredientComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<UploadIngredientComponent>) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
}
