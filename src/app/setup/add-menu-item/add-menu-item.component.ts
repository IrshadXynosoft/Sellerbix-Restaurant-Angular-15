import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddGroupComponent } from '../add-group/add-group.component';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormControl,
} from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

export interface Tags {
  name: string;
}
export interface groupitems {
  item_id: any;
  items_list_status: any;
}
@Component({
  selector: 'app-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tags[] = [];
  GroupItems: groupitems[] = [];
  public addmenuForm!: UntypedFormGroup;
  public addCombomenuForm!: UntypedFormGroup;
  public addGroupedmenuForm!: UntypedFormGroup;
  public modifierListForm!: UntypedFormGroup;
  groupedErrorArray: any = [];
  ErrorArray: any = [];
  comboErrorArray: any = [];
  public entitiesarray: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Walk-In' },
    { id: 2, name: 'Dine-In' },
    { id: 3, name: 'Call Center' },
    { id: 5, name: 'Online' },
  ];
  public specificationArray: Array<{ name: any; value: any }> = [
    { name: 'Calories (Kcal)', value: null },
    { name: 'Carbs (g)', value: null },
    { name: 'Fat (g)', value: null },
    { name: 'Protien (g)', value: null },
    { name: 'Prepration time (Minutes)', value: null },
  ];
  categoryrecords: any = [];
  combosectionRecords: any = [];
  comboproductrecords: any = [];
  modifierlistrecords: any = [];
  categoryItemRecords: any = [];
  modifiergrouprecords: any = [];
  foodsymbolSelected: any = new Array();
  entitySelected: any = new Array();
  panelOpenState = false;
  foodsymbolsArray: any = [];
  branchrecords: any = [];
  entityRecords: any = [];
  AddedModifierGroupRecords: any = [];
  public locationPrices: any = [];
  public entitieslist: any = [];
  combo_items = new UntypedFormControl();
  list_autocomplete = new UntypedFormControl(); // for modifier list autocomplete
  list_options: any = [];
  options: any = []; // for modifier list autocomplete
  ValidModifierList: boolean = true;
  modifierlist_filteredOptions: Observable<any[]> | undefined;
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  // public validationExpressionForName = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public numericExpression = '^[+]?[0-9]\\d*(\\.\\d{1,2})?$';
  filteredOptions: Observable<any[]> | undefined;
  itemImage: File | null = null;
  ImageBaseDataRegular: any | ArrayBuffer = null;
  ImageBaseDataCombo: any | ArrayBuffer = null;
  ImageBaseDataGroup: any | ArrayBuffer = null;
  entitiesValidityCheck: boolean = true; //for entity validitycheck
  affectedPriceValidityCheck: boolean = false; // for affectedprice validity check
  branchPriceValidityCheck: boolean = false; //for branch price validity check
  modifierListZeroEntryCheck: boolean = true;
  invalidFlag: boolean = false; // for branch price check
  combopricevalid: boolean = false; // for affected price validity check
  schedule = new FormControl('');
  groupedSchedule = new FormControl('');
  comboSchedule = new FormControl('');
  scheduleList: any = [];
  imageChangedEventRegular: any = '';
  imageChangedEventCombo: any = '';
  imageChangedEventGrouped: any = '';
  // croppedImage: any = '';
  // regularSchedule:any = []
  constructor(
    private snackBService: SnackBarService,
    private httpService: HttpServiceService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: UntypedFormBuilder
  ) {
    // this.ImageBaseDataRegular="assets/images/no-image (1).jpg";
    // this.ImageBaseDataGroup="assets/images/no-image (1).jpg";
    // this.ImageBaseDataCombo="assets/images/no-image (1).jpg"
  }

  ngOnInit() {
    this.onBuildForm();
    this.onBuildComboForm();
    this.onBuildGroupedMenuForm();
    this.onBuildModifierListForm();
    this.getMenuCtegory();
    this.getFoodSymbols();
    this.getBranch();
    this.getModifiersGroup();
    this.getEntities();
    // this.getComboSections();
    this.getProducts();
    this.getModifierList();
    this.getSchedules();
    this.filteredOptions = this.combo_items.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.modifierlist_filteredOptions =
      this.list_autocomplete.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterlist(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.list_options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onBuildForm() {
    this.addmenuForm = this.formBuilder.group({
      item_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(75)]),
      ],
      secondary_name: [''],
      barcode: ['', Validators.compose([Validators.maxLength(20)])],
      item_code: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      default_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      tags: [''],
      allow_all_location: true,
      // item_status: true,
      is_editable: false,
      entities: new UntypedFormArray([]),
      location_prices: new UntypedFormArray([]),
      food_symbols: ['', Validators.compose([Validators.required])],
    });
    this.addmenuForm.controls['location_prices'].enable();
  }

  onBuildGroupedMenuForm() {
    this.addGroupedmenuForm = this.formBuilder.group({
      item_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(75)]),
      ],
      secondary_name: [''],
      item_code: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      // item_status: true,
      is_editable: false,
      entities: new UntypedFormArray([]),
      items_in_group: ['', Validators.compose([Validators.required])],
      food_symbols: ['', Validators.compose([Validators.required])],
    });
  }
  onBuildComboForm() {
    this.addCombomenuForm = this.formBuilder.group({
      item_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(75)]),
      ],
      secondary_name: [''],
      barcode: ['', Validators.compose([Validators.maxLength(20)])],
      item_code: ['', Validators.compose([Validators.required])],
      default_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      allow_all_location: true,
      // item_status: true,
      is_editable: false,
      tags: [''],
      entities: new UntypedFormArray([]),
      location_prices: new UntypedFormArray([]),
      combo_items: new UntypedFormArray([]),
      food_symbols: ['', Validators.compose([Validators.required])],
    });
    this.addCombomenuForm.controls['location_prices'].enable();
  }
  onBuildModifierListForm() {
    this.modifierListForm = this.formBuilder.group({
      // item_name: ['', Validators.compose([Validators.required])],
      item_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
    });
  }

  getSchedules() {
    this.httpService.get('schedule').subscribe((result) => {
      if (result.status == 200) {
        this.scheduleList = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, '');
      }
    });
  }

  addmodifierlist(groupIndex: any) {
    if (this.modifierListForm.valid && this.list_autocomplete.value) {
      let flag = false;
      if (this.AddedModifierGroupRecords[groupIndex].modifier_list.length > 0) {
        this.AddedModifierGroupRecords[groupIndex].modifier_list.forEach(
          (obj: any) => {
            if (
              obj.item_name.toLowerCase() ==
              this.list_autocomplete.value.toLowerCase()
            ) {
              flag = true;
            }
          }
        );
      }
      if (!flag) {
        let modifier_list = {
          item_name: this.list_autocomplete.value,
          item_price: this.modifierListForm.value['item_price'],
        };
        this.AddedModifierGroupRecords[groupIndex].modifier_list.push(
          modifier_list
        );
        this.modifierListForm.reset();
        // this.list_autocomplete.reset()
      } else {
        this.snackBService.openSnackBar('Duplicate Entry', 'Close');
      }
      this.validModifierCheck();
    } else {
      this.validateAllFormFields(this.modifierListForm);
    }
  }

  updateListValue(groupindex: any, listindex: any, value: any) {
    this.AddedModifierGroupRecords[groupindex].modifier_list[
      listindex
    ].item_price = value;
  }

  deletemodifierlist(groupIndex: any, listIndex: any) {
    this.AddedModifierGroupRecords[groupIndex].modifier_list.splice(
      listIndex,
      1
    );
    this.validModifierCheck();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Adding tags
    if (value) {
      this.tags.push({ name: value });
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tags): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  getMenuCtegory() {
    this.httpService.get('category').subscribe((result) => {
      if (result.status == 200) {
        this.categoryrecords = result.data.categories;
      } else {
        console.log('Error');
      }
    });
  }

  getComboSections() {
    this.httpService.get('combo').subscribe((result) => {
      if (result.status == 200) {
        this.combosectionRecords = result.data.combos;
      } else {
        console.log('Error');
      }
    });
  }

  getProducts() {
    this.httpService.get('branch-item').subscribe((result) => {
      if (result.status == 200) {
        this.comboproductrecords = result.data;
        this.comboproductrecords.forEach((obj: any) => {
          let objData = {
            id: obj.id,
            name: obj.name,
          };
          this.options.push(objData);
        });
      } else {
        console.log('Error');
      }
    });
  }

  getModifierList() {
    this.httpService.get('modifier').subscribe((result) => {
      if (result.status == 200) {
        this.modifierlistrecords = result.data.modifiers;
        this.modifierlistrecords.forEach((obj: any) => {
          let objData = {
            id: obj.id,
            name: obj.name,
          };
          this.list_options.push(objData);
        });
      } else {
        console.log('Error');
      }
    });
  }

  productSelected(productname: any, id: any) {
    let flag = false;
    let objData: any = {
      item_id: id,
      item_name: productname,
      hide_in_pos: false,
      affected_price_by: '',
      quantity: '',
      // pre_selected: false,
      show_in_web: false,
      // items_list_status : false
    };
    if (this.addCombomenuForm.value['combo_items'].length > 0) {
      this.addCombomenuForm.value['combo_items'].forEach((obj: any) => {
        if (obj.item_name.toLowerCase() == productname.toLowerCase()) {
          flag = true;
        }
      });
    }
    if (!flag) {
      let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;
      items.push(this.createComboItem(objData));
    } else {
      this.snackBService.openSnackBar(productname + ' already added', 'Close');
    }
  }

  deleteComboItem(index: any) {
    let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;
    items.removeAt(index);
  }

  getMenuItemsCategory(event: any) {
    this.httpService
      .get('category-item' + '/' + event.target.value)
      .subscribe((result) => {
        if (result.status == 200) {
          this.GroupItems = [];
          this.categoryItemRecords = result.data.category_items;
          this.categoryItemRecords.forEach((obj: any) => {
            obj.items_list_status = false;
          });
        } else {
          console.log('Error');
        }
      });
  }

  getModifiersGroup() {
    this.httpService.get('modifier-group').subscribe((result) => {
      if (result.status == 200) {
        this.modifiergrouprecords = result.data.modifier_groups;
      } else {
        console.log('Error');
      }
    });
  }

  getEntities() {
    this.httpService.get('entity').subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data.entities;
      } else {
        console.log('Error');
      }
    });
  }

  getFoodSymbols() {
    this.httpService.get('food-symbol').subscribe((result) => {
      if (result.status == 200) {
        this.foodsymbolsArray = result.data.foodsymbols;
      } else {
        console.log('Error');
      }
    });
  }

  deleteGroup(index: any) {
    this.AddedModifierGroupRecords.splice(index, 1);
    this.validModifierCheck();
  }

  get comboFormGroups() {
    return this.addCombomenuForm.get('combo_items') as UntypedFormArray;
  }

  get entitiesFormGroups() {
    return this.addmenuForm.get('entities') as UntypedFormArray;
  }

  get GroupedentitiesFormGroups() {
    return this.addGroupedmenuForm.get('entities') as UntypedFormArray;
  }

  get ConboentitiesFormGroups() {
    return this.addCombomenuForm.get('entities') as UntypedFormArray;
  }

  get locationPricesFormGroups() {
    return this.addmenuForm.get('location_prices') as UntypedFormArray;
  }

  get CombolocationPricesFormGroups() {
    return this.addCombomenuForm.get('location_prices') as UntypedFormArray;
  }

  createItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  createGroupedEntitiesItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  createComboEntitiesItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  createComboPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  createComboItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  branchname(index: any) {
    let form_data = this.addmenuForm.value;
    return form_data.entities[index].location_name;
  }
  comboName(index: any) {
    let form_data = this.addCombomenuForm.value;
    return form_data.combo_items[index].item_name;
  }

  getBranch() {
    // this.httpService.get('get-logged-in-branch', false)
    this.httpService.get('branch', false).subscribe((result) => {
      if (result.status == 200) {
        this.branchrecords = result.data.tenant_branches;
        this.branchrecords.forEach((obj: any) => {
          let objData: any = {
            location_name: obj.name,
            location_id: obj.id,
            pos: false,
            kiosk: false,
            mobile: false,
            self_ordering: false,
            walk_in: false,
            dine_in: false,
            call_center: false,
            take_away: false,
            e_order: false,
          };
          this.entitieslist.push(objData);
          let priceData: any = {
            location_id: obj.id,
            location_price: '',
          };
          this.locationPrices.push(priceData);
        });

        this.entitieslist.forEach((dataObj: any) => {
          let items = this.addmenuForm.get('entities') as UntypedFormArray;
          items.push(this.createItem(dataObj));
        });

        this.entitieslist.forEach((dataObj: any) => {
          let items = this.addGroupedmenuForm.get(
            'entities'
          ) as UntypedFormArray;
          items.push(this.createGroupedEntitiesItem(dataObj));
        });

        this.entitieslist.forEach((dataObj: any) => {
          let items = this.addCombomenuForm.get('entities') as UntypedFormArray;
          items.push(this.createComboEntitiesItem(dataObj));
        });

        this.locationPrices.forEach((dataObj: any) => {
          let items = this.addmenuForm.get(
            'location_prices'
          ) as UntypedFormArray;
          items.push(this.createPriceItem(dataObj));
        });

        this.locationPrices.forEach((dataObj: any) => {
          let items = this.addCombomenuForm.get(
            'location_prices'
          ) as UntypedFormArray;
          items.push(this.createComboPriceItem(dataObj));
        });
      } else {
        console.log('Error');
      }
    });
  }

  onChange(event: any, item: any) {
    item.checked = !item.checked;
    if (item.id && item.checked) {
      this.foodsymbolSelected.push(item.id);
    } else if (item.id && !item.checked) {
      this.foodsymbolSelected.splice(
        this.foodsymbolSelected.indexOf(item.id),
        1
      );
    }
  }

  onChangeCategoryItem(event: any, item: any) {
    item.checked = !item.checked;
    if (item.id && item.checked) {
      this.GroupItems.push({
        item_id: item.id,
        items_list_status: item.items_list_status,
      });
    } else if (item.id && !item.checked) {
      this.GroupItems.splice(this.GroupItems.indexOf(item), 1);
      item.items_list_status = false;
    }
    console.log(this.GroupItems);
  }

  groupedItemStatusChange(e: any, index: any, item: any) {
    if (e.checked) {
      this.GroupItems[index].items_list_status = true;
      item.items_list_status = true;
    } else {
      this.GroupItems[index].items_list_status = false;
      item.items_list_status = false;
    }
    console.log(this.GroupItems);
  }

  showSlide(index: any, item: any) {
    // for enabling toggle
    let found = this.GroupItems.filter(
      (obj: { item_id: any }) => obj.item_id == item.id
    );
    if (found.length > 0) {
      return false;
    }
    return true;
  }

  // onFileChange(event:any) {
  // const reader = new FileReader();
  // if(event.target.files && event.target.files.length) {
  //     this.itemImage = event.target.files[0];
  //     console.log(this.itemImage)

  //  }
  // }
  // onFileChange(files: FileList) {
  //   this.itemImage = files.item(0);;
  //   console.log(this.itemImage)

  // }
  handleFileInputRegular(event: any) {
    this.imageChangedEventRegular = event;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseDataRegular = reader.result?.toString();
    };    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  imageCroppedRegular(event: ImageCroppedEvent) {
    this.ImageBaseDataRegular = event.base64;
  }

  imageCroppedGrouped(event: ImageCroppedEvent) {
    this.ImageBaseDataGroup = event.base64;
  }

  imageCroppedCombo(event: ImageCroppedEvent) {
    this.ImageBaseDataCombo = event.base64;
  }
  handleFileInputCombo(event: any) {
    this.imageChangedEventCombo = event;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseDataCombo = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  handleFileInputGroup(event: any) {
    this.imageChangedEventGrouped = event;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseDataGroup = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  RegularBranchPriceValidityCheck() {
    this.branchPriceValidityCheck = true;
    this.addmenuForm.controls['location_prices'].value.forEach((obj: any) => {
      if (obj.location_price == '' || this.invalidFlag) {
        this.branchPriceValidityCheck = true;
      } else {
        this.branchPriceValidityCheck = false;
      }
    });
  }

  locationValidCheck(value: any) {
    if (value.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$')) {
      this.invalidFlag = false;
    } else {
      this.invalidFlag = true;
    }
    console.log(this.invalidFlag);
  }

  affectedPriceValidCheck(value: any) {
    if (value.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$')) {
      this.combopricevalid = false;
    } else {
      this.combopricevalid = true;
    }
    console.log(this.invalidFlag);
  }

  RegularEntityValidationCheck() {
    this.entitiesValidityCheck = false;
    let flag: any = [];
    this.addmenuForm.value['entities'].forEach((obj: any, i: any) => {
      if (
        obj.call_center ||
        obj.dine_in ||
        obj.e_order ||
        obj.pos ||
        obj.take_away ||
        obj.walk_in
      ) {
        flag[i] = true;
      }
    });
    if (flag.length == this.addmenuForm.value['entities'].length) {
      this.entitiesValidityCheck = true;
    } else {
      this.entitiesValidityCheck = false;
    }
  }

  ComboEntityValidationCheck() {
    this.entitiesValidityCheck = false;
    let flag: any = [];
    this.addCombomenuForm.value['entities'].forEach((obj: any, i: any) => {
      if (
        obj.call_center ||
        obj.dine_in ||
        obj.e_order ||
        obj.pos ||
        obj.take_away ||
        obj.walk_in
      ) {
        flag[i] = true;
      }
    });
    if (flag.length == this.addCombomenuForm.value['entities'].length) {
      this.entitiesValidityCheck = true;
    } else {
      this.entitiesValidityCheck = false;
    }
  }

  GroupedEntityValidationCheck() {
    this.entitiesValidityCheck = false;
    let flag: any = [];
    this.addGroupedmenuForm.value['entities'].forEach((obj: any, i: any) => {
      if (
        obj.call_center ||
        obj.dine_in ||
        obj.e_order ||
        obj.pos ||
        obj.take_away ||
        obj.walk_in
      ) {
        flag[i] = true;
      }
    });
    if (flag.length == this.addGroupedmenuForm.value['entities'].length) {
      this.entitiesValidityCheck = true;
    } else {
      this.entitiesValidityCheck = false;
    }
  }

  addMenuItem() {
    // this.RegularEntityValidationCheck();
    if (!this.addmenuForm.value['allow_all_location']) {
      this.RegularBranchPriceValidityCheck();
    } else {
      this.branchPriceValidityCheck = false;
    }

    if (
      this.addmenuForm.valid &&
      this.ValidModifierList &&
      this.foodsymbolSelected.length > 0 &&
      !this.branchPriceValidityCheck &&
      this.entitiesValidityCheck &&
      this.modifierListZeroEntryCheck
    ) {
      const body = {
        item_name: this.addmenuForm.value['item_name'],
        secondary_name: this.addmenuForm.value['secondary_name'],
        default_price: this.addmenuForm.value['default_price'],
        category_id: this.addmenuForm.value['category_id'],
        item_status: true,
        is_editable: this.addmenuForm.value['is_editable'] ? 1 : 0,
        modifier_group: this.AddedModifierGroupRecords,
        entities: this.addmenuForm.value['entities'],
        food_symbols: this.foodsymbolSelected,
        location_prices: !this.addmenuForm.value['allow_all_location']
          ? this.addmenuForm.value['location_prices']
          : [],
        barcode: this.addmenuForm.value['barcode'],
        item_code: this.addmenuForm.value['item_code'],
        description: this.addmenuForm.value['description'],
        item_type: '1',
        allow_all_location: this.addmenuForm.value['allow_all_location'],
        tags: this.tags,
        file: this.ImageBaseDataRegular,
        specifications: {
          calories: this.specificationArray[0].value
            ? this.specificationArray[0].value
            : 0.0,
          carbs: this.specificationArray[1].value
            ? this.specificationArray[1].value
            : 0.0,
          fat: this.specificationArray[2].value
            ? this.specificationArray[2].value
            : 0.0,
          protien: this.specificationArray[3].value
            ? this.specificationArray[3].value
            : 0.0,
          preparation_time: this.specificationArray[4].value
            ? this.specificationArray[4].value
            : 0.0,
        },
        schedules: this.schedule.value ? this.schedule.value : [],
      };
      this.httpService.post('item', body).subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar('Regular Menu Item  Added', 'Close');
          this.router.navigate(['setup/menuHeader/menu']);
        } else {
          if (result.data) {
            this.ErrorArray = result.data;
          }
          this.snackBService.openSnackBar('Invalid Data', 'Close');
        }
      });
    } else {
      this.validateAllFormFields(this.addmenuForm);
    }
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validationCheck(formGroup: any, formControlName: any) {
    const control = formGroup.get(formControlName);
    control instanceof UntypedFormControl;
    if (control.value || control.touched) {
      if (control.errors) {
        return 'is-invalid';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  validModifierCheck() {
    this.ValidModifierList = false;
    this.modifierListZeroEntryCheck = false;
    if (this.AddedModifierGroupRecords.length > 0) {
      this.AddedModifierGroupRecords.forEach((obj: any) => {
        if (obj.modifier_list.length <= 0) {
          this.modifierListZeroEntryCheck = false;
        } else {
          this.modifierListZeroEntryCheck = true;
        }
        if (obj.modifier_list.length >= obj.limit_maximum) {
          this.ValidModifierList = true;
        } else {
          this.ValidModifierList = false;
        }
      });
    } else {
      this.ValidModifierList = true;
      this.modifierListZeroEntryCheck = true;
    }
  }

  ComboItemValidityCheck() {
    if (this.addCombomenuForm.controls['combo_items'].value.length > 0) {
      this.addCombomenuForm.controls['combo_items'].value.forEach(
        (obj: any) => {
          if (obj.affected_price_by == '' || this.combopricevalid) {
            this.affectedPriceValidityCheck = true;
          } else {
            this.affectedPriceValidityCheck = false;
          }
        }
      );
    } else {
      this.affectedPriceValidityCheck = true;
    }
  }

  ComboBranchPriceValidityCheck() {
    this.branchPriceValidityCheck = true;
    this.addCombomenuForm.controls['location_prices'].value.forEach(
      (obj: any) => {
        if (obj.location_price == '' || this.invalidFlag) {
          this.branchPriceValidityCheck = true;
        } else {
          this.branchPriceValidityCheck = false;
        }
      }
    );
  }

  addComboMenuItem() {
    // this.ComboEntityValidationCheck();
    this.ComboItemValidityCheck();
    if (!this.addCombomenuForm.value['allow_all_location']) {
      this.ComboBranchPriceValidityCheck();
    } else {
      this.branchPriceValidityCheck = false;
    }
    if (
      this.addCombomenuForm.valid &&
      this.foodsymbolSelected.length > 0 &&
      !this.affectedPriceValidityCheck &&
      !this.branchPriceValidityCheck &&
      this.entitiesValidityCheck
    ) {
      const body = {
        item_name: this.addCombomenuForm.value['item_name'],
        secondary_name: this.addCombomenuForm.value['secondary_name'],
        default_price: this.addCombomenuForm.value['default_price'],
        category_id: this.addCombomenuForm.value['category_id'],
        item_status: true,
        is_editable: this.addCombomenuForm.value['is_editable'] ? 1 : 0,
        combo_items: this.addCombomenuForm.value['combo_items'],
        entities: this.addCombomenuForm.value['entities'],
        food_symbols: this.foodsymbolSelected,
        location_prices: !this.addCombomenuForm.value['allow_all_location']
          ? this.addCombomenuForm.value['location_prices']
          : [],
        barcode: this.addCombomenuForm.value['barcode'],
        item_code: this.addCombomenuForm.value['item_code'],
        description: this.addCombomenuForm.value['description'],
        item_type: '3',
        allow_all_location: this.addCombomenuForm.value['allow_all_location'],
        tags: this.tags,
        file: this.ImageBaseDataCombo,
        specifications: {
          calories: this.specificationArray[0].value
            ? this.specificationArray[0].value
            : 0.0,
          carbs: this.specificationArray[1].value
            ? this.specificationArray[1].value
            : 0.0,
          fat: this.specificationArray[2].value
            ? this.specificationArray[2].value
            : 0.0,
          protien: this.specificationArray[3].value
            ? this.specificationArray[3].value
            : 0.0,
          preparation_time: this.specificationArray[4].value
            ? this.specificationArray[4].value
            : 0.0,
        },
        schedules: this.comboSchedule.value ? this.comboSchedule.value : [],
      };
      this.httpService.post('item', body).subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar('Combo Menu Item Added', 'Close');
          this.router.navigate(['setup/menuHeader/menu']);
        } else {
          if (result.data) {
            this.comboErrorArray = result.data;
          }
          this.snackBService.openSnackBar('Invalid Data', 'Close');
        }
      });
    } else {
      this.validateAllFormFields(this.addCombomenuForm);
    }
  }

  addGroupMenuItem() {
    // this.GroupedEntityValidationCheck();
    if (
      this.addGroupedmenuForm.valid &&
      this.foodsymbolSelected.length > 0 &&
      this.GroupItems.length > 0 &&
      this.entitiesValidityCheck
    ) {
      const body = {
        item_name: this.addGroupedmenuForm.value['item_name'],
        secondary_name: this.addGroupedmenuForm.value['secondary_name'],
        category_id: this.addGroupedmenuForm.value['category_id'],
        item_status: true,
        is_editable: this.addGroupedmenuForm.value['is_editable'] ? 1 : 0,
        entities: this.addGroupedmenuForm.value['entities'],
        food_symbols: this.foodsymbolSelected,
        item_code: this.addGroupedmenuForm.value['item_code'],
        description: this.addGroupedmenuForm.value['description'],
        item_type: '2',
        items_in_group: this.GroupItems,
        file: this.ImageBaseDataGroup,
        specifications: {
          calories: this.specificationArray[0].value
            ? this.specificationArray[0].value
            : 0.0,
          carbs: this.specificationArray[1].value
            ? this.specificationArray[1].value
            : 0.0,
          fat: this.specificationArray[2].value
            ? this.specificationArray[2].value
            : 0.0,
          protien: this.specificationArray[3].value
            ? this.specificationArray[3].value
            : 0.0,
          preparation_time: this.specificationArray[4].value
            ? this.specificationArray[4].value
            : 0.0,
        },
        schedules: this.groupedSchedule.value ? this.groupedSchedule.value : [],
      };
      this.httpService.post('item', body).subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar('Grouped Menu Item Added ', 'Close');
          this.router.navigate(['setup/menuHeader/menu']);
        } else {
          if (result.data) {
            this.groupedErrorArray = result.data;
          }
          this.snackBService.openSnackBar('Invalid Data', 'Close');
        }
      });
    } else {
      this.validateAllFormFields(this.addGroupedmenuForm);
    }
  }
  back() {
    this.router.navigate(['setup/menuHeader/menu']);
  }

  addGroup(): void {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '500px',
      data: {
        header: 'Add Group',
        flagset: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.length > 0) {
        let flag = false;
        result = result[0];
        let group = {
          modifier_group_name: result.modifier_group_name,
          limit_minimum: result.limit_minimum,
          limit_maximum: result.limit_maximum,
          can_add_multiple: result.can_add_multiple,
          modifier_list: [],
        };

        if (this.AddedModifierGroupRecords.length > 0) {
          this.AddedModifierGroupRecords.forEach((obj: any) => {
            if (
              obj.modifier_group_name.toLowerCase() ==
              result.modifier_group_name.toLowerCase()
            ) {
              flag = true;
            }
          });
        }
        if (!flag) {
          this.AddedModifierGroupRecords.push(group);
        } else {
          this.snackBService.openSnackBar('Duplicate Entry', 'Close');
        }
        this.validModifierCheck();
      }
    });
  }
  valueCheck(index: any, value: any) {
    if (!isNaN(value)) {
      this.specificationArray[index].value = value;
    } else {
      this.snackBService.openSnackBar('Invalid value entered', 'Close');
    }
  }
}
