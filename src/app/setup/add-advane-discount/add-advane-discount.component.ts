import { ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { COMMA } from 'mat-table-exporter';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';

@Component({
  selector: 'app-add-advane-discount',
  templateUrl: './add-advane-discount.component.html',
  styleUrls: ['./add-advane-discount.component.scss']
})
export class AddAdvaneDiscountComponent implements OnInit {

  public addpromotionForm!: UntypedFormGroup;
  iscategorywise: boolean = false;
  isproductwise: boolean = true;
  CategoryData = new UntypedFormControl();
  productData = new UntypedFormControl();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  CategoryToCountRecords: any = [];
  menuItemRecords: any = [];
  CategoryToCountSelected: any = [];
  CategoryToAdjustSelected: any = [];
  categoriestocount: any = [];
  categoriestoadjust: any = [];
  ProductsToCountSelected: any = [];
  ProductsToAdjustSelected: any = [];
  Productstocount: any = [];
  Productstoadjust: any = [];
  filteredOptionsCat: Observable<any[]> | undefined;
  filteredOptionsItem: Observable<any[]> | undefined;
  options: any = [];
  itemOptions: any = [];
  errorMessage: any;
  promotionsArray: any;
  todayDate: Date = new Date();
  offer_start_date = new UntypedFormControl({ value: this.todayDate, disabled: false });
  offer_end_date = new UntypedFormControl({ value: this.todayDate, disabled: false });
  public validationFloat = "^[0-9]{1,5}(?:\.[0-9]{1,3})?$";
  error_message_category_count: any;
  error_message_category_adjust: any;
  error_message_product_count: any;
  error_message_product_adjust: any;
  promotion_type: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  
  constructor(public dialog: MatDialog,
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddAdvaneDiscountComponent>,
    public formBuilder: UntypedFormBuilder,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: { branch_id: any, id: any }) {

  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getCategories();
    this.getItem();
    if (this.data.id) {
      this.getpromotion();
    }
    this.filteredOptionsCat = this.CategoryData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.filteredOptionsItem = this.productData.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItem(value)),
    );
  }

  onBuildForm() {
    this.addpromotionForm = this.formBuilder.group({
      promotion_title: ['', Validators.compose([Validators.required])],
      discount_type: ['percentage'],
      discount_value: ['', Validators.compose([Validators.required, Validators.pattern(this.validationFloat)])],
      purchase_qty: ['', Validators.compose([Validators.required, Validators.pattern(this.validationFloat)])],
      receive_qty: ['', Validators.compose([Validators.required, Validators.pattern(this.validationFloat)])],
      promotion_type: ['2'],
      min_qty: [0],
      max_qty: [0],
      is_repeat: [false],
      applies_to: ['1'],
      trigger_type: ['2'],
      promotion_coupon_code:[''],
      status: [true]
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  private _filterItem(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.itemOptions.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }

  getCategories() {

    this.httpService.get('category', false)
      .subscribe(result => {

        if (result.status == 200) {
          this.CategoryToCountRecords = result.data.categories;
          this.CategoryToCountRecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            this.options.push(objData)
          });

        } else {
          console.log("Error in get  category");
        }
      });
  }

  getItem() {
    let itemIdList: any = [];
    this.httpService.get('items-by-eorder', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data;
          this.menuItemRecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            this.itemOptions.push(objData)
          });


        } else {
          console.log("Error");
        }
      });
  }

  getpromotion() {
    this.httpService.get('advance-promotion/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.promotionsArray = result.data[0];
          this.addpromotionForm.patchValue({
            promotion_title: this.promotionsArray.promotion_title,
            promotion_type: this.promotionsArray.promotion_type,
            applies_to: this.promotionsArray.is_first_time_buyer == 1 ? '2' : '1',
            discount_type: this.promotionsArray.discount_type,
            discount_value: (this.promotionsArray.discount_value).toFixed(2),
            is_repeat: this.promotionsArray.is_repeat,
            purchase_qty: (this.promotionsArray.purchase_qty).toFixed(2),
            receive_qty: (this.promotionsArray.receive_qty).toFixed(2),
            min_qty: (this.promotionsArray.min_qty).toFixed(2),
            max_qty: (this.promotionsArray.max_qty).toFixed(2),
            trigger_type: this.promotionsArray.trigger_type,
            status: this.promotionsArray.status,
            promotion_coupon_code:this.promotionsArray.promotion_coupon_code?this.promotionsArray.promotion_coupon_code:''
          })
          this.offer_start_date.setValue(this.promotionsArray.offer_start_date)
          this.offer_end_date.setValue(this.promotionsArray.offer_end_date)
          if (this.promotionsArray.promotion_type == '1') {
            this.promotion_type = 'Category Wise';
            this.iscategorywise = true;
            this.isproductwise = false;
            let categories_to_count: any = this.promotionsArray.categories_to_count;
            categories_to_count.forEach((element: any) => {
              this.CategoryToCountSelected.push(element.category);
              this.categoriestocount.push(element.category_id)
            });
            let categories_to_receive: any = this.promotionsArray.categories_to_receive;
            categories_to_receive.forEach((element: any) => {
              this.CategoryToAdjustSelected.push(element.category);
              this.categoriestoadjust.push(element.category_id)
            });
          }
          else {
            this.promotion_type = 'Product Wise';
            this.isproductwise = true;
            this.iscategorywise = false;
            let products_to_count: any = this.promotionsArray.products_to_count;
            products_to_count.forEach((element: any) => {
              this.ProductsToCountSelected.push(element.item);
              this.Productstocount.push(element.item_id)
            });
            let products_to_receive: any = this.promotionsArray.products_to_receive;
            products_to_receive.forEach((element: any) => {
              this.ProductsToAdjustSelected.push(element.item);
              this.Productstoadjust.push(element.item_id)
            });
          }
        } else {
          console.log("Error in promotion");
        }
      });
  }

  onChangePromotionType(event: any) {
    if (event.value == 2) {
      this.isproductwise = true;
      this.iscategorywise = false;
    } else {
      this.iscategorywise = true;
      this.isproductwise = false;
    }
  }

  categoryToCountSelectedSave(option: any, input: HTMLInputElement) {
    if (this.categoriestocount.includes(option.id)) {
      this.snackBService.openSnackBar('Duplicate categories to count entry', "Close");
    }
    else {
      this.error_message_category_count = "";
      this.CategoryToCountSelected.push(option);
      this.categoriestocount.push(option.id)
    }

    input.value = '';
    input.blur();

  }

  removeCatCount(catCount: any): void {
    const index = this.CategoryToCountSelected.indexOf(catCount);
    if (index >= 0) {
      this.CategoryToCountSelected.splice(index, 1);
      this.categoriestocount.splice(index, 1);
    }
  }

  categoryToAdjustSelectedSave(option: any, input: HTMLInputElement) {
    if (this.categoriestoadjust.includes(option.id)) {
      this.snackBService.openSnackBar('Duplicate categories to adjust entry', "Close");
    }
    else {
      this.error_message_category_adjust = "";
      this.CategoryToAdjustSelected.push(option);
      this.categoriestoadjust.push(option.id)
    }

    input.value = '';
    input.blur();
  }

  removeCatReceive(catReceive: any): void {
    const index = this.CategoryToAdjustSelected.indexOf(catReceive);
    if (index >= 0) {
      this.CategoryToAdjustSelected.splice(index, 1);
      this.categoriestoadjust.splice(index, 1);
    }
  }

  productsToCountSelectedSave(option: any, input: HTMLInputElement) {
    if (this.Productstocount.includes(option.id)) {
      this.snackBService.openSnackBar('Duplicate categories to count entry', "Close");
    }
    else {
      this.error_message_product_count = "";
      this.ProductsToCountSelected.push(option);
      this.Productstocount.push(option.id)
    }

    input.value = '';
    input.blur();
  }

  removeItemCount(itemCount: any): void {
    const index = this.ProductsToCountSelected.indexOf(itemCount);
    if (index >= 0) {
      this.ProductsToCountSelected.splice(index, 1);
      this.Productstocount.splice(index, 1);
    }
  }

  productsToAdjustSelectedSave(option: any, input: HTMLInputElement) {
    if (this.Productstoadjust.includes(option.id)) {
      this.snackBService.openSnackBar('Duplicate categories to adjust entry', "Close");
    }
    else {
      this.error_message_product_adjust = "";
      this.ProductsToAdjustSelected.push(option);
      this.Productstoadjust.push(option.id)
    }

    input.value = '';
    input.blur();
  }

  removeItemReceive(itemReceive: any): void {
    const index = this.ProductsToAdjustSelected.indexOf(itemReceive);
    if (index >= 0) {
      this.ProductsToAdjustSelected.splice(index, 1);
      this.Productstoadjust.splice(index, 1);
    }
  }
  close() {
    this.dialogRef.close();
  }

  addpromotion() {
    let post: any = {
      promotion_title: this.addpromotionForm.value['promotion_title'],
      promotion_type: this.addpromotionForm.value['promotion_type'],
      is_first_time_buyer: this.addpromotionForm.value['applies_to'] == 2 ? 1 : 0,
      is_applies_to_everyone: this.addpromotionForm.value['applies_to'] == 1 ? 1 : 0,
      discount_type: this.addpromotionForm.value['discount_type'],
      discount_value: this.addpromotionForm.value['discount_value'],
      is_repeat: this.addpromotionForm.value['is_repeat'],
      purchase_qty: this.addpromotionForm.value['purchase_qty'],
      receive_qty: this.addpromotionForm.value['receive_qty'],
      min_qty: this.addpromotionForm.value['min_qty'],
      max_qty: this.addpromotionForm.value['max_qty'],
      trigger_type: this.addpromotionForm.value['trigger_type'],
      offer_start_date: this.offer_start_date.value ? moment(this.offer_start_date.value).format('YYYY-MM-DD') : null,
      offer_end_date: this.offer_end_date.value ? moment(this.offer_end_date.value).format('YYYY-MM-DD') : null,
      categories_to_counts: this.addpromotionForm.value['promotion_type'] == '1' ? this.categoriestocount : [],
      categories_to_receives: this.addpromotionForm.value['promotion_type'] == '1' ? this.categoriestoadjust : [],
      products_to_counts: this.addpromotionForm.value['promotion_type'] == '2' ? this.Productstocount : [],
      products_to_receives: this.addpromotionForm.value['promotion_type'] == '2' ? this.Productstoadjust : [],
      status: this.addpromotionForm.value['status']

    }
    if(this.addpromotionForm.value['trigger_type']=='2' && this.addpromotionForm.value['promotion_coupon_code']){
      post['promotion_coupon_code']=this.addpromotionForm.value['promotion_coupon_code']
    }
    if (this.data.id) {
      this.httpService.put('advance-promotion/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {


      if (this.addpromotionForm.value['promotion_type'] == '1' && this.categoriestocount.length == 0) {
        this.error_message_category_count = "Required"
      }
      else if (this.addpromotionForm.value['promotion_type'] == '1' && this.categoriestoadjust.length == 0) {
        this.error_message_category_adjust = "Required"
      }
      else if (this.addpromotionForm.value['promotion_type'] == '2' && this.Productstocount.length == 0) {
        this.error_message_product_count = "Required"
      }
      else if (this.addpromotionForm.value['promotion_type'] == '2' && this.Productstoadjust.length == 0) {
        this.error_message_product_adjust = "Required"
      }
      else if(!this.addpromotionForm.value['promotion_coupon_code']){
        this.snackBService.openSnackBar("Enter Coupon Code", "Close");
      }
     
      else if (this.addpromotionForm.valid) {
        this.httpService.post('advance-promotion', post)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.close();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
      else {
        this.validateAllFormFields(this.addpromotionForm)
      }
    }
  }
  validateAllFormFields(formGroup: UntypedFormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof UntypedFormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
}
