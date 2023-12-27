import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';
import { indexOf } from 'lodash';

@Component({
  selector: 'app-edit-category-schedule',
  templateUrl: './edit-category-schedule.component.html',
  styleUrls: ['./edit-category-schedule.component.scss']
})
export class EditCategoryScheduleComponent implements OnInit {
  public addmenuForm!: UntypedFormGroup;
  tempArray: any = [];
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationExpressionForName = "^(?! )[A-Za-z0-9 &-()]*(?<! )$"
  public days: Array<{ id: number, name: string, status: boolean }> = [
    { id: 1, name: "Sun", status: false },
    { id: 2, name: "Mon", status: false },
    { id: 3, name: "Tue", status: false },
    { id: 4, name: "Wed", status: false },
    { id: 5, name: "Thur", status: false },
    { id: 6, name: "Fri", status: false },
    { id: 7, name: "Sat", status: false }
  ];
  iconsList: any = [];
  iconsArray: any = [];
  daysSelected: any = new Array();
  categoryIconSelected: any;
  imageBasepath: any;
  validcheck = false;
  isCategorySchedule: boolean = false;
  ErrorArray: any = [];
  errorMessage: any = "";
  allSelected: boolean = false;
  scheduleArray: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: { catId: string }, private constant: Constants, private snackBService: SnackBarService, private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<EditCategoryScheduleComponent>, public formBuilder: UntypedFormBuilder) {
    this.imageBasepath = this.constant.imageBasePath + '/icons/'
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getMenuCategory();
  }

  onBuildForm() {
    this.addmenuForm = this.formBuilder.group({
      schedule_name: ['', Validators.compose([Validators.pattern(this.validationExpression)])],
      days: false,
      start_time: [''],
      end_time: [''],
    }, { validator: this.dateLessThan('start_time', 'end_time') }); /* calling fn for date checking */
  }

  // To check from date and to date

  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Invalid Date Entry"
        };
      }
      return {};
    }
  }

  getMenuCategory() {
    this.httpService.get('schedule/' + this.data.catId, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.scheduleArray = result.data;
          this.addmenuForm.patchValue({
            schedule_name: this.scheduleArray.name,
            start_time: this.scheduleArray.schedule_detail[0]?.from_time,
            end_time: this.scheduleArray.schedule_detail[0]?.to_time
          })
          this.scheduleArray.schedule_detail[0].days.forEach((obj1: any) => {
            this.days.forEach((obj2: any) => {              
              if(obj1 == obj2.id){
                obj2.status = true;
                this.daysSelected.push(obj1)
              }
            })
          })
            if(this.scheduleArray.schedule_detail[0].days.length == 7){
              this.allSelected = true;
            }        
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
  timevalid() {
    this.addmenuForm.controls['end_time'].enable()

  }

  dateFromValue() {
    this.addmenuForm.patchValue({
      end_time: this.addmenuForm.value['start_time']
    })
  }
  onChange(event: any, item: any) {
    if (event.checked) {
      this.daysSelected.push(item.id)
    }
    else {
      this.daysSelected.splice(this.daysSelected.indexOf(item.id), 1)
    }
    if(this.daysSelected.length == 7 ){
      this.allSelected = true;
    }
    else {
      this.allSelected = false;
    }
  }

  toggleAllSelection(event: any) {
    this.daysSelected = [];
    this.allSelected = false;
    if (event.checked) {
      this.allSelected = true;
      this.days.forEach((obj: any) => {
        obj.status = true;
        this.daysSelected.push(obj.id)
      })
    }
    else {
      this.allSelected = false;
      this.days.forEach((obj: any) => {
        obj.status = false;
      })
    }
    console.log(this.daysSelected);
  }
  addMenuCategory() {
    let post = {
      days: this.daysSelected,
      name: this.addmenuForm.value['schedule_name'],
      from_time: this.addmenuForm.value['start_time'],
      to_time: this.addmenuForm.value['end_time']
    }
    if (this.addmenuForm.value['start_time'] && this.addmenuForm.value['end_time'] && this.daysSelected.length > 0) {
      this.errorMessage = "";
      this.httpService.put('schedule/' + this.data.catId, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Schedule Updated Successfully!!", "Close");
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
      this.errorMessage = "required"
    }
  }
}


