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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [{cardName: 'Card name', set: 'Set name'}]
    );

    for (let index = 0; index < cardData.length; index++) {
      const element: CardDetail = cardData[index];
      XLSX.utils.sheet_add_json(ws,
        [
          {cardName: element.card.name, set: element.card.set.name }
        ]
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: ws }, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `prueba${EXCEL_EXTENSION}`);
  }
}
