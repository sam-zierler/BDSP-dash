import { Observable } from "rxjs"
import { map } from 'rxjs/operators'
import { Injectable } from "@angular/core"
import { Http, Response } from "@angular/http"

@Injectable()
export class HttpClient {

    tableId = "1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC";
    apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";

    constructor(public http: Http) {}

    public fetchData() {

        let query = "SELECT 'truckID', 'start', 'end', 'run', 'latitude', 'longitude', 'tons', 'distance', 'notes' FROM " + this.tableId;
        let encodedQuery = encodeURIComponent(query);

        // uncomment to confirm `query`
        // alert(query);

        let url = ['https://www.googleapis.com/fusiontables/v2/query'];
            url.push('?sql=' + encodedQuery);
            url.push('&key=' + this.apikey);
            url.push('&callback=?');

        return this.http.get(url.join('')).pipe(map((res: Response) => res.json()))
    }
}