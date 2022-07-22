import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
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
        InventoryRoutingModule,
        ComponentsModule
    ],
    exports: [InventoryComponent]
})

export class InventoryModule { }