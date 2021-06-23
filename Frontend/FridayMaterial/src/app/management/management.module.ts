import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementBaseComponent } from './management-base/management-base.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CateringManagementComponent } from './catering/catering.component';
import { RoleGuard } from './role.guard';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdduserComponent } from './tools/admin/adduser/adduser.component';
import { AdjustuserComponent } from './tools/admin/adjustuser/adjustuser.component';
import { ConfigComponent } from './tools/admin/config/config.component';
import { LogsComponent } from './tools/admin/logs/logs.component';
import { AdditemComponent } from './tools/catering/additem/additem.component';
import { ManagestockComponent } from './tools/catering/managestock/managestock.component';
import { TotalhistoryComponent } from './tools/catering/totalhistory/totalhistory.component';

const routes: Routes = [
  {
    path: "", component: ManagementBaseComponent,
    canActivate: [RoleGuard], data: { role: ["admin", "catering"] }
    // children: [
    //   {
    //     path: "admin", component: AdminComponent,
    //     canActivate: [RoleGuard], data: { role: ["admin"] }
    //   },
    //   {
    //     path: "catering", component: CateringManagementComponent,
    //     canActivate: [RoleGuard], data: { role: ["catering"] }
    //   }
    // ]
  }
]

@NgModule({
  declarations: [ManagementBaseComponent, AdminComponent, CateringManagementComponent, AdduserComponent, AdjustuserComponent, ConfigComponent, LogsComponent, AdditemComponent, ManagestockComponent, TotalhistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ManagementModule { }
