import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { entity_id: any }, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<AddDiscountComponent>, private httpService: HttpServiceService) { }
  // discountRecords: any = [];
  selectedDiscount: any;
  discountValue = '';
  classactive: any;
  branch_id = this.localservice.get('branch_id');
  currency_symbol = localStorage.getItem('currency_symbol');
  currentDate = new Date();
  currentTime = this.currentDate.getHours() + ":" + this.currentDate.getMinutes() + ":" + this.currentDate.getSeconds();
  discountDisabledFlag: boolean = false;
  percentageDiscount: any = [];
  valueDiscount: any = [];
  ngOnInit(): void {
    this.getDiscount();
  }
  addingDiscount(discount: any) {
    this.classactive = discount.id;
    this.selectedDiscount = discount;
    this.dialogRef.close(this.selectedDiscount);
  }
  getDiscount() {
    this.httpService.get('sorted-order-discount/' + this.branch_id + '/' + this.data.entity_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.percentageDiscount = result.data?.percentage ? result.data?.percentage : [];
          this.percentageDiscount.sort((a: { rate: number; }, b: { rate: number; }) => a.rate - b.rate);
          this.valueDiscount = result.data?.value ? result.data?.value : [];
          this.valueDiscount.sort((a: { rate: number; }, b: { rate: number; }) => a.rate - b.rate);
        } else {
          console.log("Error");
        }
      });
  }
  close() {
    this.dialogRef.close();
  }

}
