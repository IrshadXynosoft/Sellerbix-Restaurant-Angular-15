import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';


export interface QRCodeMenu {
  branch_id: number;
  branch_name: any;
  link: any;
  qrcode: any;
}

@Component({
  selector: 'app-qrcode-order',
  templateUrl: './qrcode-order.component.html',
  styleUrls: ['./qrcode-order.component.scss']
})
export class QrcodeOrderComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'branch_name', 'link', 'qrcode'];
  public dataSource = new MatTableDataSource<QRCodeMenu>();
  public qrCodeDownloadLink: SafeUrl = "";
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.getBranchDetails();

  }
  getBranchDetails() {
    this.httpService.get('branch-keys')
      .subscribe(result => {
        if (result.status == 200) {

          const data: any = [];
          result.data.branch_keys.forEach((obj: any) => {
            let objData = {
              branch_id: obj.branch_id,
              branch_name: obj.branch.name,
              link: 'qrcode.sellerbix.com/tableOrder/' + obj.key
            }
            data.push(objData)
          });
          this.dataSource.data = data as QRCodeMenu[];
        } else {
          console.log("Error");
        }
      });
  }
  onChangeURL(url: SafeUrl, element: any) {
    element.qrcode = url;
    //this.qrCodeDownloadLink = url;
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


}


