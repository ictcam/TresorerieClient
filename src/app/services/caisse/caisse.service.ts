import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Caisse} from "../../Model/Caisse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CaisseService {

  constructor(private http: HttpClient) { }

  getCaisse():Observable<any>{

    return this.http.get(environment.CAISSE);

  }

  getLast30Days():Observable<any>{

    return this.http.get(environment.CAISSE + '/last30days');

  }

  getGroup():Observable<any>{

    return this.http.get(environment.CAISSE + '/section');

  }

  getSolde():Observable<any>{

    return this.http.get(environment.CAISSE + '/solde');

  }

  getHier():Observable<any>{

    return this.http.get(environment.CAISSE + '/hier');

  }

  getThisWeek():Observable<any>{

    return this.http.get(environment.CAISSE + '/csem');

  }

  getLastWeek():Observable<any>{

    return this.http.get(environment.CAISSE + '/semp');

  }

  getLastMonth():Observable<any>{

    return this.http.get(environment.CAISSE + '/lastMonth');

  }

  getThisMonth():Observable<any>{

    return this.http.get(environment.CAISSE + '/thisMonth');

  }

  getProvisoir():Observable<any>{

    return this.http.get(environment.CAISSE + '/provisoir');

  }

  addInstance(caisse: Caisse ): Observable<any>{
    return this.http.post(environment.CAISSE, caisse);
  }

  showInstance(id: number): Observable<any>{
    return this.http.get(environment.CAISSE + `/${id}`);
  }

  updateInstance(id: number, caisse: Caisse): Observable<any>{
    return this.http.put(environment.CAISSE + `/update/${id}`, caisse);
  }
}
