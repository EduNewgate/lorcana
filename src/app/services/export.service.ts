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
    let list: {cardName: string, set: string}[] = [];
    list.push({ cardName: 'Card name', set: 'Set Name' });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(list);

    for (let index = 0; index < cardData.length; index++) {
      const element: CardDetail = cardData[index];
      list.push({cardName: element.card.name, set: element.card.set.name});
    }
    XLSX.utils.sheet_add_json(ws, list);
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: ws }, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `prueba${EXCEL_EXTENSION}`);
  }
}
