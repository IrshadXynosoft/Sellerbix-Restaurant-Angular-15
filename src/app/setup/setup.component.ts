import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/constants';
import { DataService } from '../_services/data.service';
import { HttpServiceService } from '../_services/http-service.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  tenantArray: any = [];
  logoUrl: any
  countryName: any;
  countryTimeZone: any;
  selectedMenuItem: any = [];
  logoBasePath: any
  constructor(private constant: Constants, private router: Router, private httpService: HttpServiceService, private dataservice: DataService) {
    this.logoUrl = '';
    this.logoBasePath = this.constant.imageBasePath;
  }

  ngOnInit(): void {
    this.getBranchDetails();
    this.selectedMenuItem = this.dataservice.getData('pages');
  }

  getBranchDetails() {
    this.httpService.get('tenant')
      .subscribe(result => {
        if (result.status == 200) {
          this.tenantArray = result.data.tenants
          if (this.tenantArray.logo_url)
            this.logoUrl = this.constant.imageBasePath + this.tenantArray.logo_url
          else
            this.logoUrl = "assets/images/logo.png"
          this.countryName = this.tenantArray.country.name
          this.countryTimeZone = this.tenantArray.timezone

        } else {
          console.log("Error");
        }
      });
  }
  menuOnClick(menu_url: any) {
    let url_name = menu_url.substring(1);
    this.router.navigate([url_name])
  }
  editTenant(id: any) {
    this.router.navigate(['setup/editTenant/' + id])

  }
  location() {
    this.router.navigate(['setup/location'])
  }
  staff() {
    this.router.navigate(['setup/staff'])
  }
  menuSetup() {
    this.router.navigate(['setup/menuSetup'])
  }
  globalSettings() {
    this.router.navigate(['setup/globalSettings'])
  }
  partner() {
    this.router.navigate(['setup/partner'])
  }
  myAccount() {
    this.router.navigate(['setup/myAccount'])
  }
  addons() {
    this.router.navigate(['setup/addons'])
  }
  inventorySetup() {
    this.router.navigate(['setup/inventorySetup'])

  }
}
