import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-delete-inventory-item',
  templateUrl: './delete-inventory-item.component.html',
  styleUrls: ['./delete-inventory-item.component.scss']
})
export class DeleteInventoryItemComponent implements OnInit {
  public cancelForm!: UntypedFormGroup;
  password:any='Develops@123';
  constructor(private mdDialogRef: MatDialogRef<DeleteInventoryItemComponent>,private localservice: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { id: any, name: any,delete_url:any },private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService, private snackBService: SnackBarService  ) {
    
   }

  ngOnInit(): void {
    this.cancelForm = this.formBuilder.group({
    password: ['', Validators.compose([Validators.required])],
    })
  }

public cancel() {
  this.mdDialogRef.close();
}
public confirm() {
  if (this.cancelForm.valid) {
  
    if (this.cancelForm.value['password'] == this.password) {
      this.httpService.delete(this.data.delete_url )
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(this.data.name+" Deleted Successfully", "Close");
            this.cancel();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.snackBService.openSnackBar("Incorrect password", "Close")
    }
  }0
}
}
