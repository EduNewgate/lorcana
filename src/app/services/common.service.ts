import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CardResponse, SetDetail } from './../models/common.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(private http: HttpClient) { }

  getAllSets(): Observable<{results: SetDetail[]}> {
    return this.http.get<{results: SetDetail[]}>('https://api.lorcast.com/v0/sets');
  }

  getFilteredCards(formParams: any): Observable<{results: CardResponse[]}> {
    let query: string = 'search?q=';
    if (formParams.cardName) {
      query += formParams.cardName;
    }
    if (formParams.set) {
      query += '+set:' + formParams.set.code;
    }
    if (formParams.rarity) {
      query += '+rarity:' + formParams.rarity.name;
    }
    if (formParams.ink) {
      query += '+ink:' + formParams.ink.name;
    }
    return this.http.get<{results: CardResponse[]}>('https://api.lorcast.com/v0/cards/' + query);
  }

}
