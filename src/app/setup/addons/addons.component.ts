import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QrcodeMenuComponent } from '../qrcode-menu/qrcode-menu.component';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss']
})
export class AddonsComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['setup'])
  }
 
}
