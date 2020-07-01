import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  baseURL = 'https://api.binance.com/api/v1/ticker/price';
  constructor(public http: HttpClient){ }

  addSymbol(){
    return <any>(
      this.http.get(this.baseURL)
    );
  }

}
