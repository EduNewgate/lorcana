import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { CardDetail } from '../models/common.model';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  public exportToExcel(cardData: CardDetail[]) {
    let list: {
      cardName: string,
      set: string,
      repeated: string,
      normal: number | string,
      foil: number | string
    }[] = [];
    list.push({
      cardName: 'Card name',
      set: 'Set Name',
      repeated: 'Repeated',
      normal: 'Normals',
      foil: 'Foil'
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(list, {skipHeader: true});

    for (let index = 0; index < cardData.length; index++) {
      const element: CardDetail = cardData[index];
      list.push({
        cardName: element.card.name + ' - ' + element.card.version,
        set: element.card.collector_number.padStart(3, '0') + ' - ' + element.card.set.name,
        repeated: element.myCards.total > 1 ? 'Yes' : 'No',
        normal: element.myCards.normal,
        foil: element.myCards.foil
      });
    }
    XLSX.utils.sheet_add_json(ws, list, {skipHeader: true});
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: ws }, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `prueba${EXCEL_EXTENSION}`);
  }
}
