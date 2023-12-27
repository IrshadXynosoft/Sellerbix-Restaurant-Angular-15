import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { walletRoutingModule } from './wallet-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    walletRoutingModule,
    SharedModule
  ]
})
export class WalletModule { }
