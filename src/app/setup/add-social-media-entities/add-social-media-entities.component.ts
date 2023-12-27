import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-add-social-media-entities',
  templateUrl: './add-social-media-entities.component.html',
  styleUrls: ['./add-social-media-entities.component.scss']
})
export class AddSocialMediaEntitiesComponent implements OnInit {
  public addmediaForm!: UntypedFormGroup;
  mediaRecords: any = [];
  nameSelected:any;
  // public validationExpressionForName = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ErrorArray: any = [];
  constructor(private constant: Constants, private snackBService: SnackBarService, private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddSocialMediaEntitiesComponent>, public formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: { id: any, branch_id: any }) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getAvailableMedias();
    if (this.data.id) {
      this.editGetEntities()
    }

  }

  onBuildForm() {
    this.addmediaForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      url: ['', Validators.compose([Validators.required])],
      show: [false]
    });
  }

  getAvailableMedias() {
    this.httpService.get('all-social-media-names', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.mediaRecords = result.data
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  editGetEntities() {
    this.httpService.get('social-media/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          if (result.data) {
            this.addmediaForm.patchValue(
              {
                name: result.data.social_media_entity_id,
                url: result.data.url,
                show: result.data.show_in_float == 1 ? true : false
              }
            )
            this.nameSelected = result.data.social_media_entity_id
          }
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  close() {
    this.dialogRef.close();
  }


  addEntities() {
    let post = {
      'social_media_entity_id': this.addmediaForm.value['name'],
      'url': this.addmediaForm.value['url'],
      'branch_id': this.data.branch_id,
      'show_in_float': this.addmediaForm.value['show']
    }

    this.httpService.post('social-media', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Entity Added Successfully!!", "Close");
          this.close();
        } else {
          if (result.data) {
            this.ErrorArray = result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });

  }
  editEntities() {
    let post = {
      'social_media_entity_id': this.addmediaForm.value['name'],
      'url': this.addmediaForm.value['url'],
      'branch_id': this.data.branch_id,
      'show_in_float': this.addmediaForm.value['show']
    }

    this.httpService.put('social-media/' + this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Entitiy Updated Successfully!!", "Close");
          this.close();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });

  }
}
