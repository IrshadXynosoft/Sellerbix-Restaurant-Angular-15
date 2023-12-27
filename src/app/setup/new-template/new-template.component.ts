import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss']
})
export class NewTemplateComponent implements OnInit {
title:any='Invoice'
label:any='INV#:'
customer:any='Customer'
staff:any="Staff"
item:any='Item'
qty:any='Qty'
price:any='Amount'
name:any=''
cancelledOrder:any="Cancelled Order"
subTotal:any='Sub-Total'
taxLabel:any='Tax'
toPayLabel:any='Total'
AmountRecievedLabel:any='Cash'
balanceLabel:any='Change'
surchargeLabel:any='Surcharge'
isShowDeliveryAddress:boolean=false;
isShowLogo:boolean=false;
isShowHeader:boolean=false;
isShowFooter:boolean=false;
show_modified_items:boolean=false;
show_order_notes:boolean = false;
show_loyality:boolean = false;
show_modifier_and_notes:boolean=false;
has_running_order_test:boolean=false;
print_larger:boolean =false;
show_price:boolean=false;
show_combo_items:boolean=false;
print_only_new_items:boolean=false;
label_printing:boolean=false;
show_breakdown_price:boolean=false
footerText:any;
headerText:any;
branchName:any;
currentBreadCrumb:string="Create New Printer Template"
id:any;
public url: string = this.router.url;
public editId:string = this.route.snapshot.params.editid;
  constructor(private  router:Router,private localservice:LocalStorage,private route:ActivatedRoute,private httpService:HttpServiceService, private snackBService:SnackBarService) {
    this.id=this.route.snapshot.params.id;
   }

  ngOnInit(): void {
    this.getBranchName();
    this.routerCheck();
  }

  routerCheck() {
    if(this.url == "/setup/printers/"+this.id+"/editTemplate/"+this.editId) {
      this.currentBreadCrumb= "Edit Printer Template"
      this.httpService.get('printer-template/' + this.editId)
      .subscribe(result => {
        if (result.status == 200) {
          let records=result.data;
          this.name=records.name;
          this.title=records.printer_template_detail.title_label;
          this.customer=records.printer_template_detail.customer_label;
          this.staff=records.printer_template_detail.served_by_label;
          this.cancelledOrder=records.printer_template_detail.cancelled_order_label;
          this.item=records.printer_template_detail.item_header_label;
          this.qty=records.printer_template_detail.qty_header_label;
          this.price=records.printer_template_detail.price_header_label;
          this.subTotal=records.printer_template_detail.sub_total_label;
          this.taxLabel=records.printer_template_detail.tax_label;
          this.surchargeLabel=records.printer_template_detail.surcharge_label;
          this.toPayLabel=records.printer_template_detail.to_pay_label;
          this.AmountRecievedLabel=records.printer_template_detail.amt_received_label;
          this.balanceLabel=records.printer_template_detail.balance_label;
          this.footerText=records.printer_template_detail.footer;
          this.headerText=records.printer_template_detail.header;
          this.isShowLogo=records.printer_template_rule.show_logo;
          this.isShowDeliveryAddress= records.printer_template_rule.show_delivery_address;
          this.isShowHeader= records.printer_template_rule.show_header;
          this.isShowFooter= records.printer_template_rule.show_footer;
          this.show_modified_items=records.printer_template_rule.show_modifiers;
          this.show_order_notes=records.printer_template_rule.show_order_notes;
          this.show_loyality=records.printer_template_rule.show_loyalty;
          // this.has_running_order_test=records.printer_template_rule.
          this.print_only_new_items=records.printer_template_rule.print_only_new_items;
          this.print_larger=records.printer_template_rule.print_larger;
          this.show_price=records.printer_template_rule.show_price;
          this.show_combo_items=records.printer_template_rule.show_combo_items;
          this.label_printing=records.printer_template_rule.label_printing;
          this.show_breakdown_price=records.printer_template_rule.show_breakdown_price;
          this.show_modifier_and_notes=records.printer_template_rule.show_item_notes
        } else {
          console.log("Error");
        }
      });
    }
  }

  onShowDeliveryAddress(event:any)
  {
    if(event.checked)
    {
      this.isShowDeliveryAddress=true;
    }
    else{
      this.isShowDeliveryAddress=false;
    }
  }

  getBranchName()
  {
    this.httpService.get('branch')
    .subscribe(result => {
      if (result.status == 200) {
        let branchRecords = result.data.tenant_branches;
        branchRecords.forEach((element:any) => {
          if(this.id==element.id)
          {
            this.branchName=element.name
          }
        });
      } else {
        console.log("Error in Get Branch");
      }
    });
  }

  onShowLogo(event:any)
  {
    if(event.checked)
    {
      this.isShowLogo=true;
    }
    else{
      this.isShowLogo=false;
    }

  }
  onShowHeader(event:any)
  {
    if(event.checked)
    {
      this.isShowHeader=true;
    }
    else{
      this.isShowHeader=false;
    }
  }
  onShowFooter(event:any)
  {
    if(event.checked)
    {
      this.isShowFooter=true;
    }
    else{
      this.isShowFooter=false;
    }
  }

  showModifiedItems(event:any) {
    if(event.checked) {
      this.show_modified_items = true;
    }
    else {
      this.show_modified_items = false;
    }
  }

  showOrderNotes(event:any) {
    if(event.checked) {
      this.show_order_notes = true;
    }
    else {
      this.show_order_notes = false;
    }
  }

  showLoyality(event:any) {
    if(event.checked) {
      this.show_loyality = true;
    }
    else {
      this.show_loyality = false;
    }
  }

  showModifierandNotes(event:any) {
    if(event.checked) {
      this.show_modifier_and_notes = true;
    }
    else {
      this.show_modifier_and_notes = false;
    }
  }

  hasRunningOrderText(event:any) {
    if(event.checked) {
      this.has_running_order_test = true;
    }
    else {
      this.has_running_order_test = false;
    }
  }

  printLarger(event:any) {
    if(event.checked) {
      this.print_larger = true;
    }
    else {
      this.print_larger = false;
    }
  }

  showPrice(event:any) {
    if(event.checked) {
      this.show_price = true;
    }
    else {
      this.show_price = false;
    }
  }

  showComboItems(event:any) {
    if(event.checked) {
      this.show_combo_items = true;
    }
    else {
      this.show_combo_items = false;
    }
  }

  printOnlyNewItems(event:any) {
    if(event.checked) {
      this.print_only_new_items = true;
    }
    else {
      this.print_only_new_items = false;
    }
  }

  showBreakdown(event:any) {
    if(event.checked) {
      this.show_breakdown_price = true;
    }
    else {
      this.show_breakdown_price = false;
    }
  }

  LabelPrinting(e:any) {
    if(e.checked) {
      this.label_printing = true;
    }
    else {
      this.label_printing = false;
    }
  }

  cancel() {
    this.router.navigate(['setup/location/' + this.id + '/printers/settings'])
  }

  saveTemplate() {
    let body ={
      name:this.name,
      title_label:this.title,
      inv_number_label:this.label,
      customer_label:this.customer,
      served_by_label:this.staff,
      item_header_label:this.item,
      qty_header_label:this.qty,
      price_header_label:this.price,
      cancelled_order_label:this.cancelledOrder,
      sub_total_label:this.subTotal,
      tax_label:this.taxLabel,
      to_pay_label:this.toPayLabel,
      surcharge_label:this.surchargeLabel,
      amt_received_label:this.AmountRecievedLabel,
      balance_label:this.balanceLabel,
      show_delivery_address:this.isShowDeliveryAddress,
      show_logo:this.isShowLogo,
      branch_id:this.id,
      show_modifiers:this.show_modified_items,
      show_order_notes:this.show_order_notes,
      show_loyalty:this.show_loyality,
      show_item_notes:this.show_modifier_and_notes,
      has_running_order_text:this.has_running_order_test,
      print_larger:this.print_larger,
      show_price:this.show_price,
      show_combo_items:this.show_combo_items,
      print_only_new_items:this.print_only_new_items,
      label_printing:this.label_printing,
      show_breakdown_price:this.show_breakdown_price,
      show_header:this.isShowHeader,
      show_footer:this.isShowFooter,
      footer:this.footerText,
      header:this.headerText
    }
    if(this.url == "/setup/printers/"+this.id+"/editTemplate/"+this.editId) {
      this.httpService.put('printer-template/' + this.editId, body)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Template Updated Successfully", "Close");
        this.router.navigate(['setup/location/' + this.id + '/printers/settings'])
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });

    }
    else {
      this.httpService.post('printer-template', body)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Template Generated Successfully", "Close");
        this.router.navigate(['setup/location/' + this.id + '/printers/settings'])
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
    }
    
  }
}
