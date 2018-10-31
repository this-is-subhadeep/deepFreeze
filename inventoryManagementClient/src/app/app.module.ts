import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatTableModule,
         MatButtonModule,
         MatInputModule,
         MatSelectModule,
         MatToolbarModule,
         MatSidenavModule,
         MatListModule,
         MatCardModule,
         MatPaginatorModule,
         MatDatepickerModule,
         MatTooltipModule
        } from '@angular/material';
import { MatNativeDateModule } from '@angular/material'
import { MatIconModule } from '@angular/material'

import { ProductComponent } from './product/product.component';
import { ProductService } from './services/product.service';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { InventoryComponent } from './inventory/inventory.component';
import { VendorComponent } from './vendor/vendor.component';
import { DateService } from './services/date.service';
import { VendorService } from './services/vendor.service';
import { InventoryService } from './services/inventory.service';
@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    MainNavComponent,
    InventoryComponent,
    VendorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule.forRoot([
      {
        path: '',
        component: InventoryComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'products',
        component: ProductComponent
      },
      {
        path: 'vendors',
        component: VendorComponent
      }
   ]),
   MatCardModule,
   MatPaginatorModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatTooltipModule,
   MatExpansionModule
  ],
  providers: [
    ProductService,
    VendorService,
    InventoryService,
    DatePipe,
    DateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
