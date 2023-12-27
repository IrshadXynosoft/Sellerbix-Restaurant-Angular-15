import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { Constants } from 'src/constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-banners',
  templateUrl: './edit-banners.component.html',
  styleUrls: ['./edit-banners.component.scss']
})
export class EditBannersComponent implements OnInit {
  public bannerForm!: UntypedFormGroup;
  public validationFloat = "^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  ErrorArray: any = [];
  ImageBaseData: any | ArrayBuffer = null;
  ImageBaseDataNew: any | ArrayBuffer = null;
  categoryRecords: any = [];
  errorMessage: any;
  bannerData: any = [];
  imageSize: any = 'Image size should be 1600x533px';
  list_autocomplete = new UntypedFormControl();
  filteredOptions: Observable<any[]> | undefined;
  records: any = [];
  selectedType: any;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditBannersComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { branch_id: string, id: string }, private constant: Constants) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getCategories();
    this.getBanner();
  }

  private _filterlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.records.filter((option: any) => option.name.toLowerCase().includes(filterValue));
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

  getBanner() {
    this.httpService.get('online/banners/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.bannerData = result.data
          this.bannerForm.patchValue({
            name: this.bannerData.name,
            category_header_id: this.bannerData.category_header_id,
            link: this.bannerData.link,
            linktype: this.bannerData.type,
            status: this.bannerData.status,
            fromDate: this.bannerData.from_date,
            toDate: this.bannerData.to_date
          })
          this.selectedType = this.bannerData.type;
          this.typeSelected(this.selectedType)
          var found = this.categoryRecords.find((obj: any) => {
            return obj.id == this.bannerData.category_header_id
          });
          if (found) {
            this.imageSize = 'Image size should be ' + found.image_size
          }
          this.ImageBaseData = this.bannerData.image ? this.constant.imageBasePath + this.bannerData.image : "assets/images/no-image (1).jpg";
        } else {
          console.log("Error in banners");
        }
      });
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
  updateBanners() {
    let post = {
      'name': this.bannerForm.value['name'],
      'link': this.bannerForm.value['link'],
      'link_type': this.bannerForm.value['linktype'],
      'category_header_id': this.bannerForm.value['category_header_id'],
      'image': this.ImageBaseDataNew,
      'branch_id': this.data.branch_id,
      'status': this.bannerForm.value['status'],
      'fromDate': this.bannerForm.value['fromDate'],
      'toDate': this.bannerForm.value['toDate']
    }
    if (this.ImageBaseDataNew || this.bannerData.image && this.bannerForm.valid) {
      this.errorMessage = ""
      this.httpService.put('online/banners/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Banner Updated successfully.", "Close");
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

  timeFromChange() {
    this.bannerForm.controls['timeTo'].enable();
  }

  typeSelected(value: any) {
    this.records = [];
    this.list_autocomplete = new UntypedFormControl();
    // this.bannerForm.patchValue({
    //   'link': null
    // })
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

  handleFileInput(event: any) {
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
}

