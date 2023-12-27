import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})

export class NotesListComponent implements OnInit {
  notesList:any=[]
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NotesListComponent>,private httpService: HttpServiceService,private snackBService: SnackBarService,private router: Router,@Inject(MAT_DIALOG_DATA) public data: {noteList: []}) { 
  this.notesList=this.data.noteList
  }

  ngOnInit(): void {
  }
close()
{
  this.dialogRef.close();
}
}
