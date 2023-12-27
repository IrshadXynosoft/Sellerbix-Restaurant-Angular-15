import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import {  UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss']
})
export class AddNotesComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { note:any },public dialog: MatDialog, public dialogRef: MatDialogRef<AddNotesComponent>,private httpService:HttpServiceService,private formBuilder: UntypedFormBuilder) { }
  notes='';
  public notesForm!: UntypedFormGroup;
  ngOnInit(): void {
    this.notesForm = this.formBuilder.group({
      note: [],
    })
    this.notesForm.patchValue({
      note:this.data.note
    })
  }
  close() {
    this.dialogRef.close();
  }
  saveNotes(){
    this.notes=this.notesForm.value['note'];
    this.dialogRef.close(this.notes);

  }
}
