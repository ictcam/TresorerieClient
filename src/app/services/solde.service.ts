import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SoldeService {

  constructor(private http: HttpClient) { }

  getLastSolde():Observable<any>{

    return this.http.get(environment.LAST_SOLDE);

  }
}
