import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ModifierEditReasonComponent } from '../modifier-edit-reason/modifier-edit-reason.component';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  public defaultTabIndex = 0;
  public errorMessage = '';
  currency_symbol = localStorage.getItem('currency_symbol');
  modifierSelected: any = [];
  modifiers: any = [];
  public breakException = {};

  constructor(private router: Router, @Inject(MAT_DIALOG_DATA) public data: { modifier_group: any, item_name: any, operation: any, item: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<AddItemComponent>, private snackBservice: SnackBarService) {
  }

  ngOnInit(): void {
    this.addTempData();
  }

  close() {
    this.dialogRef.close();
  }

  addModifier() {
    if (this.router.url != "/home/walkin" && this.data.operation == "2") {
      const dialogRef = this.dialog.open(ModifierEditReasonComponent, {
        disableClose: true,
        width: '500px',
        data: {
          name: this.data.item_name
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.modifiers = this.modifierSelected;
          this.validateModifierGroup();
        }
      });
    }
    else {
      this.modifiers = this.modifierSelected;
      this.validateModifierGroup();
    }
  }

  addTempData() {
    this.modifierSelected = [];
    let status;
    let listQty: any = 0;
    // if(this.data.operation == 'add'){
    this.data.modifier_group.forEach((obj: any) => {
      let items = {
        name: obj.modifier_group_name,
        id: obj.modifier_group_id,
        min_qty: obj.min_qty,
        max_qty: obj.max_qty,
        can_add_multiple: obj.can_add_multiple,
        modifier_type: obj.modifier_group_type,
        list: [] as any
      }
      obj.modifier_list.forEach((list: any) => {
        if (this.data.operation == 1) {
          status = false;
        } else {
          status = list.status;
          listQty = list.list_qty ? list.list_qty : 0;
        }
        let list_data = {
          id: list.item_id,
          modifier_list: list.item_name,
          rate: list.item_price,
          status: status,
          list_qty: obj.can_add_multiple ? listQty : null
        };
        items.list.push(list_data);
      })
      this.modifierSelected.push(items);
    });
  }

  onChange(event: any, groupindex: any, listIndex: any) {
    if (event.target.checked) {
      this.modifierSelected[groupindex].list[listIndex].status = true;
    } else {
      this.modifierSelected[groupindex].list[listIndex].status = false;
    }
  }

  onChangeRadio(event: any, groupindex: any, listIndex: any) {
    this.modifierSelected[groupindex].list.forEach((obj: any) => {
      obj.status = false;
      obj.list_qty = 0;
    });
    this.modifierSelected[groupindex].list[listIndex].status = true;
    this.modifierSelected[groupindex].list[listIndex].list_qty = 1;
  }

  validateModifierGroup() {
    let addListFlag = true;
    let index = 0;
    let invalidGroupName = "";
    let message = "";
    try {
      this.modifierSelected.forEach((obj: any) => {
        let selectedItemCnt = 0;
        let groupIndex = this.modifierSelected.indexOf(obj);
        if (obj.can_add_multiple == 1) {
          selectedItemCnt = this.listQtyValidation(groupIndex);
        }
        else {
          selectedItemCnt = _.filter(obj.list, function (ls) { if (ls.status) return ls }).length;
        }
        console.log(selectedItemCnt);
        if (selectedItemCnt < obj.min_qty || selectedItemCnt > obj.max_qty) {
          if (selectedItemCnt < obj.min_qty) {
            message = 'Please add item from the group '
          }
          else {
            message = 'Maximum quantity mismatch from the group '
          }
          invalidGroupName = obj.name;
          this.defaultTabIndex = index;
          addListFlag = false;
          throw this.breakException;
        }
        index++;
      });
    } catch (e) {
      if (e !== this.breakException) throw e;
    }
    if (addListFlag) {
      this.dialogRef.close(this.modifierSelected);
    } else {
      this.errorMessage = message + invalidGroupName;
    }
  }

  minusFn(qty: any, listIndex: any, groupIndex: any) {
    if (parseFloat(qty) > 0) {
      this.modifierSelected[groupIndex].list[listIndex].list_qty--;
      if (this.modifierSelected[groupIndex].list[listIndex].list_qty > 0) {
        if (this.modifierSelected[groupIndex].max_qty == 1) {
          this.modifierSelected[groupIndex].list.forEach((obj: any) => {
            obj.status = false;
          });
        }
        this.modifierSelected[groupIndex].list[listIndex].status = true;
      }
      else {
        this.modifierSelected[groupIndex].list[listIndex].status = false;
      }
    }
  }

  // old

  // listQtyValidation(groupIndex: any) {
  //   let selectedItemCnt: number = 0;
  //   if (this.modifierSelected[groupIndex].can_add_multiple == 1) {
  //     this.modifierSelected[groupIndex].list.forEach((element: any) => {
  //       selectedItemCnt += parseFloat(element.list_qty);
  //     });
  //   }
  //   return selectedItemCnt;
  // }

  listQtyValidation(groupIndex: any) {
    let selectedItemCnt: number = 0;
    let secondCount: number = 0;
    this.modifierSelected[groupIndex].list.forEach((element: any) => {
      if (parseFloat(element.rate) == 0 && element.status) {
        selectedItemCnt = parseFloat(element.list_qty);
      }
      secondCount = _.filter(this.modifierSelected[groupIndex].list, function (ls) { if (ls.status && parseFloat(ls.rate) != 0) return ls }).length;
    });
    console.log('zero price qty  ' + selectedItemCnt, 'others qty  ' + secondCount);
    return selectedItemCnt + secondCount;
  }

  plusFn(listIndex: any, groupIndex: any) {
    let selectedItemCnt = this.listQtyValidation(groupIndex);
    if (this.modifierSelected[groupIndex].list[listIndex].list_qty >= 0) {
      // if (selectedItemCnt < parseFloat(this.modifierSelected[groupIndex].max_qty)) {
      if (this.modifierSelected[groupIndex].max_qty == 1) {
        this.modifierSelected[groupIndex].list.forEach((obj: any) => {
          obj.status = false;
        });
      }
      this.modifierSelected[groupIndex].list[listIndex].list_qty++;
      this.modifierSelected[groupIndex].list[listIndex].status = true;
      // }
      // else {
      //   this.snackBservice.openSnackBar("Maximum Quantity Exceeds", "Close");
      // }
    }
    else {
      this.modifierSelected[groupIndex].list[listIndex].status = false;
    }
  }

  inputQty(qty: any, listIndex: any, groupIndex: any) {
    let selectedItemCnt = this.listQtyValidation(groupIndex);
    if (parseFloat(qty) > 0) {
      // if (selectedItemCnt < parseFloat(this.modifierSelected[groupIndex].max_qty)) {
      if (this.modifierSelected[groupIndex].max_qty == 1) {
        this.modifierSelected[groupIndex].list.forEach((obj: any) => {
          obj.status = false;
        });
      }
      this.modifierSelected[groupIndex].list[listIndex].list_qty = qty;
      this.modifierSelected[groupIndex].list[listIndex].status = true;
      // }
      // else {
      //   this.modifierSelected[groupIndex].list[listIndex].list_qty = qty;
      //   this.snackBservice.openSnackBar("Maximum Quantity Exceeds", "Close");
      // }
    }
    else {
      this.modifierSelected[groupIndex].list[listIndex].status = false;
    }
  }

  qtyShowingForCheckbox(modifiers: any) {
    let qty: any = 0;
    modifiers.list.forEach((obj: any) => {
      if (obj.status && (parseFloat(qty) < parseFloat(modifiers.max_qty))) {
        qty++;
      }
    });
    return qty;
  }
}
