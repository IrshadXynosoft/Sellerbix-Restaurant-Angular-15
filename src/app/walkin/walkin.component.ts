import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from './add-item/add-item.component';

@Component({
  selector: 'app-walkin',
  templateUrl: './walkin.component.html',
  styleUrls: ['./walkin.component.scss']
})
export class WalkinComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  add(): void {
    const dialogRef = this.dialog.open(AddItemComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
