import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddComboSectionComponent } from '../add-combo-section/add-combo-section.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EditComboSectionComponent } from '../edit-combo-section/edit-combo-section.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
@Component({
  selector: 'app-combo-sections',
  templateUrl: './combo-sections.component.html',
  styleUrls: ['./combo-sections.component.scss']
})
export class ComboSectionsComponent implements OnInit {
  comborecords: any = [];
  constructor(private snackBService: SnackBarService, private httpService: HttpServiceService, private router: Router, public dialog: MatDialog, private dialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getComboSections();
  }
  getComboSections() {
    this.httpService.get('combo')
      .subscribe(result => {
        if (result.status == 200) {
          this.comborecords = result.data.combos;
        } else {
          console.log("Error");
        }
      });
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  deletecombo(id: any, name: any) {
    const options = {
      title: 'Delete Combo Sections',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };

    this.dialogService.open(options);

    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('combo' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(" Deleted Successfully!!", "Close");
              this.getComboSections();
            } else {
              this.snackBService.openSnackBar("Unable to delete", "Close");
              console.log("Error");
            }
          });
      }
    });

  }
  addComboSection(): void {
    const dialogRef = this.dialog.open(AddComboSectionComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getComboSections();
    });
  }
  editComboSection(id: any, name: any, sequence_number: any, skip: any): void {
    const dialogRef = this.dialog.open(EditComboSectionComponent, {
      width: '500px',
      data: {
        id: id,
        combo_name: name,
        seq_number: sequence_number,
        allow_skip: skip
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getComboSections();
    });
  }
}
