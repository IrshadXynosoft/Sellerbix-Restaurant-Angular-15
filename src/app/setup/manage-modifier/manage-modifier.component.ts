import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { AddModifierComponent } from '../add-modifier/add-modifier.component';

@Component({
  selector: 'app-manage-modifier',
  templateUrl: './manage-modifier.component.html',
  styleUrls: ['./manage-modifier.component.scss']
})

export class ManageModifierComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ManageModifierComponent>, private dialogService:ConfirmationDialogService,private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { id: string }) { }
  modifierListArray: any = []
  itemName: any
  ngOnInit(): void {
    this.getModifierList();
  }
  getModifierList() {

    this.httpService.get('modifier/' + this.data.id)
      .subscribe(result => {

        if (result.status == 200) {
          this.modifierListArray = result.data.modifiers;
          this.itemName = this.modifierListArray.name
         } else {
          console.log("Error in get  modifier");
        }
      });
  }
  deleteModifier(id: any, name: any) {
    const options = {
      title: 'Delete Modifier Group',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('modifier/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Modifier Deleted Successfully!!", "Close");
              this.close();
            } else {
              this.snackBService.openSnackBar("Unable to delete", "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
}
