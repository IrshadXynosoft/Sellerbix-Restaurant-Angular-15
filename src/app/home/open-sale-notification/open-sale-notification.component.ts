import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-open-sale-notification',
  templateUrl: './open-sale-notification.component.html',
  styleUrls: ['./open-sale-notification.component.scss']
})
export class OpenSaleNotificationComponent implements OnInit {
  branch_id = this.localservice.get('branch_id');
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private router: Router, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { openingBalance: any }, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<OpenSaleNotificationComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
    this.router.navigate(['accounts/daybook'])
  }


}

