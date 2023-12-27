import { indexOf } from 'lodash';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddPrinterComponent } from '../add-printer/add-printer.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-printer-settings',
  templateUrl: './printer-settings.component.html',
  styleUrls: ['./printer-settings.component.scss'],
})
export class PrinterSettingsComponent implements OnInit {
  category = new UntypedFormControl();
  entity = new UntypedFormControl();
  categoryArray: any = [];
  categorylist: any = [];
  selectedCategory: any = [];
  selectedEntity: any = [];
  id: any;
  checked = false;
  indeterminate = false;
  mqttToken: any;
  title: any;
  templatesRecords: any = [];
  printerRecords: any = [];
  kot: any = [];
  invoice: any = [];
  invoiceTemplate_id: any;
  kotPrinter_id: any;
  invoicePrinter_id: any;
  kotTemplate_id: any;
  rules: any = [];
  kotArray: any = [];
  invoiceArray: any = [];
  branch_id = this.route.snapshot.params.id;
  kotDisplayArray: any = [];
  invoiceDisplayArray: any = [];
  entityRecords: any = [];
  public printerRulesForm!: UntypedFormGroup;
  @ViewChild('searchEntity')
  searchEntity!: ElementRef;
  searchEntityTextboxControl = new FormControl();
  entityFilteredOptions!: Observable<any[]>;

  @ViewChild('search')
  searchTextBox!: ElementRef;
  searchTextboxControl = new FormControl();
  categoryFilteredOptions!: Observable<any[]>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private snackBService: SnackBarService,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorage,
    private httpService: HttpServiceService
  ) {
    this.id = this.route.snapshot.params.id;
    this.mqttToken = this.localStorage.get('mqtt_token');
  }
  ngOnInit(): void {
    this.onBuildForm();
    this.getEntity();
    this.getCategories();
    this.getPrinterRules();
    this.getPrinters();
    this.GetTemplates();
  }

  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.setCategorySelectedValues();
    this.category.patchValue(this.selectedCategory);
    let filteredList = this.categorylist.filter(
      (option: { name: string }) =>
        option.name.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredList;
  }

  private _entityfilter(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.setEntitySelectedValues();
    this.entity.patchValue(this.selectedEntity);
    let filteredList = this.entityRecords.filter(
      (option: { name: string }) =>
        option.name.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredList;
  }

  openedChange(e: any) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl?.patchValue('');
    this.searchEntityTextboxControl?.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox?.nativeElement.focus();
      this.searchEntity?.nativeElement.focus();
    }
  }

  categorySelectionChange(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedCategory.indexOf(event.source.value);
      this.selectedCategory.splice(index, 1);
    }
  }

  entitySelectionChange(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedEntity.indexOf(event.source.value);
      this.selectedEntity.splice(index, 1);
    }
  }
  /**
   * Clearing search textbox value
   */
  clearSearch(event: any) {
    event.stopPropagation();
    this.searchTextboxControl?.patchValue('');
    this.searchEntityTextboxControl?.patchValue('');
  }

  /**
   * Set selected values to retain the state
   */
  setCategorySelectedValues() {
    if (this.category.value && this.category.value.length > 0) {
      this.category.value.forEach((e: any) => {
        if (this.selectedCategory.indexOf(e) == -1) {
          this.selectedCategory.push(e);
        }
      });
    }
  }

  setEntitySelectedValues() {
    if (this.entity.value && this.entity.value.length > 0) {
      this.entity.value.forEach((e: any) => {
        if (this.selectedEntity.indexOf(e) == -1) {
          this.selectedEntity.push(e);
        }
      });
    }
  }

  onBuildForm() {
    this.printerRulesForm = this.formBuilder.group({
      kot_printer: ['', Validators.compose([Validators.required])],
      kot_template: ['', Validators.compose([Validators.required])],
      invoice_printer: ['', Validators.compose([Validators.required])],
      invoice_template: ['', Validators.compose([Validators.required])],
      print_type: ['', Validators.required],
    });
  }

  getEntity() {
    this.httpService.get('entity').subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data.entities;
        this.entityFilteredOptions =
          this.searchEntityTextboxControl.valueChanges.pipe(
            startWith<string>(''),
            map((name) => this._entityfilter(name))
          );
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  getCategories() {
    this.httpService.get('category').subscribe((result) => {
      if (result.status == 200) {
        this.categoryArray = result.data.categories;
        this.categoryArray.forEach((obj: any) => {
          let objData = {
            id: obj.id,
            name: obj.name,
          };
          this.categorylist.push(objData);
        });
        this.categoryFilteredOptions =
          this.searchTextboxControl.valueChanges.pipe(
            startWith<string>(''),
            map((name) => this._filter(name))
          );
      } else {
        console.log('Error in get  category');
      }
    });
  }

  GetTemplates() {
    let branchid = this.route.snapshot.params.id;
    this.httpService
      .get('printer-branch-template/' + branchid)
      .subscribe((result) => {
        if (result.status == 200) {
          this.templatesRecords = result.data;
        } else {
          console.log('Error');
        }
      });
  }

  back() {
    this.router.navigate(['setup/location/' + this.id + '/printers']);
  }
  newTemplate() {
    this.router.navigate(['setup/printers/' + this.id + '/newtemplate']);
  }
  editTemplate(editid: any) {
    this.router.navigate([
      'setup/printers/' + this.id + '/editTemplate/' + editid,
    ]);
  }

  addPrinter() {
    const dialogRef = this.dialog.open(AddPrinterComponent, {
      width: '600px',
      data: {
        branchid: this.id,
        method: 'add',
        printer_id: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPrinters();
    });
  }

  deleteInvoice(id: any, name: any) {
    const options = {
      title: 'Delete Invoice',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.httpService
          .delete('printer-template' + '/' + id)
          .subscribe((result) => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(
                'Invoice Deleted Successfully!!',
                'Close'
              );
              this.GetTemplates();
            } else {
              this.snackBService.openSnackBar('Unable to delete', 'Close');
              console.log('Error');
            }
          });
      }
    });
  }

  getPrinters() {
    this.httpService
      .get('branch-printer/' + this.id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.printerRecords = result.data;
        } else {
          console.log('Error');
        }
      });
  }

  getPrinterRules() {
    this.httpService
      .get('get-printer-rules/' + this.branch_id)
      .subscribe((result) => {
        if (result.status == 200) {
          result.data.forEach((obj: any) => {
            if (obj.printer_type == 1) {
              this.kotArray.push({
                printer_type: 1,
                printer_id: obj.printer_id,
                // template_id: obj.template_id,
                printername: obj.printer_name,
                // templatename: obj.template_name,
                categories: obj.categories ? obj.categories : [],
                entities: obj.entities ? obj.entities : [],
                kot_type : obj.kot_type
              });
            } else {
              this.invoiceArray.push({
                printer_type: 0,
                printer_id: obj.printer_id,
                // template_id: obj.template_id,
                printername: obj.printer_name,
                kot_type : obj.kot_type
                // templatename: obj.template_name,
              });
            }
          });
        } else {
          console.log('Error');
        }
      });
  }

  deleteprinter(id: any, name: any) {
    const options = {
      title: 'Delete Printer',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.httpService.delete('printer' + '/' + id).subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message,
              'Close'
            );
            this.getPrinters();
          } else {
            this.snackBService.openSnackBar('Unable to delete', 'Close');
            console.log('Error');
          }
        });
      }
    });
  }

  editPrinter(id: any) {
    const dialogRef = this.dialog.open(AddPrinterComponent, {
      width: '600px',
      data: {
        branchid: this.id,
        printer_id: id,
        method: 'update',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPrinters();
    });
  }

  printTypeChange() {
    if (this.printerRulesForm.value['print_type'] == 1) {
      this.entity.setValue(null);
      this.selectedEntity = [];
    } else if (this.printerRulesForm.value['print_type'] == 2) {
      this.category.setValue(null);
      this.selectedCategory = [];
    }
    else if(this.printerRulesForm.value['print_type'] == 0) {
      this.entity.setValue(null);
      this.selectedEntity = [];
      this.category.setValue(null);
      this.selectedCategory = [];
    }
  }

  addkotprintRule() {
    if (
      this.printerRulesForm.value['kot_printer'] &&
      this.printerRulesForm.value['print_type']
    ) {
      if (this.selectedCategory.length > 0 || this.selectedEntity.length > 0 ||  this.printerRulesForm.value['print_type'] == 0) {
        if (this.kotArray.length > 0) {
          let tempFlag = false;
          this.kotArray.forEach((obj: any) => {
            if (
              this.printerRulesForm.value['kot_printer'].id == obj.printer_id 
            ) {
              tempFlag = true;
            }
          });
          if (!tempFlag) {
            this.kotArray.push({
              printer_type: 1,
              printer_id: this.printerRulesForm.value['kot_printer'].id,
              printername: this.printerRulesForm.value['kot_printer'].name,
              categories: this.selectedCategory.length > 0 ? this.selectedCategory : [],
              entities: this.selectedEntity.length > 0 ? this.selectedEntity : [],
              kot_type : this.printerRulesForm.value['print_type']
            });
          } else {
            this.snackBService.openSnackBar('Rule Already Exist', 'Close');
          }
        } else {
          this.kotArray.push({
            printer_type: 1,
            printer_id: this.printerRulesForm.value['kot_printer'].id,
            printername: this.printerRulesForm.value['kot_printer'].name,
            categories: this.selectedCategory.length > 0 ? this.selectedCategory : [],
            entities: this.selectedEntity.length > 0 ? this.selectedEntity : [],
            kot_type : this.printerRulesForm.value['print_type']
          });
        }
        this.category.setValue('')
        this.entity.setValue('')
        this.printerRulesForm.patchValue({
          'kot_printer' : '',
          'print_type' : ''
        })
        this.selectedCategory = []
        this.selectedEntity = []        
      } else {
        this.snackBService.openSnackBar(
          'Please select atleast one Category or Entity',
          'Close'
        );
      }
    } else {
      this.snackBService.openSnackBar(
        'Please select printer and type to add',
        'Close'
      );
    }
  }
  addInvoiceprintRule() {
    if (
      
      this.printerRulesForm.value['invoice_printer']
    ) {
      if (this.invoiceArray.length > 0) {
        let tempFlag = false;
        this.invoiceArray.forEach((obj: any) => {
          if (
            this.printerRulesForm.value['invoice_printer'].id ==
              obj.printer_id 
          ) {
            tempFlag = true;
          }
        });
        if (!tempFlag) {
          this.invoiceArray.push({
            printer_type: 0,
            printer_id: this.printerRulesForm.value['invoice_printer'].id,
            // template_id: this.printerRulesForm.value['invoice_template'].id,
            printername: this.printerRulesForm.value['invoice_printer'].name,
            kot_type :null
            // templatename: this.printerRulesForm.value['invoice_template'].name,
          });
        } else {
          this.snackBService.openSnackBar('Rule Already Exist', 'Close');
        }
      } else {
        this.invoiceArray.push({
          printer_type: 0,
          printer_id: this.printerRulesForm.value['invoice_printer'].id,
          // template_id: this.printerRulesForm.value['invoice_template'].id,
          printername: this.printerRulesForm.value['invoice_printer'].name,
          kot_type :null
          // templatename: this.printerRulesForm.value['invoice_template'].name,
        });
      }
    } else {
      this.snackBService.openSnackBar(
        'Please select printer to add',
        'Close'
      );
    }
  }
  deleteInvoicedata(i: any) {
    let index = this.invoiceArray.indexOf(i)
    this.invoiceArray.splice(index, 1);
  }
  deleteKotdata(i: any) {
    let index = this.kotArray.indexOf(i)
    this.kotArray.splice(index, 1);
  }

  // selectedCategory(e:any){
  //   if(e.source._selected)    {
  //     this.selectedcategory.push(e.source.id)
  //   }
  //   else{
  //     this.selectedcategory.splice(e.source.id,1)
  //   }
  //   console.log(this.selectedcategory);

  // }
  saveAll() {
    console.log(this.category.value);

    let body = {
      kot: this.kotArray,
      invoice: this.invoiceArray,
      branch_id: this.branch_id,
    };
    this.httpService.post('printer-rules', body).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar(
          'Printer rules added successfully',
          'Close'
        );
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
}
