import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { EditPaymentComponent } from '../edit-payment/edit-payment.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface PaymentType {
  id: any,
  name: any,
  reference: any,
  is_default: any
  secondary_name: any
}
@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit, AfterViewInit {
  paymentrecords: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private snackBService: SnackBarService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private dialogService: ConfirmationDialogService) { }
  public displayedColumns: string[] = ['index', 'Icon', 'Name', 'Isdefault','isWeb', 'action'];
  public dataSource = new MatTableDataSource<PaymentType>();
  ngOnInit(): void {
    this.getPaymentType();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addPayment(): void {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPaymentType();
    });
  }

  editPayment(id: any, reference: any, name: any, secondary_name: any): void {
    const dialogRef = this.dialog.open(EditPaymentComponent, {
      width: '500px',
      data: {
        payment_id: id,
        payment_reference: reference,
        payment_name: name,
        secondary_name: secondary_name
      }
    });
    /* here data is passing with dialogue box*/
    dialogRef.afterClosed().subscribe(result => {
      this.getPaymentType();
    });
  }


  deletepaymenttype(id: any, name: any) {
    const options = {
      title: 'Delete Payment Types',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('payment-type' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Payment Type Deleted Successfully!!", "Close");
              this.getPaymentType();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }

  getPaymentType() {
    this.httpService.get('payment-type')
      .subscribe(result => {
        if (result.status == 200) {
          console.log(result.data.payment_types)
          this.paymentrecords = result.data.payment_types;
          const data: any = [];
          // this.paymentrecords.forEach((obj: any) => {
          //   let objData = {
          //     id: obj.id,
          //     name: obj.name,
          //     reference: obj.reference,
          //     is_default: obj.is_default,
          //     secondary_name: obj.secondary_name
          //   }
          //   data.push(objData)
          // });
          this.dataSource.data =  this.paymentrecords as PaymentType[];
        } else {
          console.log("Error");
        }
      });
  }

  isDefaultChange(value: any) {
    let body = {
      id: value.id,
      name: value.name,
      reference: value.reference,
      is_default: value.is_default
    }
    this.httpService.post('change-primary-payment-type/' + value.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Payment Updated Successfully", "Close");
          this.getPaymentType();
        } else {
          console.log("Error");
        }
      });
  }

  isReferenceChange(value: any) {
    let body = {
      id: value.id,
      name: value.name,
      reference: value.reference,
      is_default: value.is_default
    }
    this.httpService.post('change-payment-reference/' + value.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Payment Updated Successfully", "Close");
          this.getPaymentType();
        } else {
          console.log("Error");
        }
      });
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
