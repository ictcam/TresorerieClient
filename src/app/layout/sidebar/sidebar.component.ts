import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../auth/auth/token-storage.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private roles: string[];
  public authority: string;
  info: any;
  constructor(
      private tokenStorage: TokenStorageService,) { }

  ngOnInit() {
    this.info = {
      token: this.tokenStorage.getToken(),
      username: this.tokenStorage.getUsername(),
      authorities: this.tokenStorage.getAuthorities()
    };

    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        // 'ROLE_USER_ALPI,,,,,,,'
        if (role === 'ROLE_SUPER_ADMIN') {
          this.authority = 'super_admin';
          return false;
        } else if (role === 'ROLE_TRESORIER') {
          this.authority = 'tresorier';
          return false;
        }
        this.authority = 'admin';
        return true;
      });
    }
    console.log(this.tokenStorage.getAuthorities())
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

}
