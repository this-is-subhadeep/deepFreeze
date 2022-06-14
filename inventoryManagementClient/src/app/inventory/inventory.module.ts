import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatInputModule, MatTableModule, MatTooltipModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { InventoryRoutingModule } from "./inventory-routing.module";
import { InventoryComponent } from "./inventory/inventory.component";

@NgModule({
    declarations: [InventoryComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule,
        InventoryRoutingModule
    ],
    exports: [InventoryComponent]
})

export class InventoryModule { }