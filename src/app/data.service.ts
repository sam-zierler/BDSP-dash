import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getTable() {
    return this.http.get('https://www.googleapis.com/fusiontables/v1/tables/1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC');
  }

}
