import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddSectionHeadsComponent } from '../add-section-heads/add-section-heads.component';
import { EditSectionHeadsComponent } from '../edit-section-heads/edit-section-heads.component';
import { AddSocialMediaEntitiesComponent } from '../add-social-media-entities/add-social-media-entities.component';
export interface MediaEntities {
  id: any;
  name: any;
  status: any;
}


@Component({
  selector: 'app-social-media-entities',
  templateUrl: './social-media-entities.component.html',
  styleUrls: ['./social-media-entities.component.scss']
})
export class SocialMediaEntitiesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'name', 'status', 'button'];
  public dataSource = new MatTableDataSource<MediaEntities>();
  mediaEntitiesData: any = [];
  id: any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }
  ngOnInit(): void {
    this.getEntities();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getEntities() {
    this.httpService.get('get-all-social-entities/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.mediaEntitiesData = result.data;
          const data: any = [];
          if (this.mediaEntitiesData && this.mediaEntitiesData.length > 0) {
            this.mediaEntitiesData.forEach(function (obj: any) {

              let objData = {
                id: obj.id,
                name: obj.social_media_entity.name,
                status: obj.show_in_float
              }
              data.push(objData)
            });
          }
          this.dataSource.data = data as MediaEntities[];
        } else {
          console.log("Error in Social Media Entities");
        }
      });
  }
  back() {

    this.router.navigate(['setup/location/' + this.id + '/online'])
  }
  addEntties(): void {
    const dialogRef = this.dialog.open(AddSocialMediaEntitiesComponent, {
      width: '700px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEntities();
    });
  }
  editEntties(id: any): void {

    const dialogRef = this.dialog.open(AddSocialMediaEntitiesComponent, {
      width: '700px', data: { 'branch_id': this.id, 'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEntities();
    });
  }
  deleteEntties(id: any, name: any): void {
    const options = {
      title: 'Delete Social Media Entitiy',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('social-media/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Social Media Entitiy Deleted Successfully!!", "Close");
              this.getEntities();
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

