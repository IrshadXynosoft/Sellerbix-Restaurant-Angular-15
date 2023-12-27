import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map-loyalty-group',
  templateUrl: './map-loyalty-group.component.html',
  styleUrls: ['./map-loyalty-group.component.scss']
})
export class MapLoyaltyGroupComponent implements OnInit {
  modifierErrors: any = [];
  customerData: any = []
  customerArray: any = [];
  customerSelectedArray: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: any }, private httpService: HttpServiceService, private snackBService: SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<MapLoyaltyGroupComponent>, public formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.getMappedCustomers()
  }

  getMappedCustomers() {
    this.httpService.get('loyalty-customers' + '/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          result.data?.forEach((element: any) => {
            this.customerData.push({ 'id': element.customer_id, 'name': element.customer.name });
            this.customerSelectedArray.push(element.customer_id)
          });
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  searchContactNumber(contactNumber: any) {
    if (contactNumber.length > 0) {
      this.httpService.get('getCustomerBysearch/' + contactNumber)
        .subscribe(result => {
          if (result.status == 200) {
            this.customerArray = [];
            if (result.data.length > 0) {
              this.customerArray = result.data;
            }
            else {
              this.customerArray.push(
                { id: 0, contact_no: 'Not found', name: '' }
              )
            }
          } else {
            console.log("Error while fetching customer details");
          }
        });
    }
    else {
      this.customerArray = [];
    }
  }

  customerSelected(option: any, input: HTMLInputElement) {
    if (option.id != 0) {
      if (this.customerSelectedArray.includes(option.id)) {
        this.snackBService.openSnackBar('Customer already added', "Close");
      }
      else {
        this.customerSelectedArray.push(option.id);
        this.customerData.push(option)
      }
    }
    input.value = '';
    input.blur();
  }

  remove(data: any): void {
    const index = this.customerData.indexOf(data);
    if (index >= 0) {
      this.customerSelectedArray.splice(index, 1);
      this.customerData.splice(index, 1);
    }
  }

  addCustomers() {
    if (this.customerSelectedArray.length > 0) {
      let body = {
        customer_id: this.customerSelectedArray
      }
      this.httpService.post('update-loyalty-customers' + '/' + this.data.id, body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }
}
