import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-individual-item-discount',
  templateUrl: './individual-item-discount.component.html',
  styleUrls: ['./individual-item-discount.component.scss']
})
export class IndividualItemDiscountComponent implements OnInit {
  public selectedMenuItem: any;
  discountRecords: any = [];
  classactive: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  currentDate = new Date();
  currentTime = this.currentDate.getHours() + ":" + this.currentDate.getMinutes() + ":" + this.currentDate.getSeconds();
  branch_id = this.localservice.get('branch_id');
  constructor(@Inject(MAT_DIALOG_DATA) public data: { entity_id: any }, private localservice: LocalStorage, private snackBService: SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<IndividualItemDiscountComponent>, private httpService: HttpServiceService, private dataservice: DataService) {
    this.selectedMenuItem = this.dataservice.getData('selectedMenuItem');
  }
  ngOnInit(): void {
    this.getDiscount();
  }
  close() {
    // this.dataservice.setData('selectedMenuItem', null);
    this.dialogRef.close();
  }
  getDiscount() {
    this.httpService.get('scheduled-item-discount/' + this.branch_id + '/' + this.data.entity_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.discountRecords = result.data;
        } else {
          console.log("Error");
        }
      });
  }
  addingDiscount(discount: any) {
    this.classactive = discount.id;
    let selectedDiscount = discount;
    let itemprice = this.selectedMenuItem.price;
    console.log(this.selectedMenuItem);

    if (this.selectedMenuItem != null || this.selectedMenuItem != undefined) {
      if (selectedDiscount.discount_type == "value") {
        // this.selectedMenuItem.price = parseFloat(this.selectedMenuItem.price) - parseFloat(selectedDiscount.rate);// old
        if (parseFloat(selectedDiscount.rate) > parseFloat(this.selectedMenuItem.total)) {
          this.snackBService.openSnackBar("Invalid discount applied.Please choose another one.", "Close");
          this.selectedMenuItem.price = itemprice;
          this.selectedMenuItem.item_discount_id = null;
          this.dataservice.setData('updatedMenuItem', null); //latest update
        }
        else {
          this.selectedMenuItem.total = parseFloat(this.selectedMenuItem.total) - parseFloat(selectedDiscount.rate);
          // this.selectedMenuItem.total = (parseFloat(this.selectedMenuItem.price) * parseFloat(this.selectedMenuItem.qty)); //old
          this.selectedMenuItem.item_discount_id = selectedDiscount.id;
          this.selectedMenuItem.item_discount_name = selectedDiscount.name;
          this.selectedMenuItem.item_discount_rate = selectedDiscount.rate;
          this.dataservice.setData('updatedMenuItem', this.selectedMenuItem);
        }
      }
      else {
        if (parseFloat(this.selectedMenuItem.total) < (parseFloat(this.selectedMenuItem.total) * (parseFloat(selectedDiscount.rate) / 100))) {
          this.snackBService.openSnackBar("Invalid discount applied.Please choose another one.", "Close");
          this.selectedMenuItem.price = itemprice;
          this.selectedMenuItem.item_discount_id = null;
          this.dataservice.setData('updatedMenuItem', null);
        }
        else {
          this.selectedMenuItem.total = parseFloat(this.selectedMenuItem.total) - (parseFloat(this.selectedMenuItem.total) * (parseFloat(selectedDiscount.rate) / 100));
          // this.selectedMenuItem.total = (parseFloat(this.selectedMenuItem.price) * parseFloat(this.selectedMenuItem.qty)); //old
          this.selectedMenuItem.item_discount_id = selectedDiscount.id;
          this.selectedMenuItem.item_discount_name = selectedDiscount.name;
          this.selectedMenuItem.item_discount_rate = (parseFloat(this.selectedMenuItem.total) * (parseFloat(selectedDiscount.rate) / 100)).toFixed(2)
          this.dataservice.setData('updatedMenuItem', this.selectedMenuItem);
        }
      }
    }
    this.dialogRef.close(selectedDiscount);
  }
}
