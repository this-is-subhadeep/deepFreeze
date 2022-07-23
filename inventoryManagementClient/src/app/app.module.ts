import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ProductService } from './shared/services/product.service';
import { DateService } from './shared/services/date.service';
import { VendorService } from './shared/services/vendor.service';
import { InventoryService } from './shared/services/inventory.service';
import { AppRoutingModule } from './app-routing.modules';
import { MainNavModule } from './main-nav/main-nav.module';
import { CustomDatePipe } from './shared/pipes/custom-date.pipe';
import { MAT_DATE_FORMATS } from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MainNavModule
  ],
  providers: [
    ProductService,
    VendorService,
    InventoryService,
    DatePipe,
    DateService,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    CustomDatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
