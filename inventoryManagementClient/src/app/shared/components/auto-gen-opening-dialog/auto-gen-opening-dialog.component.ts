import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fadeInEffect } from 'src/app/animations';

@Component({
  selector: 'app-auto-gen-opening-dialog',
  templateUrl: './auto-gen-opening-dialog.component.html',
  styleUrls: ['./auto-gen-opening-dialog.component.css'],
  animations: [fadeInEffect]
})
export class AutoGenOpeningDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AutoGenOpeningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true);
  }

}
