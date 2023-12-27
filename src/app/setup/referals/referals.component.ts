import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddReferalComponent } from '../add-referal/add-referal.component';

@Component({
  selector: 'app-referals',
  templateUrl: './referals.component.html',
  styleUrls: ['./referals.component.scss']
})
export class ReferalsComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addReferal(): void {
    const dialogRef = this.dialog.open(AddReferalComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
