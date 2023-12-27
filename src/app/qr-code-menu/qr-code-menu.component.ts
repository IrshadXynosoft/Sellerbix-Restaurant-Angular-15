import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/constants';
import { HttpServiceService } from '../_services/http-service.service';
import { LocalStorage } from '../_services/localstore.service';

@Component({
  selector: 'app-qr-code-menu',
  templateUrl: './qr-code-menu.component.html',
  styleUrls: ['./qr-code-menu.component.scss']
})
export class QRCodeMenuComponent implements OnInit {
  showFiller = false;
  classApplied = false;
  branch_id = this.localservice.get('branch_id');
  CategoryRecords:any=[];
  classactive: any;
  itemData: any=[];
  CategoryItems: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  imageBasePath = this.constant.imageBasePath;
  toggleClass(params:any) {
    this.itemData = params;
    console.log(this.itemData);
    this.classApplied = true;
  }
  closeToggleClass() {
    this.classApplied = false;
  }
  constructor(private constant: Constants,private httpService: HttpServiceService,private localservice: LocalStorage) { }

  ngOnInit(): void {
    this.getMenuCategory()
  }

  getMenuCategory() {
    this.httpService.get('menu-items/' + this.branch_id + '/1' )
      .subscribe(result => {
        if (result.status == 200) {
          this.CategoryRecords = result.data;
          // this.CategoryRecords.unshift({ 'category_id': 0, 'category_name': 'Quick Items', 'colour': '#0777' })
          // this.CategoryRecords.unshift({ 'category_id': -1, 'category_name': 'ALL', 'colour': '#0778' })
          this.OnCategoryChange(this.CategoryRecords[0])
        } else {
          console.log("Error");
        }
      });
  }

  OnCategoryChange(items: any) {
    this.classactive = items.category_id;
    if (items.category_id == -1) {
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            this.CategoryItems.push(obj2);
          });
        }
      });
    } else if (items.category_id == 0) {
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            if (obj2.is_quick_item == 1)
              this.CategoryItems.push(obj2);
          });
        }
      });
    } else {
      if (items.item)
        this.CategoryItems = items.item;
      else
        this.CategoryItems = [];
    }
  }

  modifiercheck(modifierList:any) {
    let flag = false;
    for(let list of modifierList){
      if (list.status) {
        flag =  true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }
  
}
