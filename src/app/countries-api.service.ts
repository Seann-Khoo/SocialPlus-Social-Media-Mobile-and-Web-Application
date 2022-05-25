import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesAPIService {

  constructor(private http: HttpClient) { }

  loadAll(){
    return this.http.get("https://restcountries.eu/rest/v2/subregion/South-Eastern Asia")
  }
}
