import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MymanagerPage } from './mymanager';

@NgModule({
  declarations: [
    MymanagerPage,
  ],
  imports: [
    IonicPageModule.forChild(MymanagerPage),
  ],
})
export class MymanagerPageModule {}
