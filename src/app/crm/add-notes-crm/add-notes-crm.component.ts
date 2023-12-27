import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-notes-crm',
  templateUrl: './add-notes-crm.component.html',
  styleUrls: ['./add-notes-crm.component.scss']
})
export class AddNotesCrmComponent implements OnInit {
  addNotes!:UntypedFormGroup
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddNotesCrmComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,private router: Router,@Inject(MAT_DIALOG_DATA) public data: {id: string}) { }

  ngOnInit(): void {
    this.onBuiuldForm()
  }
  onBuiuldForm()
  {
    this.addNotes = this.formBuilder.group({
      note: ['', Validators.compose([Validators.required,Validators.maxLength(75)])]
    })
  }
  saveNotes()
  {
    let post_add_note_param={
      customer_id:this.data.id,
      message:this.addNotes.value['note'],
    }
    this.httpService.post('customer-note', post_add_note_param)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Notes added Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  close() {
    this.dialogRef.close();
   }
}
