import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Constants } from 'src/constants';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface Tags {
  name: string;
}
export interface groupitems {
  item_id: any;
  items_list_status: any;
}
@Component({
  selector: 'app-edit-menu-item',
  templateUrl: './edit-menu-item.component.html',
  styleUrls: ['./edit-menu-item.component.scss'],
})
export class EditMenuItemComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tags[] = [];
  GroupItems: groupitems[] = [];
  templist: any = [];
  tempfoodsymbol: any = [];
  tempfoodsymbol2: any = [];
  public addmenuForm!: UntypedFormGroup;
  public addCombomenuForm!: UntypedFormGroup;
  public addGroupedmenuForm!: UntypedFormGroup;
  public modifierListForm!: UntypedFormGroup;
  groupedErrorArray: any = [];
  ErrorArray: any = [];
  comboErrorArray: any = [];
  public entitiesarray: Array<{ id: number; name: string }> = [
    // { id: 1, name: "POS" },
    { id: 1, name: 'Walk-In' },
    { id: 2, name: 'Dine-In' },
    { id: 3, name: 'Call Center' },
    // { id: 5, name: "Take Away" },
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
  modifiergrouplist: any = [];
  combosectionRecords: any = [];
  comboproductrecords: any = [];
  categoryItemRecords: any = [];
  modifiergrouprecords: any = [];
  modifierlistrecords: any = [];
  foodsymbolSelected: any = new Array();
  entitySelected: any = new Array();
  panelOpenState = false;
  foodsymbolsArray: any = [];
  branchrecords: any = [];
  entityRecords: any = [];
  singleItemRecords: any = [];
  groupedItemSelected: boolean = false;
  AddedModifierGroupRecords: any = [];
  public locationPrices: any = [];
  public entitieslist: any = [];
  public numericExpression = '^[+]?[0-9]\\d*(\\.\\d{1,2})?$';
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  public validationExpressionForName = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  combo_items = new UntypedFormControl();
  list_autocomplete = new UntypedFormControl();
  list_options: any = [];
  options: any = [];
  ValidModifierList: boolean = true; //Flag for list validation
  filteredOptions: Observable<any[]> | undefined;
  modifierlist_filteredOptions: Observable<any[]> | undefined;
  ImageBaseDataRegular: any | ArrayBuffer = null;
  ImageBaseDataNew: any | ArrayBuffer = null;
  // ImageBaseDataComboNew:any | ArrayBuffer=null;
  ImageBaseDataCombo: any | ArrayBuffer = null;
  ImageBaseDataGroup: any | ArrayBuffer = null;
  // ImageBaseDataGroupedNew:any | ArrayBuffer=null;
  regularMenuFlag: boolean = false;
  groupedMenuFlag: boolean = false;
  comboMenuFlag: boolean = false;
  affectedPriceValidityCheck: boolean = false;
  branchPriceValidityCheck: boolean = false;
  entitiesValidityCheck: boolean = true;
  modifierListZeroEntryCheck: boolean = true;
  invalidFlag: boolean = false; // for branch price check
  combopricevalid: boolean = false; // for affected price validity check
  schedule = new FormControl('');
  groupedSchedule = new FormControl('');
  comboSchedule = new FormControl('');
  scheduleList: any = [];
  selectedscheduledList: any = [];
  imageChangedEvent: any = '';
  constructor(
    private constant: Constants,
    private route: ActivatedRoute,
    private snackBService: SnackBarService,
    private httpService: HttpServiceService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: UntypedFormBuilder
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Initializes form groups, fetches necessary data, and sets up filtered options for combo items and modifier list.
   */
  ngOnInit(): void {
    // Initialize form groups
    this.onBuildForm();
    this.onBuildComboForm();
    this.onBuildGroupedMenuForm();
    this.onBuildModifierListForm();

    // Fetch necessary data
    this.getMenuCtegory();
    this.getModifiersGroup();
    this.getEntities();
    this.getProducts();
    this.getMenuEditSingle();
    this.getModifierList();
    this.getSchedules();

    // Set up filtered options for combo items
    this.filteredOptions = this.combo_items.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    // Set up filtered options for modifier list
    this.modifierlist_filteredOptions =
      this.list_autocomplete.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterlist(value))
      );
  }

  /**
   * Private function used to filter a list of options based on the input value.
   * @param value - The input value to filter the options.
   * @returns An array of filtered options whose names include the specified value.
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Private function used to filter a list of options for a specific list based on the input value.
   * @param value - The input value to filter the options.
   * @returns An array of filtered options whose names include the specified value.
   */
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
      barcode: [''],
      item_code: ['', Validators.compose([Validators.required])],
      default_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
      description: [''],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      allow_all_location: false,
      is_editable: [''],
      // item_status: [''],
      tags: [''],
      entities: new UntypedFormArray([]),
      location_prices: new UntypedFormArray([]),
      food_symbols: [''],
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
      description: [''],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      // item_status: [''],
      is_editable: [''],
      entities: new UntypedFormArray([]),
      items_in_group: [''],
      food_symbols: [''],
    });
  }
  onBuildComboForm() {
    this.addCombomenuForm = this.formBuilder.group({
      item_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(75)]),
      ],
      secondary_name: [''],
      barcode: [''],
      item_code: ['', Validators.compose([Validators.required])],
      default_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
      description: [''],
      category_id: ['', Validators.compose([Validators.required])],
      image: [''],
      allow_all_location: false,
      is_editable: [''],
      tags: [''],
      // item_status: [''],
      entities: new UntypedFormArray([]),
      location_prices: new UntypedFormArray([]),
      combo_items: new UntypedFormArray([]),
      food_symbols: [''],
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

  /**
   * Adds a modifier list to a specified modifier group.
   * @param groupIndex - The index of the modifier group to which the modifier list will be added.
   */
  addmodifierlist(groupIndex: any): void {
    // Check if the modifier list form is valid and a value is selected from the autocomplete list
    if (this.modifierListForm.valid && this.list_autocomplete.value) {
      let flag = false;

      // Check for duplicate entries in the existing modifier list of the specified group
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

      // Add the modifier list if not a duplicate
      if (!flag) {
        let modifier_list = {
          item_name: this.list_autocomplete.value,
          item_price: this.modifierListForm.value['item_price'],
        };

        this.AddedModifierGroupRecords[groupIndex].modifier_list.push(
          modifier_list
        );
        this.modifierListForm.reset();
      } else {
        this.snackBService.openSnackBar('Duplicate Entry', 'Close');
      }

      // Perform validation check for the overall modifier list
      this.validModifierCheck();
    } else {
      // Validate all form fields if the modifier list form is not valid
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

  deleteModifier(index: any) {
    this.AddedModifierGroupRecords.splice(index, 1);
    this.validModifierCheck();
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

  /**
   * Retrieves details of a single menu item for editing.
   */
  getMenuEditSingle() {
    // Make an HTTP request to fetch details of the menu item with the specified ID
    this.httpService
      .get('item/' + this.route.snapshot.params.id)
      .subscribe((result) => {
        if (result.status == 200) {
          // Extract data from the API response
          this.singleItemRecords = result.data;

          // Determine the type of menu item (Regular, Grouped, or Combo)
          if (this.singleItemRecords[0].item_type == 1) {
            this.regularMenuFlag = true;
          } else if (this.singleItemRecords[0].item_type == 2) {
            this.groupedMenuFlag = true;
          } else {
            this.comboMenuFlag = true;
          }

          // Extract food symbols and mark selected ones
          this.tempfoodsymbol = result.data[0].item_food_symbol;
          this.tempfoodsymbol.forEach((obj: any) => {
            if (obj.is_selected) {
              this.foodsymbolSelected.push(obj.food_symbol_id);
            }
          });

          // Load images based on item type
          this.ImageBaseDataRegular = result.data[0].image_ul
            ? this.constant.imageBasePath + result.data[0].image_ul
            : 'assets/images/no-image (1).jpg';
          this.ImageBaseDataGroup = result.data[0].image_ul
            ? this.constant.imageBasePath + result.data[0].image_ul
            : 'assets/images/no-image (1).jpg';
          this.ImageBaseDataCombo = result.data[0].image_ul
            ? this.constant.imageBasePath + result.data[0].image_ul
            : 'assets/images/no-image (1).jpg';

          // Initialize modifier group list
          this.modifiergrouplist = [];

          // Process modifier groups and lists
          if (result.data[0].modifier_group) {
            let modifierGroup = result.data[0].modifier_group;
            let groupIndex = 0;

            // Iterate through each modifier group
            modifierGroup.forEach((groupObj: any) => {
              let group = {
                modifier_group_name: groupObj.modifier_group_name,
                limit_minimum: groupObj.min_qty,
                limit_maximum: groupObj.max_qty,
                can_add_multiple: groupObj.can_add_multiple,
                modifier_group_id: groupObj.modifier_group_id,
                modifier_list: [],
              };

              // Add the group to the list
              this.AddedModifierGroupRecords.push(group);

              // Iterate through each modifier list within the group
              groupObj.modifier_list?.forEach((modifierlistObj: any) => {
                let modifier_list = {
                  item_name: modifierlistObj.item_name,
                  item_price: modifierlistObj.item_price,
                };

                // Add the modifier list to the group
                this.AddedModifierGroupRecords[groupIndex].modifier_list.push(
                  modifier_list
                );
              });

              // Move to the next group
              groupIndex++;
            });
          }

          // Process combo item list
          let comboitemlist = [];
          if (result.data[0].combo_item) {
            comboitemlist = result.data[0].combo_item;
            comboitemlist.forEach((obj: any) => {
              let objData: any = {
                item_id: obj.item_id,
                item_name: obj.item_name,
                hide_in_pos: obj.hide_in_pos,
                affected_price_by: obj.affected_price_by,
                pre_selected: obj.pre_selected,
                show_in_web: obj.show_in_web,
                quantity: obj.quantity,
              };

              // Add the combo item to the form
              let items = this.addCombomenuForm.get(
                'combo_items'
              ) as UntypedFormArray;
              items.push(this.createComboItem(objData));
            });
          }

          // Process grouped item list
          let groupitemlist = [];
          if (result.data[0].group_item) {
            this.GroupItems = [];
            groupitemlist = result.data[0].group_item;
            groupitemlist.forEach((obj: any) => {
              this.GroupItems.push({
                item_id: obj.item_id,
                items_list_status: obj.items_list_status,
              });
            });
          }

          // Fetch branch information
          this.getBranch();

          // Populate form values based on the item type
          this.addmenuForm.patchValue({
            item_name: this.singleItemRecords[0].item_name,
            secondary_name: this.singleItemRecords[0].item_sec_name,
            barcode: this.singleItemRecords[0].bar_code,
            item_code: this.singleItemRecords[0].item_code,
            default_price: this.singleItemRecords[0].default_price,
            description: this.singleItemRecords[0].description,
            allow_all_location: this.singleItemRecords[0].allow_all_location,
            category_id: this.singleItemRecords[0].category.category_id,
            is_editable: this.singleItemRecords[0].is_editable,
          });

          this.addGroupedmenuForm.patchValue({
            item_name: this.singleItemRecords[0].item_name,
            secondary_name: this.singleItemRecords[0].item_sec_name,
            barcode: this.singleItemRecords[0].bar_code,
            item_code: this.singleItemRecords[0].item_code,
            default_price: this.singleItemRecords[0].default_price,
            description: this.singleItemRecords[0].description,
            allow_all_location: this.singleItemRecords[0].allow_all_location,
            category_id: this.singleItemRecords[0].category.category_id,
            is_editable: this.singleItemRecords[0].is_editable,
          });

          this.addCombomenuForm.patchValue({
            item_name: this.singleItemRecords[0].item_name,
            secondary_name: this.singleItemRecords[0].item_sec_name,
            barcode: this.singleItemRecords[0].bar_code,
            item_code: this.singleItemRecords[0].item_code,
            default_price: this.singleItemRecords[0].default_price,
            description: this.singleItemRecords[0].description,
            allow_all_location: this.singleItemRecords[0].allow_all_location,
            category_id: this.singleItemRecords[0].category.category_id,
            is_editable: this.singleItemRecords[0].is_editable,
          });

          // Fetch the menu items of the specified category
          this.getMenuItemsCategory(
            this.singleItemRecords[0].category.category_id
          );

          // Populate specification values
          this.specificationArray[0].value = this.singleItemRecords[0]
            .item_specifications
            ? this.singleItemRecords[0].item_specifications.calories
            : null;
          this.specificationArray[1].value = this.singleItemRecords[0]
            .item_specifications
            ? this.singleItemRecords[0].item_specifications.carb
            : null;
          this.specificationArray[2].value = this.singleItemRecords[0]
            .item_specifications
            ? this.singleItemRecords[0].item_specifications.fat
            : null;
          this.specificationArray[3].value = this.singleItemRecords[0]
            .item_specifications
            ? this.singleItemRecords[0].item_specifications.protien
            : null;
          this.specificationArray[4].value = this.singleItemRecords[0]
            .item_specifications
            ? this.singleItemRecords[0].item_specifications.preparation_time
            : null;

          // Fetch and mark selected schedules
          this.singleItemRecords[0].item_schedules?.forEach((obj: any) => {
            this.selectedscheduledList.push(obj.schedule_id);
          });

          // Set the selected schedules in the form
          this.schedule.setValue(this.selectedscheduledList);
          this.comboSchedule.setValue(this.selectedscheduledList);
          this.groupedSchedule.setValue(this.selectedscheduledList);

          // Set tags
          this.tags = this.singleItemRecords[0].tags
            ? this.singleItemRecords[0].tags
            : [];
        } else {
          console.log('Error In Single Menu Get');
        }
      });
  }

  /**
   * Handles the change event for a food symbol.
   * @param event - The change event object.
   * @param item - The food symbol item.
   */
  onChange(event: any, item: any) {
    // Toggle the 'is_selected' property of the food symbol item
    item.is_selected = !item.is_selected;

    // Check if the food symbol has an ID and is selected
    if (item.food_symbol_id && item.is_selected) {
      // Add the food symbol ID to the selected symbols list
      this.foodsymbolSelected.push(item.food_symbol_id);
    } else if (item.food_symbol_id && !item.is_selected) {
      // Remove the food symbol ID from the selected symbols list
      this.foodsymbolSelected.splice(
        this.foodsymbolSelected.indexOf(item.id),
        1
      );
    }
  }

  /**
   * Handles the selection of a product for a combo menu.
   * @param productname - The name of the selected product.
   * @param id - The ID of the selected product.
   */
  productSelected(productname: any, id: any) {
    // Flag to check if the product is already added to the combo
    let flag = false;

    // Data object for the selected product in the combo
    let objData: any = {
      item_id: id,
      item_name: productname,
      hide_in_pos: false,
      affected_price_by: '',
      quantity: '',
      show_in_web: false,
    };

    // Check if combo_items array has existing items
    if (this.addCombomenuForm.value['combo_items'].length > 0) {
      // Iterate through existing combo items
      this.addCombomenuForm.value['combo_items'].forEach((obj: any) => {
        // Check if the current item has the same name as the selected product
        if (obj.item_name.toLowerCase() === productname.toLowerCase()) {
          // Set flag to true if the product is already added
          flag = true;
        }
      });
    }

    // If the product is not already added, add it to the combo_items array
    if (!flag) {
      let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;
      items.push(this.createComboItem(objData));
    } else {
      // Show a snack bar message for duplicate entry
      this.snackBService.openSnackBar(productname + ' already added', 'Close');
    }
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

  deleteComboItem(index: any) {
    let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;
    items.removeAt(index);
  }

  getMenuItemsCategory(id: any) {
    this.httpService.get('category-item' + '/' + id).subscribe((result) => {
      if (result.status == 200) {
        this.categoryItemRecords = result.data.category_items;
        this.categoryItemRecords.forEach((obj: any) => {
          this.GroupItems.forEach((obj2: any) => {
            if (obj.id == obj2.item_id) {
              obj.deleted_at = true;
              // obj.items_list_status = obj2.items_list_status
            }
          });
        });
        console.log(this.categoryItemRecords);
      } else {
        console.log('Error');
      }
    });
  }
  // checkIfPresent(category_id: any){
  //   this.GroupItems.forEach((obj:any) =>{
  //     if(obj.item_id == category_id) {
  //       this.groupedItemSelected =true;
  //     }
  //   })
  // }
  getMenuItemsCategoryFromEvent(event: any) {
    this.httpService
      .get('category-item' + '/' + event.target.value)
      .subscribe((result) => {
        if (result.status == 200) {
          this.categoryItemRecords = result.data.category_items;
          this.categoryItemRecords.forEach((obj: any) => {
            this.GroupItems.forEach((obj2: any) => {
              if (obj.id == obj2.item_id) {
                obj.deleted_at = true;
              }
            });
          });
          this.GroupItems = [];
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

  get comboFormGroups() {
    return this.addCombomenuForm.get('combo_items') as UntypedFormArray;
  }

  get entitiesFormGroups() {
    return this.addmenuForm.get('entities') as UntypedFormArray;
  }

  get foodsymbolsFormGroups() {
    return this.addmenuForm.get('food_symbols') as UntypedFormArray;
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

  createFoodsymbolItem(dataObj: any): UntypedFormGroup {
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
  combobranchname(index: any) {
    let form_data = this.addCombomenuForm.value;
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
        let objData: any;
        let tempData: any = [];
        this.singleItemRecords[0].item_entity.forEach((obj: any) => {
          tempData.push(obj.branch_id);
        });
        this.branchrecords.forEach((obj: any) => {
          this.singleItemRecords[0].item_entity.forEach((obj2: any) => {
            if (obj2.branch_id == obj.id) {
              objData = {
                location_name: obj.name,
                location_id: obj.id,
                pos: obj2.is_pos_entity,
                kiosk: obj2.is_kiosk_entity,
                mobile: obj2.is_mobile_entity,
                self_ordering: obj2.is_self_ordering_entity,
                walk_in: obj2.is_walk_in,
                dine_in: obj2.is_dine_in,
                call_center: obj2.is_call_center,
                take_away: obj2.is_take_away,
                e_order: obj2.is_e_order,
              };
              this.entitieslist.push(objData);
            } else if (!tempData.includes(obj.id)) {
              objData = {
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
              tempData.push(obj.id);
            }
          });
          let priceData: any;
          this.locationPrices = [];
          this.singleItemRecords[0].item_location_price?.forEach(
            (obj2: any) => {
              priceData = {
                location_id: obj2.branch_id,
                location_price: obj2.branch_price,
              };
              this.locationPrices.push(priceData);
            }
          );
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

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  imageCropped(event: ImageCroppedEvent) {
    this.ImageBaseDataNew = event.base64;
  }

  handleFileInput(event: any) {
    this.imageChangedEvent = event;
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseDataNew = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onChangeCategoryItem(event: any, item: any) {
    // item.checked = !item.checked;
    // if (item.id && item.checked) {
    //   this.GroupItems.push({ item_id: item.id });
    // }
    // else if (item.id && !item.checked) {
    //   this.GroupItems.splice(this.GroupItems.indexOf(item),1)
    // }
    if (event.checked) {
      if (this.GroupItems.length > 0) {
        // this.GroupItems.forEach((obj: any) => {
        if (!this.GroupItems.find((object) => object['item_id'] == item.id)) {
          this.GroupItems.push({
            item_id: item.id,
            items_list_status: item.items_list_status,
          });
        }
        // });
      } else {
        this.GroupItems.push({
          item_id: item.id,
          items_list_status: item.items_list_status,
        });
      }
    } else {
      if (this.GroupItems.length > 0) {
        this.GroupItems.splice(this.GroupItems.indexOf(item), 1);
        item.items_list_status = false;
      }
    }
  }

  groupedItemStatusChange(e: any, index: any, item: any) {
    if (e.checked) {
      this.GroupItems[index].items_list_status = true;
      item.items_list_status = true;
    } else {
      this.GroupItems[index].items_list_status = false;
      item.items_list_status = false;
    }
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
    console.log(flag);
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
    console.log(flag);
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

  /**
   * Updates an existing regular menu item.
   * - Validates form fields.
   * - Checks modifier list, food symbols, branch prices, entities, and other criteria.
   * - Sends an HTTP PUT request to update the menu item.
   */
  UpdateMenuItem() {
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
        item_status: this.singleItemRecords[0].status,
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
        file: this.ImageBaseDataNew ? this.ImageBaseDataNew : null,
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
      this.httpService
        .put('item/' + this.route.snapshot.params.id, body)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Regular Menu Item Updated',
              'Close'
            );
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

  ComboItemValidityCheck() {
    this.affectedPriceValidityCheck = true;
    this.addCombomenuForm.controls['combo_items'].value.forEach((obj: any) => {
      if (obj.affected_price_by == '' || this.combopricevalid) {
        this.affectedPriceValidityCheck = true;
      } else {
        this.affectedPriceValidityCheck = false;
      }
    });
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

  /**
   * Updates an existing combo menu item.
   * - Validates form fields.
   * - Checks affected prices, branch prices, entities, and other criteria.
   * - Sends an HTTP PUT request to update the menu item.
   */
  updateComboMenuItem() {
    // this.ComboEntityValidationCheck();
    this.ComboItemValidityCheck();
    if (!this.addCombomenuForm.value['allow_all_location']) {
      this.ComboBranchPriceValidityCheck();
    } else {
      this.branchPriceValidityCheck = false;
    }
    if (
      this.addCombomenuForm.valid &&
      !this.affectedPriceValidityCheck &&
      !this.branchPriceValidityCheck &&
      this.entitiesValidityCheck
    ) {
      const body = {
        item_name: this.addCombomenuForm.value['item_name'],
        secondary_name: this.addCombomenuForm.value['secondary_name'],
        default_price: this.addCombomenuForm.value['default_price'],
        category_id: this.addCombomenuForm.value['category_id'],
        item_status: this.singleItemRecords[0].status,
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
        file: this.ImageBaseDataNew ? this.ImageBaseDataNew : null,
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
      this.httpService
        .put('item/' + this.route.snapshot.params.id, body)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar('Combo Item Updated', 'Close');
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

  /**
   * Updates an existing grouped menu item.
   * - Validates form fields.
   * - Checks affected prices, branch prices, entities, and other criteria.
   * - Sends an HTTP PUT request to update the menu item.
   */
  UpdateGroupMenuItem() {
    // this.GroupedEntityValidationCheck();
    if (
      this.addGroupedmenuForm.valid &&
      this.entitiesValidityCheck &&
      this.GroupItems.length > 0 &&
      this.foodsymbolSelected.length > 0
    ) {
      const body = {
        item_name: this.addGroupedmenuForm.value['item_name'],
        secondary_name: this.addGroupedmenuForm.value['secondary_name'],
        category_id: this.addGroupedmenuForm.value['category_id'],
        item_status: this.singleItemRecords[0].status,
        is_editable: this.addGroupedmenuForm.value['is_editable'] ? 1 : 0,
        entities: this.addGroupedmenuForm.value['entities'],
        food_symbols: this.foodsymbolSelected,
        item_code: this.addGroupedmenuForm.value['item_code'],
        description: this.addGroupedmenuForm.value['description'],
        item_type: '2',
        items_in_group: this.GroupItems,
        file: this.ImageBaseDataNew ? this.ImageBaseDataNew : null,
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
      this.httpService
        .put('item/' + this.route.snapshot.params.id, body)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Grouped Menu Item Updated',
              'Close'
            );
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

  addGroup(flag: any, groupindex: any = null): void {
    if (flag == 'edit') {
      const dialogRef = this.dialog.open(AddGroupComponent, {
        width: '500px',
        data: {
          header: 'Edit Group',
          modifier_group_name:
            this.AddedModifierGroupRecords[groupindex].modifier_group_name,
          limit_minimum:
            this.AddedModifierGroupRecords[groupindex].limit_minimum,
          limit_maximum:
            this.AddedModifierGroupRecords[groupindex].limit_maximum,
          modifier_group_id:
            this.AddedModifierGroupRecords[groupindex].modifier_group_id,
          can_add_multiple:
            this.AddedModifierGroupRecords[groupindex].can_add_multiple,
          flagset: false,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.length > 0) {
          result = result[0];
          this.AddedModifierGroupRecords[groupindex].modifier_group_name =
            result.modifier_group_name;
          this.AddedModifierGroupRecords[groupindex].limit_minimum =
            result.limit_minimum;
          this.AddedModifierGroupRecords[groupindex].limit_maximum =
            result.limit_maximum;
          this.AddedModifierGroupRecords[groupindex].can_add_multiple =
            result.can_add_multiple;
          this.AddedModifierGroupRecords[groupindex].modifier_group_id =
            result.modifier_group_id;
          this.validModifierCheck();
        }
      });
    } else {
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
  }

  valueCheck(index: any, value: any) {
    if (!isNaN(value)) {
      this.specificationArray[index].value = value;
    } else {
      this.snackBService.openSnackBar('Invalid value entered', 'Close');
    }
  }
}
