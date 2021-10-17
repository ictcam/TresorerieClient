import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {User} from "../../Model/User";
import {SignUpInfo} from "../../Model/SignupInfo";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers():Observable<any>{

    return this.http.get(environment.URERS);

  }

  addUser(user: SignUpInfo ): Observable<any>{
    return this.http.post(environment.URERS+ '/signup', user);
  }
}
