import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../Model/User";
import {UserService} from "../../services/users/user.service";
import {SignUpInfo} from "../../Model/SignupInfo";
import {TokenStorageService} from "../../auth/auth/token-storage.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  form: any = {};
  signupInfo: SignUpInfo;
  signupInfos: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';
  users: User[] = [];
  user: User;
  discForm: FormGroup;
  loaders = false;
  show = false;
  role: string[] = [];
  info: any;
  private roles: string[];
  public authority: string;
  constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private tokenStorage: TokenStorageService,
  ) {
    this.createForm();
    this.user = new User();
  }

  initDisci() {
    this.createForm();
  }
  createForm() {
    this.discForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUsers();

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
  }

  add(){
    this.role = [];



    this.user.username = this.discForm.controls['username'].value;
    this.user.password = this.discForm.controls['password'].value;
    this.role.push(this.discForm.controls['role'].value);
    this.signupInfos = new SignUpInfo(
        this.discForm.controls['username'].value,
        this.discForm.controls['password'].value,
        this.role
    );
    console.log('caisse', this.user);
    console.log('user', this.signupInfos);

    this.userService.addUser(this.signupInfos).subscribe(
        res => {
          this.initDisci();
          this.loadUsers();
        }
    );
  }

  loadUsers(){
    this.loaders = true;
    this.userService.getUsers().subscribe(
        res => {
          this.users = res;
          this.loaders = false;
        },
        error =>{
          this.loaders = false;
        },
        () =>{
          this.loaders = false;
          console.log(this.users)
        }
    );
  }
}
