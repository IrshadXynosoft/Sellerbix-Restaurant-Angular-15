import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-grouped-item',
  templateUrl: './grouped-item.component.html',
  styleUrls: ['./grouped-item.component.scss']
})
export class GroupedItemComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { groupedItems: any ,name:any, price:any}, public dialog: MatDialog, public dialogRef: MatDialogRef<GroupedItemComponent>) { }
  groupeditemsarray: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
  toPrice(params:any) {
    return params.toFixed(2);
  }
 
  groupedItemSelect(Groupeditem: any,index:any) {
      let item = {
        item_id: Groupeditem.item_id,
        item_name: Groupeditem.item_name,
        item_sec_name: Groupeditem.item_sec_name,
        price: Groupeditem.item_price,
        default_price : Groupeditem.item_price, // these price is taken to the item with modifiers
        qty:'1',
        description:Groupeditem.description,
        is_editable:Groupeditem.is_editable,
        modifier_group : Groupeditem.modifier_group ? Groupeditem.modifier_group : null
      }      
    this.dialogRef.close(item);
  }
}