import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  HttpClientModule  } from '@angular/common/http';
import { Constants } from '../constants';
import { LocalStorage } from './_services/localstore.service';
import { CryptoService } from './_services/crypto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Preloader } from './shared/preloader/preloader.service';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './_services/confirmation-dialog.service';
import { DemoMaterialModule } from './material-module';
import { ShowNoteComponent } from './show-note/show-note.component';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { environmentMqtt as env } from '../constants';
import { MenuNewComponent } from './menu-new/menu-new.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { OnlineStatusModule } from 'ngx-online-status';
import { EorderConfirmationComponent } from './eorder-confirmation/eorder-confirmation.component';
import { OnlineOrderCancellationReasonComponent } from './online-order-cancellation-reason/online-order-cancellation-reason.component';
import { EntityOrdersCancellationComponent } from './entity-orders-cancellation/entity-orders-cancellation.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: env.mqtt.server,
  port: env.mqtt.port,
  protocol: (env.mqtt.protocol === "wss") ? "wss" : "ws",
  path: '',
  username: env.mqtt.username,
  password: env.mqtt.password,
};
// import { AddMenuItemComponent } from './add-menu-item/add-menu-item.component';


@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    ConfirmationDialogComponent,
    ShowNoteComponent,
    MenuNewComponent,
    EorderConfirmationComponent,
    OnlineOrderCancellationReasonComponent,
    EntityOrdersCancellationComponent,
    AlertMessageComponent,
     // AddMenuItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    MatSidenavModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    OnlineStatusModule

  ],

  providers: [Constants,LocalStorage,CryptoService, Preloader,ConfirmationDialogService,{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},],
  bootstrap: [AppComponent]
})
export class AppModule { }
