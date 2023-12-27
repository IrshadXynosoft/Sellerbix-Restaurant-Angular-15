import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-map-user-printer',
  templateUrl: './map-user-printer.component.html',
  styleUrls: ['./map-user-printer.component.scss']
})
export class MapUserPrinterComponent implements OnInit {
  availablePrinters: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: { user_id: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<MapUserPrinterComponent>, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private httpService: HttpServiceService, private dialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getAvailablePrinters();
  }

  getAvailablePrinters() {
    this.httpService.get('invoice-printers', false)
      .subscribe(result => {
        if (result.status == 200) {
          result.data.forEach((obj: any) => {
            this.availablePrinters.push({ 'name': obj.printer.name, 'printer_id': obj.printer.id, 'status': false })
          });
          this.getAssignedPrinters();
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  getAssignedPrinters() {
    this.httpService.get('user-printer/' + this.data.user_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.availablePrinters.forEach((obj: any) => {
            result.data.forEach((obj1: any) => {
              if (obj.printer_id == obj1.printer_id) {
                obj.status = true;
              }
            });

          });
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  changePrinter(event: any, item: any) {
    if (event.checked) {
      item.status = true;
    }
    else {
      item.status = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  savePrinter() {
    let selectedPrinters: any = [];
    this.availablePrinters.forEach((obj: any) => {
      if (obj.status == true) {
        selectedPrinters.push(obj.printer_id)
      }
    });
    let body = {
      'user_id': this.data.user_id,
      'printer': selectedPrinters
    }
    this.httpService.post('user-printer', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.close()
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }
}
