import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellingComponent } from 'src/app/selling/selling/selling.component';

@NgModule({
    imports: [RouterModule.forChild([{path: '', component: SellingComponent}])],
    exports: [RouterModule]
})

export class SellingRoutingModule {}
