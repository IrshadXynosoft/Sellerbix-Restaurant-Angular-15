import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddItemComponent } from '../add-item/add-item.component';
import { IndividualItemDiscountComponent } from '../individual-item-discount/individual-item-discount.component';
import { ItemInfoComponent } from '../item-info/item-info.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { DataService } from 'src/app/_services/data.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
// export interface Note {
//   Note: string;
// }
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // notes: Note[] = [];
  notes = '';
  public removeDiscountItem: any;
  selectedMenuItem: any;
  notesData = new UntypedFormControl();
  noteOptionSelected: any = [];
  options: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { item: any, itemdiscountflag: any, editModifierData: any, editItemIndex: any, entity_id: any }, private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditItemComponent>,
    private dataservice: DataService,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
  ) {
    this.selectedMenuItem = this.dataservice.getData('selectedMenuItem');
  }

  ngOnInit(): void {
    this.notesData.setValue(this.data.item.note);
    if (this.data.item.note) {
      this.noteOptionSelected.push(this.data.item.note)
    }
    this.getNotes()
  }

  addNote() {
    this.notes = this.notesData.value;
    this.data.item.note = this.notes;
    this.dataservice.setData('updatedMenuItem', this.selectedMenuItem)
    this.dialogRef.close(this.notes);
  }

  getNotes() {
    this.httpService.get('item-suggestion', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.options = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }


  close() {
    this.dataservice.setData('updatedMenuItem', this.selectedMenuItem)
    this.dialogRef.close();
  }

  adddiscount() {
    const dialogRef = this.dialog.open(IndividualItemDiscountComponent, {
      width: '500px',
      maxHeight: '500px',
      data: {
        entity_id: this.data.entity_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  removeItemDiscount() {
    this.selectedMenuItem.item_discount_id = null;
    this.selectedMenuItem.item_discount_name = null;
    this.selectedMenuItem.item_discount_rate = null;
    this.selectedMenuItem.price = this.selectedMenuItem.orginal_price;
    if (this.selectedMenuItem.modifiers) {
      this.updateTotalWithModifiers()
    }
    else {
      this.selectedMenuItem.total = (this.selectedMenuItem.qty * this.selectedMenuItem.price).toFixed(2)
    }
    this.dataservice.setData('updatedMenuItem', null);
  }

  updateTotalWithModifiers() {
    let total = 0.00;
    this.selectedMenuItem.modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total += (parseFloat(obj1.rate) * parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1));
        }
      });
    });
    this.selectedMenuItem.total = (parseFloat(this.selectedMenuItem.qty) * (parseFloat(this.selectedMenuItem.price) + total)).toFixed(2);
  }

  itemInfo() {
    const dialogRef = this.dialog.open(ItemInfoComponent, {
      width: '500px',
      data: {
        item: this.data.item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  backspaceEvent(e: any) {
    this.noteOptionSelected = e.target.value.split(',')
  }

  selectedOptions(note: any) {
    this.noteOptionSelected.push(note);
    // let temparray = this.noteOptionSelected.join(',');
    // this.noteOptionSelected = [];
    this.notesData.setValue(this.noteOptionSelected.toString())
  }

  editModifiers() {
    const dialogRef = this.dialog.open(AddItemComponent, {
      width: '800px',
      data: {
        modifier_group: this.data.editModifierData.modifier_group,
        item_name: this.data.editModifierData.item_name,
        operation: '2' //for edit
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // old
        // this.dataservice.setData('updatedModifierData', result);
        // this.dataservice.setData('updatedModifierIndex', this.data.editItemIndex);
        // new
        this.selectedMenuItem.modifiers = result;
        this.dataservice.setData('updatedMenuItem', this.selectedMenuItem)
      }
    });
  }
}
