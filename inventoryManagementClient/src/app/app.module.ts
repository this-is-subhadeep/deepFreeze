import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import {
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatMenuModule
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material'
import { MatIconModule } from '@angular/material'

import { ProductService } from './shared/services/product.service';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SellingComponent } from './selling/selling.component';
import { DateService } from './shared/services/date.service';
import { VendorService } from './shared/services/vendor.service';
import { InventoryService } from './shared/services/inventory.service';
import { UnitValidatorDirective } from './custom-directives/unit-validator.directive';
import { DepositValidatorDirective } from './custom-directives/deposit-validator.directive';
import { ProductViewComponent } from './product/product-view/product-view.component';
import { VendorViewComponent } from './vendor-view/vendor-view.component';
import { AppRoutingModule } from './app-routing.modules';
import { SharedModule } from './shared/shared.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductModule } from './product/product.module';
@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    VendorViewComponent,
    SellingComponent,
    UnitValidatorDirective,
    DepositValidatorDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    AppRoutingModule,
    MatCardModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatMenuModule,
    SharedModule,
    InventoryModule,
    ProductModule
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
