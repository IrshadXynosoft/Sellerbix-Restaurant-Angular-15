import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { Router } from '@angular/router';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-edit-menu-category',
  templateUrl: './edit-menu-category.component.html',
  styleUrls: ['./edit-menu-category.component.scss']
})
export class EditMenuCategoryComponent implements OnInit {
  public addmenuForm!: UntypedFormGroup;

  categoryArray: any = [];
  isCheckboxErrorMessage: any;
  validcheck = false;
  iconsList: any = [];
  iconsArray: any = [];
  categoryIconSelected: any;
  imageBasepath: any;
  tempArray: any = [];
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationExpressionForName = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ErrorArray:any=[];
  ImageBaseData: any | ArrayBuffer = null;
  constructor(public constant: Constants, public dialog: MatDialog, public dialogRef: MatDialogRef<EditMenuCategoryComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { catId: string }, private router: Router) {
    this.isCheckboxErrorMessage = false;
    this.imageBasepath = this.constant.imageBasePath + '/icons/'
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getMenuCategory();
    this.getIcons();
  }
  onBuildForm() {
    this.addmenuForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      priority: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      secondary_name: [null],
      status:[true],
      file: [''],
      });
  }

  close() {
    this.dialogRef.close();
  }

  getIcons() {
    this.httpService.get('icons', false)
      .subscribe(result => {
        if (result) {
          this.iconsArray = result.data.icons;
          this.tempArray = this.iconsArray;
          this.iconsArray.forEach((element: any) => {
            this.iconsList.push(this.imageBasepath + element.icon_url)
          });

        } else {
          console.log("Error in category icon");
        }
      });
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

  iconSelected(index: any) {
    if (this.iconsArray.length) {
      this.categoryIconSelected = this.iconsArray[index].icon_url;
    }
  }

  getMenuCategory() {
    this.httpService.get('category/' + this.data.catId, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryArray = result.data;
          this.addmenuForm.patchValue({
            name: this.categoryArray.name,
            priority: this.categoryArray.priority,
            secondary_name: this.categoryArray.secondary_name ? this.categoryArray.secondary_name : null,
            status:this.categoryArray.active,
            // file : this.categoryArray.image_url
          })
          this.categoryIconSelected = this.categoryArray.icon_name;
          console.log(this.categoryArray)
        } else {
          console.log("Error in category get");
        }
      });

  }
  editMenuCategory() {
    let put = {
      'name': this.addmenuForm.value['name'],
      'priority': this.addmenuForm.value['priority'],
      'icon_name': this.categoryIconSelected,
      'colour': "#0F1111",
      'secondary_name': this.addmenuForm.value['secondary_name'],
      'active':this.addmenuForm.value['status'],
      'file': this.ImageBaseData,
    }
    console.log(put)

      // if(this.categoryIconSelected || this.ImageBaseData){
        this.httpService.put('category/'+this.data.catId, put)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Category Updated Successfully!!", "Close");
            this.close();
          } else {
            if(result.data){
              this.ErrorArray=result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
      // }
  }
  SearchIcon(searchText: any) {
    if (searchText) {
      this.iconsArray = this.tempArray
      var filterItems = this.iconsArray.filter(function (obj: any) {
        return ((obj.name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
      });
      if (filterItems.length < 1) {
        filterItems = []
      }
      this.iconsArray = filterItems;
    }
    else {
      this.iconsArray = this.tempArray
    }
  }
}


