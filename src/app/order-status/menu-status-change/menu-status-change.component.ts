import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { KotMqttService } from 'src/app/_services/mqtt/kot-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

export interface Menu {
  id: number;
  name: any;
  barcode: any;
  item_code: any;
  description: any;
  default_price: any;
  tenant_id: any;
  category_id: any;
  image_url: any;
  image_type: any;
  status: any;
}

@Component({
  selector: 'app-menu-status-change',
  templateUrl: './menu-status-change.component.html',
  styleUrls: ['./menu-status-change.component.scss']
})
export class MenuStatusChangeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  menuarray: any = [];
  messageType: any = 'menuStatus'
  public displayedColumns: string[] = ['index', 'ProductName', 'Status'];
  public dataSource = new MatTableDataSource<Menu>();
  constructor(public dialogRef: MatDialogRef<MenuStatusChangeComponent>, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private readonly kotMqtt: KotMqttService) { }

  ngOnInit(): void {
    this.getMenuItems()
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  close() {
    this.dialogRef.close();
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  statusChange(event: any, id: any) {
    let body = {
      'id': id,
      'status': event.checked
    }
    this.httpService.post('temporary-status-change', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.publishStatus()
          this.getMenuItems()
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getMenuItems() {
    this.httpService.get('item', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuarray = []
          result.data.items.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
              status: obj.status,
              item_code: obj.item_code
            }
            this.menuarray.push(objData);
          });
          this.dataSource.data = this.menuarray as Menu[];
        } else {
          console.log("Error");
        }
      });
  }

  publishStatus() {
    let data = 'new'
    this.kotMqtt.publish(this.messageType, data)
      .subscribe((data: any) => { });
  }
}
