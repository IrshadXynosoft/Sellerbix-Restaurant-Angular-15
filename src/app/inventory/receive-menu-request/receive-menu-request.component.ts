import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-receive-menu-request',
  templateUrl: './receive-menu-request.component.html',
  styleUrls: ['./receive-menu-request.component.scss']
})
export class ReceiveMenuRequestComponent implements OnInit {

  currency_symbol = localStorage.getItem('currency_symbol');
  public newStockRequestForm!: UntypedFormGroup;
  branch_id: any;
  branchRecords: any = [];
  total: any;
  MenuItemsData = new UntypedFormControl();
  total_price: any = 0;
  selectedStockIDs: any = [];
  isItemsSelected: boolean = false;
  getRequestArray: any = [];
  constructor(private dataService: DataService, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();

  }



  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
          this.getProcessedData();
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  getProcessedData() {
    this.getRequestArray = this.dataService.getData('menureceivetItem');
    console.log(this.getRequestArray)
    this.getRequestArray.item?.forEach((element: any) => {
      let objData = {
        recipe_id: element.recipe_id,
        name: element.name,
        stock_type: 4,
        available_stock: element.available_stock,
        cost_per_unit: element.cost_unit,
        requested_qty: element.qty,
        qty: '',
        total: 0,
        measurement_unit_name: '--'
      }
      let items = this.newStockRequestForm.get('MenuItemsData') as UntypedFormArray;
      items.push(this.createSupplierData(objData));
     
    });
   
    this.newStockRequestForm.patchValue({
      stock_request_number: this.getRequestArray.menu_request_number,
      from_branch: this.getRequestArray.from_branch_name,
      comments: this.getRequestArray.comments,
      to_branch: this.getRequestArray.to_branch_name,
    })
    
  }
  onBuildForm() {
    this.newStockRequestForm = this.formBuilder.group({
      stock_request_number: [{ value: '', disabled: true }],
      from_branch: [{ value: '', disabled: true }],
      comments: [{ value: '', disabled: true }],
      MenuItemsData: new UntypedFormArray([]),
      to_branch: [{ value: '', disabled: true }],
    });



  }
  getBranchName(branch_id: any) {
    console.log(this.branchRecords);
    let branch_name: any;
    this.branchRecords.forEach((element: any) => {
      if (element.id == branch_id) {
        console.log(element.id)
        branch_name = element.name
      }
    });


    return branch_name
  }

  itemSelected(option: any, input: HTMLInputElement) {

    let items = this.newStockRequestForm.value['MenuItemsData'];
    if (items.length > 0) {
      if (this.selectedStockIDs.includes(option.stock_id)) {
        this.snackBService.openSnackBar("Item already added", "Close")
      } else {
        let items = this.newStockRequestForm.get('MenuItemsData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.isItemsSelected = true;
        this.selectedStockIDs.push(option.stock_id);
      }
    } else {
      let items = this.newStockRequestForm.get('MenuItemsData') as UntypedFormArray;
      items.push(this.createSupplierData(option));
      this.isItemsSelected = true;
      this.selectedStockIDs.push(option.stock_id);
    }



    input.value = '';
    input.blur();
  }


  get supplierFormGroups() {
    return this.newStockRequestForm.get('MenuItemsData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  itemName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.MenuItemsData[index].name;
  }

  price(index: any) {
    let form_data = this.newStockRequestForm.value;

    return form_data.MenuItemsData[index].cost_per_unit;
  }

  availableStock(index: any) {
    let form_data = this.newStockRequestForm.value;

    return form_data.MenuItemsData[index].available_stock;
  }
  measurementunit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.MenuItemsData[index].measurement_unit_name;
  }
  requestedQuantity(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.MenuItemsData[index].requested_qty;
  }
  errorMessage(i: any) {
    let form_data = this.newStockRequestForm.value;
    if (form_data.MenuItemsData[i].qty >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }
  clearMenuItem(index: any) {
    let items = this.newStockRequestForm.get('MenuItemsData') as UntypedFormArray;
    let form_data = this.newStockRequestForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.MenuItemsData[index].stock_id), 1);
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2);
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }

  findTotal(i: any) {
    let items = this.newStockRequestForm.value['MenuItemsData']
    let netQuantity = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0) {


      let subTotalItem = (netQuantity * cost).toFixed(2);
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
    }
  }

  subTotal(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.MenuItemsData[index].total;
  }

  back() {
    this.router.navigate(['/inventory/menuTransfer'])
  }
  processStockRequest() {
    let items: any = [];


    let item = this.newStockRequestForm.value['MenuItemsData']
    item.forEach((obj: any) => {
      if (obj.qty >= 0) {
        let objData = {
          recipe_id: obj.recipe_id,
          qty: obj.qty,
          total: obj.total
        }
        items.push(objData)

      }
    });

    if (items.length == item.length && item.length > 0) {
      let postParamsSave = {
        menu_request_id: this.getRequestArray.id,
        menu_request_number: this.getRequestArray.menu_request_number,
        comments: this.getRequestArray.comments,
        from_branch_id: this.getRequestArray.from_branch_id,
        to_branch: this.getRequestArray.to_branch_id,
        total_amount: this.total_price,
        branch_id: this.getRequestArray.from_branch_id,
        status: 2,
        request_items_list: items
      
      }

      this.httpService.post('menu-request-process', postParamsSave)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Menu Request Processed Successfully ", "Close");
            this.back();

          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  viewRequestDetail(id: any) {
    this.getRequestArray.forEach((element: any) => {
      if (id == element.id) {
        this.dataService.setData('menurequestItem', element);
        this.router.navigate(['inventory/menurequestdetail'])

      }
    });
  }

}

