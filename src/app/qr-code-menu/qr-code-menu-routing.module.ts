import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QRCodeMenuComponent } from './qr-code-menu.component';
import { Router, NavigationEnd} from '@angular/router'; 
const routes: Routes = [{ path: '', component: QRCodeMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QRCodeMenuRoutingModule {
  
 }
