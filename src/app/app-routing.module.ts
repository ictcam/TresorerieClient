import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./authentification/login/login.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {DashboardComponent} from "./Pages/dashboard/dashboard.component";
import {AuthGuardService} from "./services/auth-guard/auth-guard.service";
import {ChartComponent} from "./chart/chart.component";
import {NewInstanceComponent} from "./Pages/new-instance/new-instance.component";
import {UsersComponent} from "./Pages/users/users.component";
import {EditComponent} from "./Pages/edit/edit.component";
import {Erreur404Component} from "./Pages/erreur404/erreur404.component";


const routes: Routes = [
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'signup',
    component: RegisterComponent
  },
  {path: '', component: DashboardComponent, canActivate:[AuthGuardService] },
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuardService] },
  {path: 'new-instance', component: NewInstanceComponent, canActivate:[AuthGuardService] },
  {path: 'edit/:id', component: EditComponent, canActivate:[AuthGuardService] },
  {path: 'reg', component: RegisterComponent, canActivate:[AuthGuardService] },
  {path: 'users', component: UsersComponent, canActivate:[AuthGuardService] },
  {path: 'chart', component: ChartComponent, },
  {path: 'erreur', component: Erreur404Component },
  {path: '**', redirectTo: '/erreur'}

];

@NgModule({
  imports: [RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      } //pour avoir le suivi des routes dans la console
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
