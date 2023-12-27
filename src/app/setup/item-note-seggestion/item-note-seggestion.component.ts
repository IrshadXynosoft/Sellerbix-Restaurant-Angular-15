import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSalesTaxComponent } from '../add-sales-tax/add-sales-tax.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { EditSalesTaxComponent } from '../edit-sales-tax/edit-sales-tax.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { EditItemNoteSeggestionComponent } from '../edit-item-note-seggestion/edit-item-note-seggestion.component';
import { AddItemNoteSeggestionComponent } from '../add-item-note-seggestion/add-item-note-seggestion.component';

export interface Note {
  id: any,
  name: any,
}
@Component({
  selector: 'app-item-note-seggestion',
  templateUrl: './item-note-seggestion.component.html',
  styleUrls: ['./item-note-seggestion.component.scss']
})
export class ItemNoteSeggestionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  } public displayedColumns: string[] = ['index', 'name', 'button'];
  public dataSource = new MatTableDataSource<Note>();
  noteArray: any = []
  id: any;
  branch_id: any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
    this.branch_id = this.localService.get('branch_id')
  }
  ngOnInit(): void {
    this.getNotes();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getNotes() {
    this.httpService.get('item-suggestion')
      .subscribe(result => {
        if (result.status == 200) {
          this.noteArray = result.data;
          const data: any = [];
          this.noteArray.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            data.push(objData)
          });
          this.dataSource.data = data as Note[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  back() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }

  addNote(): void {
    const dialogRef = this.dialog.open(AddItemNoteSeggestionComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getNotes();
    });
  }
  editNote(note: any, id: any): void {
    const dialogRef = this.dialog.open(EditItemNoteSeggestionComponent, {
      width: '500px', data: { 'note': note, 'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getNotes();
    });
  }
  deleteNote(id: any, name: any): void {
    const options = {
      title: 'Delete',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('item-suggestion/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Note Deleted Successfully!!", "Close");
              this.getNotes();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
