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

  /**
   * Initializes the component by building forms, fetching data, and setting up autocomplete options.
   *
   * @returns void
   */
  ngOnInit(): void {
    // Build forms for menu items
    this.onBuildForm();
    this.onBuildComboForm();
    this.onBuildGroupedMenuForm();
    this.onBuildModifierListForm();

    // Fetch data from APIs
    this.getMenuCtegory();
    this.getFoodSymbols();
    this.getBranch();
    this.getModifiersGroup();
    this.getEntities();
    this.getProducts();
    this.getModifierList();
    this.getSchedules();

    // Set up autocomplete options for combo items and modifier lists
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

  /**
   * Filters combo item options based on the provided value.
   *
   * @param value - The input value for filtering.
   * @returns An array of filtered combo item options.
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Filters modifier list options based on the provided value.
   *
   * @param value - The input value for filtering.
   * @returns An array of filtered modifier list options.
   */
  private _filterlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.list_options.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Initializes and builds the form for adding or editing a menu item.
   * This method is responsible for creating the Angular FormGroup instance
   * with the necessary form controls and validators.
   *
   * @returns {void}
   */
  onBuildForm(): void {
    // Create the Angular FormGroup instance for menu item form
    this.addmenuForm = this.formBuilder.group({
      // Main item details
      item_name: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.maxLength(75), // Maximum length of 75 characters
        ]),
      ],
      secondary_name: [''], // Optional secondary name
      barcode: [
        '', // Initial value
        Validators.compose([
          Validators.maxLength(20), // Maximum length of 20 characters
        ]),
      ],
      item_code: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.maxLength(20), // Maximum length of 20 characters
        ]),
      ],
      default_price: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.pattern(this.numericExpression), // Numeric pattern validation
        ]),
      ],
      description: [
        '', // Initial value
        Validators.compose([
          Validators.maxLength(200), // Maximum length of 200 characters
        ]),
      ],
      category_id: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ],
      image: [''], // URL for the item image
      tags: [''], // Optional tags for categorization
      allow_all_location: true, // Option to allow the item in all locations
      is_editable: false, // Option to make the item editable
      // Form arrays for entities and location prices
      entities: new UntypedFormArray([]), // Array for associated entities
      location_prices: new UntypedFormArray([]), // Array for location-specific prices
      food_symbols: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ], // Food symbols associated with the item
    });

    // Enable the location_prices form control
    this.addmenuForm.controls['location_prices'].enable();
  }

  /**
   * Initializes and builds the form for adding or editing a grouped menu item.
   * This method creates an Angular FormGroup instance with the necessary
   * form controls and validators for grouped menu items.
   *
   * @returns {void}
   */
  onBuildGroupedMenuForm(): void {
    // Create the Angular FormGroup instance for grouped menu item form
    this.addGroupedmenuForm = this.formBuilder.group({
      item_name: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.maxLength(75), // Maximum length of 75 characters
        ]),
      ],
      secondary_name: [''], // Optional secondary name
      item_code: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ],
      description: [
        '', // Initial value
        Validators.compose([
          Validators.maxLength(200), // Maximum length of 200 characters
        ]),
      ],
      category_id: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ],
      image: [''], // URL for the item image
      is_editable: false, // Option to make the item editable
      entities: new UntypedFormArray([]), // Array for associated entities
      items_in_group: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ], // Number of items in the group
      food_symbols: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ], // Food symbols associated with the item
    });
  }

  /**
   * Initializes and builds the form for adding or editing a combo menu item.
   * This method creates an Angular FormGroup instance with the necessary
   * form controls and validators for combo menu items.
   *
   * @returns {void}
   */
  onBuildComboForm(): void {
    // Create the Angular FormGroup instance for combo menu item form
    this.addCombomenuForm = this.formBuilder.group({
      item_name: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.maxLength(75), // Maximum length of 75 characters
        ]),
      ],
      secondary_name: [''], // Optional secondary name
      barcode: [
        '', // Initial value
        Validators.compose([
          Validators.maxLength(20), // Maximum length of 20 characters
        ]),
      ],
      item_code: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ],
      default_price: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.pattern(this.numericExpression), // Numeric pattern validation
        ]),
      ],
      description: [
        '', // Initial value
        Validators.compose([
          Validators.maxLength(200), // Maximum length of 200 characters
        ]),
      ],
      category_id: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ],
      image: [''], // URL for the item image
      allow_all_location: true, // Option to allow the item in all locations
      is_editable: false, // Option to make the item editable
      tags: [''], // Optional tags for categorization
      entities: new UntypedFormArray([]), // Array for associated entities
      location_prices: new UntypedFormArray([]), // Array for location-specific prices
      combo_items: new UntypedFormArray([]), // Array for combo items
      food_symbols: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
        ]),
      ], // Food symbols associated with the item
    });

    // Enable the location_prices form control
    this.addCombomenuForm.controls['location_prices'].enable();
  }

  /**
   * Initializes and builds the form for adding or editing a modifier list item.
   * This method creates an Angular FormGroup instance with the necessary
   * form controls and validators for modifier list items.
   *
   * @returns {void}
   */
  onBuildModifierListForm(): void {
    // Create the Angular FormGroup instance for modifier list form
    this.modifierListForm = this.formBuilder.group({
      item_price: [
        '', // Initial value
        Validators.compose([
          Validators.required, // Required field
          Validators.pattern(this.numericExpression), // Numeric pattern validation
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
   * Adds a modifier list item to the specified group.
   * Checks if the form is valid and the modifier list item is not a duplicate.
   *
   * @param {any} groupIndex - Index of the modifier group to which the item is added.
   * @returns {void}
   */
  addmodifierlist(groupIndex: any): void {
    // Check if the modifierListForm is valid and list_autocomplete has a value
    if (this.modifierListForm.valid && this.list_autocomplete.value) {
      let flag = false;

      // Check for duplicate entries in the existing modifier list of the group
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

      // If not a duplicate, add the modifier list item to the group
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
        // Display a notification for duplicate entry
        this.snackBService.openSnackBar('Duplicate Entry', 'Close');
      }

      // Perform a validation check for the overall modifier group validity
      this.validModifierCheck();
    } else {
      // Validate all form fields if the form is not valid
      this.validateAllFormFields(this.modifierListForm);
    }
  }

  /**
   * Updates the item_price value of a modifier list item in a specified group.
   *
   * @param {any} groupIndex - Index of the modifier group containing the item.
   * @param {any} listIndex - Index of the modifier list item to be updated.
   * @param {any} value - New value to be assigned to the item_price.
   * @returns {void}
   */
  updateListValue(groupIndex: any, listIndex: any, value: any): void {
    this.AddedModifierGroupRecords[groupIndex].modifier_list[
      listIndex
    ].item_price = value;
  }

  /**
   * Deletes a modifier list item from a specified group.
   * Checks if the overall modifier group is still valid after deletion.
   *
   * @param {any} groupIndex - Index of the modifier group containing the item.
   * @param {any} listIndex - Index of the modifier list item to be deleted.
   * @returns {void}
   */
  deletemodifierlist(groupIndex: any, listIndex: any): void {
    this.AddedModifierGroupRecords[groupIndex].modifier_list.splice(
      listIndex,
      1
    );
    this.validModifierCheck();
  }

  /**
   * Adds a tag to the list of tags when triggered by a MatChipInputEvent.
   *
   * @param {MatChipInputEvent} event - MatChipInputEvent triggered by user input.
   * @returns {void}
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Adding tags
    if (value) {
      this.tags.push({ name: value });
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  /**
   * Removes a tag from the list of tags.
   *
   * @param {Tags} tag - Tag to be removed.
   * @returns {void}
   */
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

  /**
   * Handles the selection of a product for the combo menu.
   *
   * @param {any} productname - The name of the selected product.
   * @param {any} id - The unique identifier of the selected product.
   * @returns {void}
   */
  productSelected(productname: any, id: any): void {
    let flag = false;
    let objData: any = {
      item_id: id,
      item_name: productname,
      hide_in_pos: false,
      affected_price_by: '',
      quantity: '',
      show_in_web: false,
    };

    // Check if the selected product is already added to the combo_items
    if (this.addCombomenuForm.value['combo_items'].length > 0) {
      this.addCombomenuForm.value['combo_items'].forEach((obj: any) => {
        if (obj.item_name.toLowerCase() == productname.toLowerCase()) {
          flag = true;
        }
      });
    }

    // Add the selected product to combo_items if not already added
    if (!flag) {
      let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;
      items.push(this.createComboItem(objData));
    } else {
      this.snackBService.openSnackBar(productname + ' already added', 'Close');
    }
  }

  /**
   * Deletes a combo item at the specified index from the combo_items array.
   *
   * @param {any} index - The index of the combo item to be deleted.
   * @returns {void}
   */
  deleteComboItem(index: any): void {
    // Get the combo_items array from the form
    let items = this.addCombomenuForm.get('combo_items') as UntypedFormArray;

    // Remove the combo item at the specified index
    items.removeAt(index);
  }

  /**
   * Fetches menu items based on the selected category.
   *
   * @param {any} event - The event object triggered by the category selection.
   * @returns {void}
   */
  getMenuItemsCategory(event: any): void {
    // Make an HTTP request to get menu items for the selected category
    this.httpService
      .get('category-item' + '/' + event.target.value)
      .subscribe((result) => {
        if (result.status == 200) {
          // Reset GroupItems array
          this.GroupItems = [];

          // Update categoryItemRecords with the fetched data
          this.categoryItemRecords = result.data.category_items;

          // Set items_list_status to false for each category item
          this.categoryItemRecords.forEach((obj: any) => {
            obj.items_list_status = false;
          });
        } else {
          console.error('Error:', result.message);
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

  /**
   * Deletes a modifier group from the AddedModifierGroupRecords array.
   *
   * @param {any} index - The index of the modifier group to be deleted.
   * @returns {void}
   */
  deleteGroup(index: any): void {
    // Remove the modifier group at the specified index
    this.AddedModifierGroupRecords.splice(index, 1);

    // Perform validation after deletion
    this.validModifierCheck();
  }

  /**
   * Getter method for retrieving the 'combo_items' form array from the 'addCombomenuForm'.
   *
   * @returns {UntypedFormArray} The 'combo_items' form array.
   */
  get comboFormGroups(): UntypedFormArray {
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

  /**
   * Creates and returns an instance of the UntypedFormGroup based on the provided data object.
   *
   * @param {any} dataObj - The data object used to initialize the form group.
   * @returns {UntypedFormGroup} - The created UntypedFormGroup.
   */
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
  /**
   * Retrieves and returns the location name of the entity at the specified index.
   *
   * @param {any} index - The index of the entity.
   * @returns {string} - The location name of the entity.
   */
  branchname(index: any): string {
    let form_data = this.addmenuForm.value;
    return form_data.entities[index].location_name;
  }

  /**
   * Retrieves and returns the item name of the combo item at the specified index.
   *
   * @param {any} index - The index of the combo item.
   * @returns {string} - The item name of the combo item.
   */
  comboName(index: any): string {
    let form_data = this.addCombomenuForm.value;
    return form_data.combo_items[index].item_name;
  }

  getBranch() {
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

        // Iterate over the entitieslist array
        this.entitieslist.forEach((dataObj: any) => {
          // Get the 'entities' form array from the 'addmenuForm'
          let items = this.addmenuForm.get('entities') as UntypedFormArray;

          // Create a form group using the createItem function and add it to the form array
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

  /**
   * Event handler for checkbox state changes associated with food symbols.
   * @param event - The event object representing the change in checkbox state.
   * @param item - The object representing the food symbol associated with the checkbox.
   */
  onChange(event: any, item: any) {
    // Toggle the 'checked' property of the item
    item.checked = !item.checked;

    // If the item has an 'id' and it is checked, add its 'id' to foodsymbolSelected array
    if (item.id && item.checked) {
      this.foodsymbolSelected.push(item.id);
    } else if (item.id && !item.checked) {
      // If the item has an 'id' and it is unchecked, remove its 'id' from foodsymbolSelected array
      this.foodsymbolSelected.splice(
        this.foodsymbolSelected.indexOf(item.id),
        1
      );
    }
  }

  /**
   * Event handler for checkbox state changes associated with category items.
   * @param event - The event object representing the change in checkbox state.
   * @param item - The object representing the category item associated with the checkbox.
   */
  onChangeCategoryItem(event: any, item: any) {
    // Toggle the 'checked' property of the item
    item.checked = !item.checked;

    // If the item has an 'id' and it is checked, add its details to the GroupItems array
    if (item.id && item.checked) {
      this.GroupItems.push({
        item_id: item.id,
        items_list_status: item.items_list_status,
      });
    } else if (item.id && !item.checked) {
      // If the item has an 'id' and it is unchecked, remove its details from the GroupItems array
      this.GroupItems.splice(this.GroupItems.indexOf(item), 1);

      // Set the items_list_status property of the item to false
      item.items_list_status = false;
    }

    // Log the current state of the GroupItems array
    console.log(this.GroupItems);
  }

  /**
   * Event handler for changes in the status of grouped items associated with a checkbox.
   * @param e - The event object representing the change in checkbox state.
   * @param index - The index of the grouped item in the GroupItems array.
   * @param item - The object representing the grouped item associated with the checkbox.
   */
  groupedItemStatusChange(e: any, index: any, item: any) {
    // Check if the checkbox is checked
    if (e.checked) {
      // Set the items_list_status property of the corresponding item in GroupItems to true
      this.GroupItems[index].items_list_status = true;

      // Set the items_list_status property of the current grouped item to true
      item.items_list_status = true;
    } else {
      // Set the items_list_status property of the corresponding item in GroupItems to false
      this.GroupItems[index].items_list_status = false;

      // Set the items_list_status property of the current grouped item to false
      item.items_list_status = false;
    }
  }

  /**
   * Determines whether to show or hide a slide based on the presence of the grouped item in the GroupItems array.
   * @param index - The index of the grouped item in the GroupItems array.
   * @param item - The object representing the grouped item.
   * @returns A boolean indicating whether to show or hide the slide.
   */
  showSlide(index: any, item: any): boolean {
    // Check if the grouped item is found in the GroupItems array
    let found = this.GroupItems.filter(
      (obj: { item_id: any }) => obj.item_id == item.id
    );

    // If found, return false (do not show the slide); otherwise, return true (show the slide)
    return found.length > 0 ? false : true;
  }

  /**
   * Handles the change event when a file is selected for regular image upload.
   * @param event - The event containing information about the selected file.
   */
  handleFileInputRegular(event: any): void {
    // Set the imageChangedEventRegular property to the event containing information about the selected file
    this.imageChangedEventRegular = event;

    // Reference to the current instance of the class
    let me = this;

    // Get the selected file from the event
    let file = event.target.files[0];

    // Create a new FileReader to read the file as a data URL
    let reader = new FileReader();

    // Define the actions to be taken when the FileReader successfully loads the file
    reader.onload = function () {
      // Set the ImageBaseDataRegular property to the base64-encoded data URL of the loaded file
      me.ImageBaseDataRegular = reader.result?.toString();
    };

    // Define the actions to be taken in case of an error during file reading
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

    // Read the selected file as a data URL
    reader.readAsDataURL(file);
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

  /**
   * Performs a validity check for regular branch prices in the add menu form.
   * Updates the `branchPriceValidityCheck` flag based on the validity of branch prices.
   */
  RegularBranchPriceValidityCheck(): void {
    // Initialize branchPriceValidityCheck to true
    this.branchPriceValidityCheck = true;

    // Iterate through each location price in the add menu form
    this.addmenuForm.controls['location_prices'].value.forEach((obj: any) => {
      // Check if location_price is empty or invalidFlag is true
      if (obj.location_price == '' || this.invalidFlag) {
        // Set branchPriceValidityCheck to true if location_price is empty or invalidFlag is true
        this.branchPriceValidityCheck = true;
      } else {
        // Set branchPriceValidityCheck to false if location_price is not empty and invalidFlag is false
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
  }

  affectedPriceValidCheck(value: any) {
    if (value.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$')) {
      this.combopricevalid = false;
    } else {
      this.combopricevalid = true;
    }
    console.log(this.invalidFlag);
  }

  /**
   * Performs entity validation check for regular entities in the add menu form.
   * Updates the `entitiesValidityCheck` flag based on the presence of at least one selected entity type.
   */
  RegularEntityValidationCheck(): void {
    // Initialize entitiesValidityCheck to false
    this.entitiesValidityCheck = false;

    // Create an array to track the presence of selected entity types for each entity
    let flag: any = [];

    // Iterate through each entity in the add menu form
    this.addmenuForm.value['entities'].forEach((obj: any, i: any) => {
      // Check if at least one entity type is selected (call_center, dine_in, e_order, pos, take_away, walk_in)
      if (
        obj.call_center ||
        obj.dine_in ||
        obj.e_order ||
        obj.pos ||
        obj.take_away ||
        obj.walk_in
      ) {
        flag[i] = true; // Set flag to true if at least one entity type is selected for the current entity
      }
    });

    // Check if at least one entity type is selected for all entities
    if (flag.length === this.addmenuForm.value['entities'].length) {
      this.entitiesValidityCheck = true; // Set entitiesValidityCheck to true if at least one entity type is selected for all entities
    } else {
      this.entitiesValidityCheck = false; // Set entitiesValidityCheck to false if at least one entity type is not selected for any entity
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

  /**
   * Adds a regular menu item by sending a POST request to the server.
   * Validates the form data, modifier lists, food symbols, branch prices, entities, and specifications.
   * If validation passes, constructs the request body and sends the request.
   */
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

  /**
   * Checks the validation status of a form control and returns a CSS class for styling.
   * @param formGroup - The FormGroup containing the form control.
   * @param formControlName - The name of the form control to check.
   * @returns A CSS class ('is-invalid') if the form control has errors, otherwise an empty string ('').
   */
  validationCheck(formGroup: any, formControlName: any): string {
    // Get the control from the form group
    const control = formGroup.get(formControlName);

    // Check if the control is an instance of UntypedFormControl
    control instanceof UntypedFormControl;

    // Check if the control has a value or has been touched
    if (control.value || control.touched) {
      // Check if the control has errors
      if (control.errors) {
        return 'is-invalid'; // Return 'is-invalid' class for styling
      } else {
        return ''; // Return an empty string if there are no errors
      }
    } else {
      return ''; // Return an empty string if the control has not been touched or has no value
    }
  }

  /**
   * Checks the validity of the modifier groups and their associated lists.
   * Sets flags for valid modifier lists and zero entry checks.
   */
  validModifierCheck() {
    // Reset flags
    this.ValidModifierList = false;
    this.modifierListZeroEntryCheck = false;

    // Check if there are any modifier groups
    if (this.AddedModifierGroupRecords.length > 0) {
      // Iterate through each modifier group
      this.AddedModifierGroupRecords.forEach((obj: any) => {
        // Check if the modifier list is empty
        if (obj.modifier_list.length <= 0) {
          this.modifierListZeroEntryCheck = false;
        } else {
          this.modifierListZeroEntryCheck = true;
        }

        // Check if the modifier list exceeds the maximum limit
        if (obj.modifier_list.length >= obj.limit_maximum) {
          this.ValidModifierList = true;
        } else {
          this.ValidModifierList = false;
        }
      });
    } else {
      // Set flags to true if there are no modifier groups
      this.ValidModifierList = true;
      this.modifierListZeroEntryCheck = true;
    }
  }

  /**
   * Checks the validity of combo items in the combo menu form.
   * Sets the affected price validity check flag.
   */
  ComboItemValidityCheck() {
    // Reset the affected price validity check flag
    this.affectedPriceValidityCheck = false;

    // Check if there are any combo items
    if (this.addCombomenuForm.controls['combo_items'].value.length > 0) {
      // Iterate through each combo item
      this.addCombomenuForm.controls['combo_items'].value.forEach(
        (obj: any) => {
          // Check if affected price is empty or invalid
          if (obj.affected_price_by == '' || this.combopricevalid) {
            this.affectedPriceValidityCheck = true;
          } else {
            this.affectedPriceValidityCheck = false;
          }
        }
      );
    } else {
      // Set the affected price validity check flag to true if there are no combo items
      this.affectedPriceValidityCheck = true;
    }
  }

  /**
   * Checks the validity of branch prices in the combo menu form.
   * Sets the branch price validity check flag.
   */
  ComboBranchPriceValidityCheck() {
    // Reset the branch price validity check flag
    this.branchPriceValidityCheck = false;

    // Check if there are any branch prices
    if (this.addCombomenuForm.controls['location_prices'].value.length > 0) {
      // Iterate through each branch price
      this.addCombomenuForm.controls['location_prices'].value.forEach(
        (obj: any) => {
          // Check if location price is empty or invalid
          if (obj.location_price == '' || this.invalidFlag) {
            this.branchPriceValidityCheck = true;
          } else {
            this.branchPriceValidityCheck = false;
          }
        }
      );
    } else {
      // Set the branch price validity check flag to true if there are no branch prices
      this.branchPriceValidityCheck = true;
    }
  }

  /**
   * Adds a new combo menu item.
   * Validates the combo menu form fields and submits the data to the server.
   */
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

  /**
   * Adds a new grouped menu item.
   * Validates the grouped menu form fields and submits the data to the server.
   */
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

  /**
   * Opens a dialog to add a new modifier group and adds the group to AddedModifierGroupRecords.
   * Validates for duplicate entries before adding.
   */
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

  /**
   * Validates and sets the value for a specification in the specificationArray.
   * @param index - The index of the specification in the specificationArray.
   * @param value - The value to be checked and set.
   */
  valueCheck(index: any, value: any) {
    // Check if the value is a valid number
    if (!isNaN(value)) {
      // Set the value for the specification in the specificationArray
      this.specificationArray[index].value = value;
    } else {
      // Display a snack bar message for invalid value
      this.snackBService.openSnackBar('Invalid value entered', 'Close');
    }
  }
}
