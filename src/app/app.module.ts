import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from "./auth/auth/auth.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import {AuthGuardService} from "./services/auth-guard/auth-guard.service";
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import {CaisseService} from "./services/caisse/caisse.service";
import {httpInterceptorProviders} from "./auth/auth/auth-interceptor";
import { ChartComponent } from './chart/chart.component';
import {ChartModule} from "angular2-chartjs";
import {DatePipe} from "@angular/common";
import {ChartsModule, ThemeService} from "ng2-charts";
import { NewInstanceComponent } from './Pages/new-instance/new-instance.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { UsersComponent } from './Pages/users/users.component';
import { DashComponent } from './dash/dash.component';
import { EditComponent } from './Pages/edit/edit.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { Erreur404Component } from './Pages/erreur404/erreur404.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    ChartComponent,
    NewInstanceComponent,
    LayoutComponent,
    UsersComponent,
    DashComponent,
    EditComponent,
    Erreur404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    ChartModule,
    ChartsModule,
    SweetAlert2Module.forRoot(),
    NgbModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    CaisseService,
    httpInterceptorProviders,
    DatePipe,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
