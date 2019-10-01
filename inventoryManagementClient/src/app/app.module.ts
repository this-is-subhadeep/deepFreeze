import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterModule } from '@angular/router';

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
  MatMenuModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material'
import { MatIconModule } from '@angular/material'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ProductService } from './services/product.service';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { InventoryComponent } from './inventory/inventory.component';
import { SellingComponent } from './selling/selling.component';
import { DateService } from './services/date.service';
import { VendorService } from './services/vendor.service';
import { InventoryService } from './services/inventory.service';
import { UnitValidatorDirective } from './custom-directives/unit-validator.directive';
import { DepositValidatorDirective } from './custom-directives/deposit-validator.directive';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductComponent } from './product/product.component';
import { VendorViewComponent } from './vendor-view/vendor-view.component';
import { VendorComponent } from './vendor/vendor.component';
import { BuyingComponent } from './buying/buying.component';
import { OpeningComponent } from './opening/opening.component';
import { AppRoutingModule } from './app-routing.module';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';
@NgModule({
  declarations: [
    AppComponent,
    ProductViewComponent,
    MainNavComponent,
    InventoryComponent,
    VendorViewComponent,
    SellingComponent,
    UnitValidatorDirective,
    DepositValidatorDirective,
    ProductComponent,
    VendorComponent,
    BuyingComponent,
    OpeningComponent,
    PrintLayoutComponent,
    InvoiceComponent
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
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
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
