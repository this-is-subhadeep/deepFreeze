import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VendorViewComponent } from "./vendor-view/vendor-view.component";

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: VendorViewComponent }])],
    exports: [RouterModule]
})

export class VendorRoutingModule { }