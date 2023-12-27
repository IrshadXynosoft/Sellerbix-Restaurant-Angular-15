import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BatchProductionReportDetailComponent } from '../batch-production-report-detail/batch-production-report-detail.component';
import { MatDialog } from '@angular/material/dialog';
export interface BatchList {
  id: number;
  process_no: any
  name: any;
  staff: any;
  location: any;
}

@Component({
  selector: 'app-batch-production-list',
  templateUrl: './batch-production-list.component.html',
  styleUrls: ['./batch-production-list.component.scss']
})
export class BatchProductionListComponent implements OnInit {

  @ViewChild("batchTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  public displayedColumns: string[] = ['index', 'process_no', 'process_date', 'staff', 'location', 'button'];
  public dataSource = new MatTableDataSource<BatchList>();
  currency_symbol = localStorage.getItem('currency_symbol');
  public batchProductionForm!: UntypedFormGroup;
  total: any = 0.00
  total1: any = 0.00
  processeddata: any = [];
  branchRecords: any = [];
  branch_id: any;
  order_no: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  recipeArray: any = [];
  selectedStockIDs: any = [];
  filteredOptions: Observable<any[]> | undefined;
  total_price: any = 0;
  locationSelected: any;
  isItemsSelected: boolean = false;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  current_page: any = 1;
  last_page: number = 1;
  constructor(private dialog: MatDialog, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute, private dataservice: DataService) {
    this.branch_id = this.localService.get('branch_id')
    this.locationSelected = this.localService.get('branchname')
  }
  ngOnInit(): void {
    this.getBranch();
    this.onBuildForm();
    this.processedList(this.branch_id, this.current_page)
  }
  getBranch() {
    this.httpService.get('branches-for-inventory/' + this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;

        } else {
          console.log("Error");
        }
      });
  }
  onBuildForm() {
    this.batchProductionForm = this.formBuilder.group({
      branch_id_for_past_processed: [this.branch_id],
    });
  }
  forLocation(event: any) {
    this.branch_id = event.target.value;

  }
  forprocessedLocation(branch: any) {
    this.batchProductionForm.patchValue({
      branch_id_for_past_processed: branch.id
    })
    let processedBranch = branch.id;
    this.locationSelected = branch.name;
    this.branch_id= branch.id
   
    this.processedList(processedBranch, 1)
  }

  processedList(branch_id: any, page_number: any) {
    const data: any = [];
   
    this.httpService.get('list-all-batch-process/'+ branch_id+'?page=' + page_number)
      .subscribe(result => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;

          if (result.data.data.length > 0) {

            if (page_number == 1) {
              this.processeddata = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.processeddata.push(obj)
              });
            }


            this.processeddata.forEach((obj: any) => {
              let objData = {
                id: obj.id,
                process_no: obj.batch_process_reference_no,
                staff: obj.staff_name,
                location: this.locationSelected,
                process_date: obj.date
              }
              data.push(objData)
            });
            
          } else {
            console.log("Error in batch-process");
          }
          this.dataSource.data = data as BatchList[];
        }
      })

  }

  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.processedList(this.branch_id, this.current_page)
      this.direction = 'down';
    }
  }
  viewBatchProcess(item: any) {
    const dialogRef = this.dialog.open(BatchProductionReportDetailComponent, {
      width: '900px', data: { 'id': item.id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  newBatchProcess() {
    this.router.navigate(['/inventory/newbatchProduction']);
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
