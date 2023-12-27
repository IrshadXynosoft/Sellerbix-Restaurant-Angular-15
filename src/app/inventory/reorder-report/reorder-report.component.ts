import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PoReportDetailComponent } from '../po-report-detail/po-report-detail.component';
export interface Report {
  id: number;
  purchase_order_no: any;
  staff_name: any;
  branch_name: any;
  supplier_name: any;
  due_date: any;
  status: any;
  amount: any;

}

@Component({
  selector: 'app-reorder-report',
  templateUrl: './reorder-report.component.html',
  styleUrls: ['./reorder-report.component.scss']
})
export class ReorderReportComponent implements OnInit {
  @ViewChild("finishedGood", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSourceforFInishedGood.paginator = value;
  }
  @ViewChild("Subrecipe", { read: MatPaginator, static: false })
  set pagination1(value: MatPaginator) {
    this.dataSourceforSubrecipe.paginator = value;
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumnsForIngredient: string[] = ['index',
    'item_name',
    'item_type',
    'stock_onhand',
    'cost_unit',
    'reorder_qty',
    'supplier_name',
    'button'];
  public displayedColumnsForSubRecipe: string[] = ['index',
    'item_name',
    'stock_onhand',
    'cost_unit',
    'reorder_qty'];
  public dataSourceforFInishedGood = new MatTableDataSource<Report>();
  public dataSourceforSubrecipe = new MatTableDataSource<Report>();
  public generatePurchaseOrderReport!: UntypedFormGroup;
  data: any;
  branch_id: any;
  branchRecords: any = []
  supplierArray: any = [];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
  totalAmount: any = 0;
  reorderArray: any = [];
  tabIndex:any=0;
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localService: LocalStorage) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.getBranch();
    this.getSuppler();
    this.onBuildForm();
  }
  getName(element: any) {
    let name: any;
    if (element.ingredient) {
      name = 'Ingredient'
    }
    else if (element.finished_good) {
      name = 'FInished Good'
    }
    else {
      name = 'Sub Recipe'
    }
    return name;
  }
  getItemName(element: any) {
    let name: any;
    if (element.ingredient) {
      name = element.ingredient.ingredient_name
    }
    else if (element.finished_good) {
      name = element.finished_good.name
    }
    else {
      name = element.sub_recipe.sub_recipe_name
    }
    return name;
  }
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  getSuppler() {
    this.httpService.get('supplier')
      .subscribe(result => {
        if (result.status == 200) {
          this.supplierArray = result.data.suppliers;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }
  onBuildForm() {
    this.generatePurchaseOrderReport = this.formBuilder.group({
      branch_id: [this.branch_id],
      supplier_id: [null]
    });
  }
  viewlastPO(element: any) {
    if(element.purchase_order_id){
      const dialogRef = this.dialog.open(PoReportDetailComponent, {
        width: '1200px', data: { id: element.purchase_order_id }
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }

  }
  generateReport() {

    this.dataSourceforFInishedGood.data = [];
    this.dataSourceforSubrecipe.data = [];
    let ingredientArray: any = [];
    let subrecipeArray: any = [];
    let postParams = this.generatePurchaseOrderReport.value
    this.httpService.post('reports/reorder-report', postParams)
      .subscribe(result => {
        if (result.status == 200) {
          this.reorderArray = result.data;
          this.reorderArray.forEach((element: any) => {
            if (element.ingredient) {
              let obj: any = {
                id: element.ingredient.ingredient_id,
                name: element.ingredient.ingredient_name,
                purchase_order_id: element.ingredient.purchase_order_id,
                stock_on_hand: element.on_hand_qty + ' ' + element.ingredient.measurement_unit_name,
                cost_unit: element.cost_per_unit + ' ' + element.ingredient.measurement_unit_name,
                reorder_qty: element.reorder_qty + ' ' + element.ingredient.measurement_unit_name,
                supplier_name: element.item_supplier[0].supplier_name,
                type: 'Ingredient'
              }
              ingredientArray.push(obj);
            }
            else if (element.finished_good) {
              let obj: any = {
                id: element.finished_good.item_id,
                name: element.finished_good.name,
                purchase_order_id: element.finished_good.purchase_order_id,
                stock_on_hand: element.on_hand_qty + ' ' + element.finished_good.measurement_unit_name,
                cost_unit: element.cost_per_unit + ' ' + element.finished_good.measurement_unit_name,
                reorder_qty: element.reorder_qty + ' ' + element.finished_good.measurement_unit_name,
                supplier_name: element.item_supplier[0].supplier_name,
                type: 'Finished Good'
              }
              ingredientArray.push(obj);
            }
            else if (element.sub_recipe) {
              let obj: any = {
                id: element.sub_recipe.sub_recipe_id,
                name: element.sub_recipe.sub_recipe_name,
                stock_on_hand: element.on_hand_qty + ' ' + element.sub_recipe.measurement_unit_name,
                cost_unit: element.cost_per_unit + ' ' + element.sub_recipe.measurement_unit_name,
                reorder_qty: element.reorder_qty + ' ' + element.sub_recipe.measurement_unit_name,

              }
              subrecipeArray.push(obj);
            }
          });
          this.dataSourceforFInishedGood.data = ingredientArray as Report[];
          this.dataSourceforSubrecipe.data = subrecipeArray as Report[];
        } else {
          console.log("Error");
        }
      });
  }
  tabClick(tab: any) {
    this.tabIndex=tab.index}
}


