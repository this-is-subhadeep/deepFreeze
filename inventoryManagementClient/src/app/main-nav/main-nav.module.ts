import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSidenavModule, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainNavComponent } from "./main-nav/main-nav.component";

@NgModule({
    declarations: [MainNavComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        // MatCardModule,
        // MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        // MatTooltipModule,
        // MatExpansionModule,
        MatMenuModule,
    ],
    exports: [MainNavComponent]
})

export class MainNavModule {}