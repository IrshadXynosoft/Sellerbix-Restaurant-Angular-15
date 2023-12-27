import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';

export interface PricePlan {
  id: number;
  name: any;
  priority: any;
  icons: any;
}

@Component({
  selector: 'app-item-price-plan',
  templateUrl: './item-price-plan.component.html',
  styleUrls: ['./item-price-plan.component.scss']
})
export class ItemPricePlanComponent  {
  id: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  } public displayedColumns: string[] = ['index', 'name', 'description', 'button'];
  public dataSource = new MatTableDataSource<PricePlan>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private constant: Constants, private route: ActivatedRoute, private localService: DataService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getPlan();

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getPlan() {
    this.httpService.get('price-plan')
      .subscribe(result => {
        if (result.status == 200) {
          // const data: any = [];
          // result.data.forEach(function (obj: any) {
          //   let objData = {
          //     id: obj.id,
          //     name: obj.name,
          //     description: obj.description,
          //      }
          //   data.push(objData)
          // });
          this.dataSource.data =  result.data as PricePlan[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  addPlan(): void {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/pricePlan/addPricePlan'])
  }

  back() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }

  edit(element: any): void {
    let data = {
      operation: 'edit',
      id: element.id
    }
    this.localService.setData('pricePlanID', data);
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/pricePlan/addPricePlan'])
  }

  copy(element: any): void {
    let data = {
      operation: 'copy',
      id: element.id
    }
    this.localService.setData('pricePlanID', data);
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/pricePlan/addPricePlan'])
  }

  filter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}

