import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AddLoyaltyGroupComponent } from '../add-loyalty-group/add-loyalty-group.component';
import { MapLoyaltyGroupComponent } from '../map-loyalty-group/map-loyalty-group.component';

export interface loyalty {
  id: any,
  name: any,
  secondary_name: any;
}

@Component({
  selector: 'app-loyalty-group',
  templateUrl: './loyalty-group.component.html',
  styleUrls: ['./loyalty-group.component.scss']
})
export class LoyaltyGroupComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  loyaltyRecords: any = [];
  id: any;
  constructor(private route: ActivatedRoute, private snackBService: SnackBarService, private httpService: HttpServiceService, private router: Router, public dialog: MatDialog, private dialogService: ConfirmationDialogService) {
    this.id = this.route.snapshot.params.id;
  }
  public displayedColumns: string[] = ['Index', 'Name', 'button'];
  public dataSource = new MatTableDataSource<loyalty>();
  ngOnInit(): void {
    this.getloyalty();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getloyalty() {
    this.httpService.get('loyalty-group')
      .subscribe(result => {
        if (result.status == 200) {
          this.dataSource.data = result.data as loyalty[];
        } else {
          console.log("Error");
        }
      });
  }

  back() {
    this.router.navigate(['setup/' + this.id + '/editLocation'])
  }

  addLoyatlty(): void {
    const dialogRef = this.dialog.open(AddLoyaltyGroupComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getloyalty();
    });
  }

  editloyalty(element: any): void {
    const dialogRef = this.dialog.open(AddLoyaltyGroupComponent, {
      width: '500px',
      data: {
        operation: 'edit',
        id: element.id,
        name: element.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getloyalty();
    });
  }

  deleteloyalty(id: any, name: any) {
    const options = {
      title: 'Delete Loyalty Group',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('loyalty-group' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Loyalty Group Deleted Successfully!!", "Close");
              this.getloyalty();
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

  mapCustomers(element: any) {
    const dialogRef = this.dialog.open(MapLoyaltyGroupComponent, {
      width: '1200px',
      data: {
        id: element.id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getloyalty();
    });
  }
}
