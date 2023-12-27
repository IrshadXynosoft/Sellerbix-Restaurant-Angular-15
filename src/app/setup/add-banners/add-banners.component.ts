import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-banners',
  templateUrl: './add-banners.component.html',
  styleUrls: ['./add-banners.component.scss']
})
export class AddBannersComponent implements OnInit {
  public bannerForm!: UntypedFormGroup;
  public validationFloat = "[+-]?([0-9]*[.])?[0-9]+"
  ErrorArray: any = [];
  ImageBaseData: any | ArrayBuffer = null;
  categoryRecords: any = [];
  errorMessage: any;
  imageSize: any = 'Image size should be 1600x533px';
  list_autocomplete = new UntypedFormControl();
  filteredOptions: Observable<any[]> | undefined;
  records: any = [];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddBannersComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { branch_id: string }) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getCategories();
  }

  private _filterlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.records.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  categoryHeaderChange(event: any) {
    var found = this.categoryRecords.find(function (obj: any) {
      return obj.id == event.target.value;
    });
    if (found) {
      this.imageSize = 'Image size should be ' + found.image_size
    }
    if (this.bannerForm.value['linktype'] == 3) {
      this.typeSelected(3)
    }
  }
  onBuildForm() {
    this.bannerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75)])],
      category_header_id: ['', Validators.compose([Validators.required])],
      link: ['', Validators.compose([Validators.required])],
      linktype: ['', Validators.compose([Validators.required])],
      file: new UntypedFormControl(''),
      fileSource: new UntypedFormControl(''),
      status: [''],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
    },
    { validator: this.dateLessThan('fromDate', 'toDate') }
    );
  }

  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'From date should be less than To date',
        };
      }
      return {};
    };
  }

  getCategories() {
    this.httpService.get('online/category-header', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryRecords = result.data.category_header;
        } else {
          console.log("Error");
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  addCategories() {
    let post = {
      'name': this.bannerForm.value['name'],
      'link': this.bannerForm.value['link'],
      'link_type': this.bannerForm.value['linktype'],
      'category_header_id': this.bannerForm.value['category_header_id'],
      'file': this.ImageBaseData,
      'branch_id': this.data.branch_id,
      'status': this.bannerForm.value['status'],
      'fromDate' : this.bannerForm.value['fromDate'],
      'toDate' : this.bannerForm.value['toDate']
    }
    if (this.ImageBaseData && this.bannerForm.valid) {
      this.errorMessage = ""
      this.httpService.post('online/banners', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Banner created successfully.", "Close");
            this.close();
          } else {
            if (result.data) {
              this.ErrorArray = result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please fill all the required fields', "Close");
      this.errorMessage = "Required"
    }
  }

  typeSelected(value: any) {
    this.records = [];
    this.list_autocomplete = new UntypedFormControl();
    this.bannerForm.patchValue({
      'link': null
    })
    if (value == 1) {
      this.httpService.get('get-items-for-inventory/1').subscribe((result) => {
        if (result.status == 200) {
          result.data.items.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
            };
            this.records.push(objData);
          });
          this.filteredOptions = this.list_autocomplete.valueChanges.pipe(
            startWith(''),
            map(value => this._filterlist(value)),
          );
        } else {
          console.log('Error');
        }
      });
    }
    else if (value == 2) {
      this.httpService.get('category').subscribe((result) => {
        if (result.status == 200) {
          result.data.categories.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
            };
            this.records.push(objData);
          });
          this.filteredOptions = this.list_autocomplete.valueChanges.pipe(
            startWith(''),
            map(value => this._filterlist(value)),
          );
        } else {
          console.log('Error');
        }
      });
    }
    else if (value == 3) {
      this.bannerForm.patchValue({
        'link': 'section/' + this.bannerForm.value['category_header_id']
      })
    }
  }

  itemSelected(id: any) {
    if (this.bannerForm.value['linktype'] == 1) {
      this.bannerForm.patchValue({
        'link': 'product/' + id
      })
    }
    else {
      this.bannerForm.patchValue({
        'link': 'category-menus/' + id
      })
    }
  }

  timeFromChange() {
    this.bannerForm.controls['timeTo'].enable();
  }

  handleFileInput(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseData = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
}

