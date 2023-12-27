import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-show-on-web-branches',
  templateUrl: './show-on-web-branches.component.html',
  styleUrls: ['./show-on-web-branches.component.scss']
})
export class ShowOnWebBranchesComponent implements OnInit {
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService,
    private route: ActivatedRoute) { }
  settingsData: any = [];
  branchRecords: any = [];
  ngOnInit(): void {
    this.getBranch();
    this.getBranchSettings();
  }
  getBranch() {
    this.httpService.get('branch', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;

        } else {
          console.log("Error");
        }
      });
  }
  getBranchSettings() {
    this.httpService.get('branch-availability-for-online', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.settingsData = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  isShowonWeb(branch_id: any) {
    let found = this.settingsData.find(function (obj: any) {
      return obj.id == branch_id && obj.is_online == 1
    });
    if (found) { return true; }
    else { return false; }
  }
  onChangeEvent(event: any, id: any) {
    let param: any;
    if (event.checked) {
      param = {
        branch_id: id,
        status: 1
      }
    }
    else {
      param = {
        branch_id: id,
        status: 0
      }
    }
    this.httpService.post('branch-availability-settings', param)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }

}