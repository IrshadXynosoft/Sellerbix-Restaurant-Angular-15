import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-new-menu-request',
  templateUrl: './new-menu-request.component.html',
  styleUrls: ['./new-menu-request.component.scss']
})
export class NewMenuRequestComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public newStockRequestForm!: UntypedFormGroup;
  branch_id: any;
  order_no: any;
  reOrderItemsArray: any = [];
  branchRecords: any = [];
  stockOnHandBranch: any;
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  supplierArrays: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  recipeArray: any = [];
  subrecipeArray = [];
  total_price: any = 0;
  selectedStockIDs: any = [];
  allItemArray: any = [];
  today: any;
  isItemsSelected: boolean = false;
  getRequestArray = [];
  branch_name: any
  constructor(private dataService: DataService, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.branch_id = this.localService.get('branch_id');
    this.branch_name = this.localService.get('branchname');

  }
  ngOnInit(): void {
    this.generateOrderNo();
    this.getBranch();
    this.onBuildForm();
   // this.getItems();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }

  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no = "MTREQ_" + date + "." + month + "." + year + "_" + hh + ":" + mm + ":" + ss;
    this.today = date + '/' + month + '/' + year

  }
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          let branchs = result.data.tenant_branches;
          branchs.forEach((element: any) => {
            if (element.id != this.branch_id) {
              this.branchRecords.push(element)
            }
          });
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  // branchSelected(id: any, name: any) {
  //   if (id) {
  //     this.branch_id = id
  //     this.branch_selected = true;
  //     this.newStockRequestForm.patchValue({
  //       branch_selected: name,
  //       branch_id_for_requst:id
  //     })

  //   }
  // }
  onBuildForm() {
    this.newStockRequestForm = this.formBuilder.group({
      stock_request_number: [this.order_no, Validators.compose([Validators.required])],
      branch_selected: [this.branch_name],
      from_branch: [this.branch_id],
      branch_id_for_requst: [this.branch_id],
      req_date: [this.today],
      comments: [''],
      suppliersData: new UntypedFormArray([]),
      to_branch: ['', Validators.compose([Validators.required])],
    });
    this.newStockRequestForm.controls['branch_selected'].disable();
    this.newStockRequestForm.controls['req_date'].disable();
  }

  searchItem(filterText: any) {
    this.options=[];
    if(filterText.length>2){
    
     this.httpService.get('autocomplete_search_for_menu-request/'+filterText)
     .subscribe(result => {
       if (result.status == 200) {
         if (result.data.length > 0) {
          this.allItemArray = result.data;
          this.options = [];
          this.allItemArray?.forEach((element: any) => {
            let objData = {
              stock_type:element.stock_type,
              stock_id: element.stock_id,
              id: element.id,
              name: element.name,
              stock_on_hand: element.stock_on_hand,
              measurement_unit_name:element.measurement_unit_name,
              cost_per_unit: element.cost_per_unit,
              supplier_name: '--',
              buying_unit: '--',
              has_sub_unit: 0,
              unit_equals_sub_unit:'--',
              unit_equals_measurement_unit:'--',
              qty: "",
              qtybuyingUnit: '',
              qtybuyingSubUnit: '',
              qtyToMeasurementUnit: '',
              qtyMeasurementUnit: '',
              total: 0
           
            }
            this.options.push(objData);

          });
         
      
        }
        else{
          this.snackBService.openSnackBar('No Items Found',"Close");
        }
      } else {
      console.log("Error");
       }
     });
    }
     
    }
  getItems() {
    this.httpService.get('get-inventory-all-type/' + this.newStockRequestForm.value['from_branch'])
      .subscribe(result => {
        if (result.status == 200) {
          this.allItemArray = result.data;
         
          this.recipeArray=this.allItemArray.recipes_subRecipes;
          this.recipeArray?.forEach((element: any) => {
            
            if (element.recipe) {
            
                let objData = {
                  stock_type:4,
                  stock_id: element.stock_id,
                  id: element.recipe.id,
                  name: element.recipe.name,
                  stock_on_hand: element.recipe.available_stock,
                  measurement_unit_name:'--',
                  cost_per_unit: element.cost_price,
                  supplier_name: '--',
                  buying_unit: '--',
                  has_sub_unit: 0,
                  unit_equals_sub_unit:'--',
                  unit_equals_measurement_unit:'--',
                  qty: "",
                  qtybuyingUnit: '',
                  qtybuyingSubUnit: '',
                  qtyToMeasurementUnit: '',
                  qtyMeasurementUnit: '',
                  total: 0
               
                }
                this.options.push(objData)
              

            }
          });
          if (result.data == null) {
            this.showNoReorderItemDialog();
          }

        } else {
          console.log("Error in get reorder");
        }
      });
  }

  itemSelected(option: any, input: HTMLInputElement) {

    let items = this.newStockRequestForm.value['suppliersData'];
    if (items.length > 0) {
      if (this.selectedStockIDs.includes(option.stock_id)) {
        this.snackBService.openSnackBar("Item already added", "Close")
      } else {
        let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.isItemsSelected = true;
        this.selectedStockIDs.push(option.stock_id);
      }
    } else {
      let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
      items.push(this.createSupplierData(option));
      this.isItemsSelected = true;
      this.selectedStockIDs.push(option.stock_id);
    }
    input.value = '';
    input.blur();
  }


  get supplierFormGroups() {
    return this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  supplierName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].supplier_name;
  }
  itemName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].stock_on_hand ;
  }
  price(index: any) {
    let form_data = this.newStockRequestForm.value;

    return form_data.suppliersData[index].cost_per_unit  ;
  }
  errorMessage(i: any) {
    let form_data = this.newStockRequestForm.value;
    let decimal_length = form_data.suppliersData[i].qty.split('.')[1] ? form_data.suppliersData[i].qty.split('.')[1].length : 0
    let digit_length = form_data.suppliersData[i].qty.split('.')[0] ? form_data.suppliersData[i].qty.split('.')[0].length : 0
    if (form_data.suppliersData[i].qty >= 0 && decimal_length <= 3 && digit_length <= 5) {

      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }
  unit(index: any) {
    let form_data = this.newStockRequestForm.value;
    let unitQty = form_data.suppliersData[index].unit_equals_measurement_unit
    let openingBalance: any;
    if (form_data.suppliersData[index].has_sub_unit == 1) {
      let subUnitQty = form_data.suppliersData[index].unit_equals_sub_unit
      openingBalance = unitQty * subUnitQty
    }
    else {
      openingBalance = unitQty
    }
    return form_data.suppliersData[index].buying_unit ? '1 ' + form_data.suppliersData[index].buying_unit + '=' + openingBalance + form_data.suppliersData[index].measurement_unit_name : '-';
  }
  measurementunit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].measurement_unit_name;
  }
  isBuyingSubUnit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].has_sub_unit ? true : false;
  }
  clearSupplier(index: any) {
    let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.newStockRequestForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id), 1);
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total)
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }


  showNoReorderItemDialog() {

  }
  findTotal(i: any) {
    let items = this.newStockRequestForm.value['suppliersData']
    let netQuantity = parseFloat(items[i].qty)
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0) {
      items[i].qtyToMeasurementUnit = netQuantity
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
    return form_data.suppliersData[index].total;
  }


  back() {
    this.router.navigate(['inventory/menuRequests'])
  }

  saveStockRequest() {
    let recipe: any = []
     let item = this.newStockRequestForm.value['suppliersData']
    item.forEach((obj: any) => {
      if (obj.qty > 0) {
        let objData = {
          recipe_id: obj.id,
          qty: obj.qtyToMeasurementUnit,
          total: obj.total
        }
        recipe.push(objData)
      }
      
    });

    let arrayLength = parseInt(recipe.length) 
    if (arrayLength == item.length && item.length > 0) {
      let postParamsSave = {
        menu_request_number: this.newStockRequestForm.value['stock_request_number'],
        comments: this.newStockRequestForm.value['comments']?this.newStockRequestForm.value['comments']:null,
        from_branch: this.newStockRequestForm.value['from_branch'],
        to_branch: this.newStockRequestForm.value['to_branch'],
        total_amount: this.total_price,
        branch_id: this.newStockRequestForm.value['from_branch'],
        request_items_list: [{
         items:recipe
        }]
      }

      this.httpService.post('menu-request', postParamsSave)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Menu Request Created Successfully ", "Close");
            this.back();
          } else {
            console.log("Error in menu-request");
          }
        });
    }
  }

  viewRequestDetail(id: any) {
    this.getRequestArray.forEach((element: any) => {
      if (id == element.id) {
        this.dataService.setData('stockrequestItem', element);
        this.router.navigate(['inventory/stockrequestdetail'])

      }
    });
  }

}

