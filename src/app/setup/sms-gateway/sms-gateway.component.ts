import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EditSmsGatewayComponent } from '../edit-sms-gateway/edit-sms-gateway.component';
import { SmsSettingsComponent } from '../sms-settings/sms-settings.component';
// import { EditSmsGatewayComponent } from '../edit-sms-gateway/edit-sms-gateway.component';
// import { SmsSettingsComponent } from '../sms-settings/sms-settings.component';

export interface TriggerPoints {
  id: number;
  active_trigger_point: any;
  template: any;
  status: any
}

@Component({
  selector: 'app-sms-gateway',
  templateUrl: './sms-gateway.component.html',
  styleUrls: ['./sms-gateway.component.scss']
})
export class SmsGatewayComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  } public displayedColumns: string[] = ['index', 'active_trigger_point', 'template', 'status', 'actions'];
  public dataSource = new MatTableDataSource<TriggerPoints>();
  public smsGatewayForm!: UntypedFormGroup;
  tagsChoosen: any = [];
  templateRecords: any = [];
  triggers: any = [];
  templates: any = [
    { name: '#order_number#' }, { name: '#amount#' }, { name: '#organization_name#' }, { name: '#balance_amount#' }, { name: '#due_amount#' }, { name: '#order_status#' }, { name: '#branch_name#' }
  ]
  constructor(private snackBService: SnackBarService, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getTemplates();
    this.getTriggers();
  }
  onBuildForm() {
    this.smsGatewayForm = this.formBuilder.group({
      trigger_point: ['', Validators.compose([Validators.required])],
      message_template: ['', Validators.compose([Validators.required])],
      status: false
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  smsSettings() {
    const dialogRef = this.dialog.open(SmsSettingsComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getTriggers() {
    this.httpService.get('triggers', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.triggers = result.data.triggers;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getTemplates() {
    this.httpService.get('message-template')
      .subscribe(result => {
        if (result.status == 200) {
          this.templateRecords = result.data.templates;
          const data: any = [];
          this.templateRecords?.forEach((obj: any) => {
            let Objdata = {
              id: obj.id,
              active_trigger_point: obj.trigger_name,
              template: obj.template,
              status: obj.status
            }
            data.push(Objdata)
          });
          this.dataSource.data = data as TriggerPoints[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  saveTemplate() {
    let body = {
      template: this.smsGatewayForm.value['message_template'],
      trigger_id: this.smsGatewayForm.value['trigger_point'],
      status: this.smsGatewayForm.value['status']
    }
    if (this.smsGatewayForm.valid) {
      this.httpService.post('message-template', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.getTemplates();
            this.tagsChoosen = [];
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
  }

  deleteItem(element: any) {
    this.httpService.delete('message-template/' + element.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.getTemplates()
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  editItem(element: any) {
    const dialogRef = this.dialog.open(EditSmsGatewayComponent, {
      width: '70%',
      data: {
        id: element.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTemplates()
      }
    });
  }
  backspaceEvent(e: any) {
    this.tagsChoosen = e.target.value.split(' ')
    console.log(this.tagsChoosen);
  }

  selectedOptions(note: any) {
    this.tagsChoosen.push(note);
    this.smsGatewayForm.patchValue({
      message_template: this.tagsChoosen.join(' ')
    })
  }
}
