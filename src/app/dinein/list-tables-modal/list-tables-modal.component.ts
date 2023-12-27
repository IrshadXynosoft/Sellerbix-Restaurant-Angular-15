import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-list-tables-modal',
  templateUrl: './list-tables-modal.component.html',
  styleUrls: ['./list-tables-modal.component.scss'],
})
export class ListTablesModalComponent implements OnInit {
  diningSectionRecords: any = [];
  tableRecords: any = [];
  availableCount: any = 0;
  occupiedCount: any = 0;
  dropdownContent: boolean = false;
  branch_id = this.localservice.get('branch_id');
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialogRef: MatDialogRef<ListTablesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Orders: any },
    private localservice: LocalStorage,
    private dataservice: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTableOrders();
  }

  getTableOrders() {
    this.httpService
      .get('table-orders/' + this.branch_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.diningSectionRecords = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  getColor(table: any) {
    if (table.orders) {
      if (table.orders[0].inv_print_count > 0) {
        return 'select-tag-yellow';
      } else {
        return 'select-tag-grey';
      }
    } else {
      return 'select-tag-green';
    }
  }
  checkDinningStatus(diningTableArray: any) {
    this.occupiedCount = 0;
    this.availableCount = 0;
    if (
      diningTableArray.branch_dining_table &&
      diningTableArray.branch_dining_table.length > 0
    ) {
      diningTableArray.branch_dining_table.forEach((item: any) => {
        if (item.orders) {
          this.occupiedCount++;
        } else {
          this.availableCount++;
        }
      });
    }
    return this.availableCount;
  }
  onTableClick(tableData: any) {
    let body = {
      tableName: tableData.name,
      table_id: tableData.table_id,
    };
    this.dialogRef.close(body);
  }

  close() {
    this.dialogRef.close();
  }
}
