import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';



@NgModule({
  declarations: [
    NavBarComponent,
    ModalDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    NavBarComponent,
    ModalDialogComponent
  ]
})
export class SharedModule { }
