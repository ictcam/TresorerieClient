import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "../../auth/auth/auth.service";
import {TokenStorageService} from "../../auth/auth/token-storage.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private authService: AuthService, private token_storage: TokenStorageService) { }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{

    if(this.token_storage.getToken()){
      return true;
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    console.log('tests')
    return false;

  }
}
