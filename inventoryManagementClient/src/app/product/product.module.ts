import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatTableModule, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../app-routing.modules";
import { SharedModule } from "../shared/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductViewComponent } from "./product-view/product-view.component";

@NgModule({
    declarations: [ProductViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatSelectModule,
        MatExpansionModule,
        ProductRoutingModule,
        SharedModule
    ],
    exports: [ProductViewComponent]
})

export class ProductModule {}