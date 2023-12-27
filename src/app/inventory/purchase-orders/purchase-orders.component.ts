import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { formatDate } from '@angular/common'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
export interface Report {
  id: number;
  order_no: any;
  created_by: any;
  ordered_by: any;
  due_date: any;
  supplier: any;
  button:any;
}

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_id: any;
  openPOArray: any = [];
  sentPOArray: any = [];
  recievedPOArray: any = [];
  tempopenPOArray: any = [];
  tempsentPOArray: any = [];
  temprecievedPOArray: any = [];
  branchRecords: any = [];
  tabIndex: any = 0;
  todayDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  public dataSourceForOpenPO = new MatTableDataSource<Report>();
  public dataSourceForSentPO = new MatTableDataSource<Report>();
  public dataSourceForReceivedPO = new MatTableDataSource<Report>();
  public displayedColumnsOpenPO: string[] = ['index', 'order_no', 'created_by','ordered_by', 'due_date', 'Total', 'button'];
  public displayedColumnsSentPO: string[] = ['index', 'order_no','supplier', 'created_by','ordered_by', 'due_date', 'Total', 'button'];
  public displayedColumnsReceivedPO: string[] = ['index', 'order_no','supplier', 'created_by','ordered_by', 'due_date', 'Total', 'button'];
  @ViewChild("openPOTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSourceForOpenPO.paginator = value;
  }
  @ViewChild("sendPOTable", { read: MatPaginator, static: false })
  set pagination1(value: MatPaginator) {
    this.dataSourceForSentPO.paginator = value;
  }
  @ViewChild("receivePOTable", { read: MatPaginator, static: false })
  set pagination2(value: MatPaginator) {
    this.dataSourceForReceivedPO.paginator = value;
  }

  // sort
  @ViewChild("openPOTable", { read: MatSort, static: false })
  set sort(value: MatSort) {
    this.dataSourceForOpenPO.sort = value;
  }
  @ViewChild("sendPOTable", { read: MatSort, static: false })
  set sort1(value: MatSort) {
    this.dataSourceForSentPO.sort = value;
  }
  @ViewChild("receivePOTable", { read: MatSort, static: false })
  set sort2(value: MatSort) {
    this.dataSourceForReceivedPO.sort = value;
  }
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute, private dataservice: DataService) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.getBranch();
    this.getPurchaseOrder(this.branch_id)
  }
  getBranch() {
    this.httpService.get('branches-for-inventory/' + this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;

        } else {
          console.log("Error");
        }
      });
  }
  getpurchaseForLocation(event: any,type:any) {
    let branch_id = event.target.value;
    console.log(type);
    
    switch (type) {
      case 1:
        this.getPurchaseOrder(branch_id)
         break;
      case 2:
        this.getSendPO(branch_id);
        break;
      case 3:
        this.getReceivedPO(branch_id);

    }
  
  }
  getPurchaseOrder(branch_id: any) {
    this.httpService.get('list-purchase-orders/' + branch_id)
      .subscribe(result => {
        if (result.status == 200) {
          this.openPOArray = [];
          this.tempopenPOArray = [];
          this.openPOArray = result.data;
          this.tempopenPOArray = this.openPOArray;
          this.dataSourceForOpenPO.data = this.openPOArray as Report[];
      } else {
          this.openPOArray = [];
          this.tempopenPOArray = [];
          this.dataSourceForOpenPO.data = this.openPOArray as Report[];
          console.log("Error in purchase order");
        }
      });

  }
  tabClick(tab: any) {
    this.tabIndex = tab.index;
    switch (tab.index) {
      case 0:
        this.getPurchaseOrder(this.localService.get('branch_id'))

        break;
      case 1:
        this.getSendPO(this.localService.get('branch_id'));
        break;
      case 2:
        this.getReceivedPO(this.localService.get('branch_id'));

    }
  }
  getSendPO(branch_id: any) {
    this.httpService.get('sent-purchase-ordes/' + branch_id)
      .subscribe(result => {
        if (result.status == 200) {
          this.sentPOArray = [];
          this.tempsentPOArray = [];
         this.sentPOArray = result.data;
          this.tempsentPOArray = this.sentPOArray;
          this.dataSourceForSentPO.data = this.sentPOArray as Report[];
        } else {

          this.sentPOArray = [];
          this.tempsentPOArray = [];
          this.dataSourceForSentPO.data = this.sentPOArray as Report[];
          console.log(this.sentPOArray);
          
          console.log("Error in purchase order");
        }
      });
  }
  getReceivedPO(branch_id: any) {
    this.httpService.get('received-purchase-ordes/' + branch_id)
      .subscribe(result => {
        if (result.status == 200) {
           this.recievedPOArray = [];
          this.temprecievedPOArray = [];
          this.recievedPOArray = result.data;
          this.temprecievedPOArray = this.recievedPOArray;
          this.dataSourceForReceivedPO.data = this.recievedPOArray as Report[];
       } else {
        this.recievedPOArray = [];
        this.dataSourceForReceivedPO.data = this.recievedPOArray as Report[];
        this.temprecievedPOArray = [];
          console.log("Error in purchase order");
        }
      });
  }
  SearchSupplier(searchText: any, type: any) {
    if (type == '1') {
      if (searchText) {
        this.openPOArray = this.tempopenPOArray
        var filterItems = this.openPOArray.filter(function (obj: any) {
          if (obj.supplier_name != null) {
            return ((obj.supplier_name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
          }
        });
        if (filterItems.length < 1) {
          filterItems = []
        }
        this.openPOArray = filterItems;
      }
      else {
        this.openPOArray = this.tempopenPOArray
      }
    }
    else if (type == '2') {

      if (searchText) {
        this.sentPOArray = this.tempsentPOArray

        var filterItems = this.sentPOArray.filter(function (obj: any) {
          if (obj.supplier_name != null) {
            return ((obj.supplier_name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
          }
        });
        if (filterItems.length < 1) {
          filterItems = []
        }
        this.sentPOArray = filterItems;
      }
      else {
        this.sentPOArray = this.tempsentPOArray
      }
    }
    else if (type == '3') {
      if (searchText) {
        this.recievedPOArray = this.temprecievedPOArray
        var filterItems = this.recievedPOArray.filter(function (obj: any) {
          if (obj.supplier_name != null) {
            return ((obj.supplier_name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
          }

        });
        if (filterItems.length < 1) {
          filterItems = []
        }
        this.recievedPOArray = filterItems;
      }
      else {
        this.recievedPOArray = this.temprecievedPOArray
      }
    }
  }
  dateFilterReceivedArray(searchText: any) {
    if (searchText) {
      this.dataSourceForReceivedPO.data = this.temprecievedPOArray
      var filterItems = this.dataSourceForReceivedPO.data.filter(function (obj: any) {
        return ((obj.due_date).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

      });
      if (filterItems.length < 1) {
        filterItems = []
      }
      this.dataSourceForReceivedPO.data = filterItems;
    }
    else {
      this.dataSourceForReceivedPO.data = this.temprecievedPOArray
    }
  }
  getItemName(item: any) {
    let itemName: any;
    item.purchase_order_item?.forEach((element: any) => {
      itemName = itemName ? itemName + ',' + element.name : element.name
    });
    item.ingredient?.forEach((element: any) => {
      itemName = itemName ? itemName + ',' + element.name : element.name
    });
    return itemName;
  }
  getSupplierName(item: any) {

    let supplierName: any
    item.ingredient?.forEach((element: any) => {
      supplierName = supplierName ? supplierName + ',' + element.supplier : element.supplier;
    });
    return supplierName
  }

  sendPurchaseOrder(item: any) {
    this.router.navigate(['inventory/sendpurchaseOrders/1/' + item.id])

  }
  resendPurchaseOrder(item: any) {
    this.router.navigate(['inventory/sendpurchaseOrders/2/' + item.id])

  }
  newOrder() {

    this.router.navigate(['inventory/newOrder'])
  }
  deletePurchaseOrder(id: any, poNumber: any) {

    const options = {
      title: 'Delete Purchase Order',
      message: 'Delete ' + poNumber + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('consignment/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Parchase Order- " + poNumber + " Deleted Successfully!!", "Close");
              this.getPurchaseOrder(this.branch_id);
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });

  }
  deletesentPurchaseOrder(id: any, poNumber: any) {

    const options = {
      title: 'Delete Purchase Order',
      message: 'Delete ' + poNumber + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('purchase-order/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Parchase Order- " + poNumber + " Deleted Successfully!!", "Close");
              this.getPurchaseOrder(this.branch_id);
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });

  }
  viewPurchaseOrder(item: any) {
    this.router.navigate(['inventory/viewpurchaseOrder/' + item.id])
  }
  editPurchaseOrder(item: any) {
    this.router.navigate(['inventory/editpurchaseOrder/' + item.id + '/' + item.branch_id])
  }
  recievePurchaseOrder(item: any) {
    this.router.navigate(['inventory/receivepurchaseOrder/' + item.id])
  }
  rejectPurchaseOrder(item: any) {

    const options = {
      title: 'Reject Purchase Order',
      message: 'Delete ' + item.purchase_order_number + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        let postParamsSave = {
          id: item.id,
          purchase_order_number: item.purchase_order_number,
          branch_id: item.branch_id,
          is_approval: 0,
          status: 3
        }
        this.httpService.put('purchase-order/' + item.id, postParamsSave)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Your Purchase Order is Rejected Successfully", "Close");
              this.getPurchaseOrder(this.branch_id);
            } else {
              console.log("Error in purchase-order");
            }
          });
      }
    });

  }

  ShowOverdue(event: any) {
    if (event.target.checked) {

      this.sentPOArray.forEach((element: any) => {

        let dueDate = new Date(element.due_date); //dd-mm-YYYY
        let today = new Date();
        if (dueDate < today) {
          this.dataSourceForSentPO.data = this.tempsentPOArray
          let filterItems = [];
          filterItems.push(element)
          if (filterItems.length < 1) {
            filterItems = []
          }
          this.dataSourceForSentPO.data = filterItems;
        }
        else {
          this.dataSourceForSentPO.data = this.tempsentPOArray
        }

      });
    }
    else {
      this.dataSourceForSentPO.data = this.tempsentPOArray
    }
  }

  doFilter(filterText: any) {
    this.dataSourceForSentPO.filter = filterText.trim().toLocaleLowerCase();
  }
  doFilterReceived(filterText: any) {
    this.dataSourceForReceivedPO.filter = filterText.trim().toLocaleLowerCase();
  }
}
