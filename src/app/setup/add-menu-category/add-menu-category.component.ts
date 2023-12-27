import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';
@Component({
  selector: 'app-add-menu-category',
  templateUrl: './add-menu-category.component.html',
  styleUrls: ['./add-menu-category.component.scss']
})
export class AddMenuCategoryComponent implements OnInit {
  public addmenuForm!: UntypedFormGroup;
  tempArray: any = [];
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationExpressionForName = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"

  iconsList: any = [];
  iconsArray: any = [];
  daysSelected: any = new Array();
  categoryIconSelected: any;
  imageBasepath: any;
  validcheck = false;
  ErrorArray: any = [];
  errorMessage: any = "";
  ImageBaseData: any | ArrayBuffer = null;
  constructor(private constant: Constants, private snackBService: SnackBarService, private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddMenuCategoryComponent>, public formBuilder: UntypedFormBuilder) {
    this.imageBasepath = this.constant.imageBasePath + '/icons/'
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getIcons();
  }

  onBuildForm() {
    this.addmenuForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(60), Validators.pattern(this.validationExpressionForName)])],
      priority: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      secondary_name: [null],
      status: [true],
      file: [''],
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
          console.log("Error in icons");
        }
      });
  }
  iconSelected(index: any) {
    if (this.iconsArray.length) {
      this.categoryIconSelected = this.iconsArray[index].icon_url;
      this.errorMessage = "";
    }
  }
  close() {
    this.dialogRef.close();
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
  addMenuCategory() {
    let post = {
      'name': this.addmenuForm.value['name'],
      'priority': this.addmenuForm.value['priority'],
      'icon_name': this.categoryIconSelected,
      'secondary_name': this.addmenuForm.value['secondary_name'],
      'colour': "#0F1111",
      'active': this.addmenuForm.value['status'],
      'file': this.ImageBaseData,
    }
    if (this.categoryIconSelected || this.ImageBaseData) {
      this.errorMessage = "";
      this.httpService.post('category', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Category Added Successfully!!", "Close");
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
      this.snackBService.openSnackBar("Please choose image or icon", "Close")
      this.errorMessage = "required"
    }
  }
}
