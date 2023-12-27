import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddAlternativeComponent } from '../add-alternative/add-alternative.component';

@Component({
  selector: 'app-alternate-language',
  templateUrl: './alternate-language.component.html',
  styleUrls: ['./alternate-language.component.scss']
})
export class AlternateLanguageComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addAlternative(): void {
    const dialogRef = this.dialog.open(AddAlternativeComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
