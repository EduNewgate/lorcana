import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { CommonService } from '../../services/common.service';

import { CardDetail, CardResponse, Ink, NumberOfCards, Rarity, SetDetail } from './../../models/common.model';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule
  ],
  providers: [CommonService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  layout: "list" | "grid" = 'list';

  inks: Ink[] | undefined;
  rarities: Rarity[] | undefined;
  sets: SetDetail[] | undefined;

  lastSet: SetDetail | undefined;

  formGroup!: FormGroup;

  cards!: CardDetail[];

  constructor(private commonService: CommonService, private exportService: ExportService) { }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.inks = [
      { name: 'Amber', code: 'AMB' },
      { name: 'Amethyst', code: 'AME' },
      { name: 'Emerald', code: 'EME' },
      { name: 'Ruby', code: 'RUB' },
      { name: 'Sapphire', code: 'SAP' },
      { name: 'Steel', code: 'STE' }
    ];

    this.rarities = [
      { name: 'Common', code: 'C' },
      { name: 'Uncommon', code: 'U' },
      { name: 'Rare', code: 'R' },
      { name: 'Super-Rare', code: 'S' },
      { name: 'Legendary', code: 'L' },
      { name: 'Enchanted', code: 'E' }
    ]

    this.formGroup = new FormGroup({
      cardName: new FormControl<string | undefined>(undefined),
      ink: new FormControl<Ink | undefined>(undefined),
      set: new FormControl<SetDetail | undefined>(undefined),
      rarity: new FormControl<Rarity | undefined>(undefined)
    });

    this.commonService.getAllSets().subscribe((res: { results: SetDetail[] }) => {
      this.sets = res.results;
      this.formGroup.get('set')?.setValue(this.sets[this.sets.length - 1]);
      this.searchCards();
    });
  }

  searchCards() {
    this.commonService.getFilteredCards(this.formGroup.value).subscribe((res: { results: CardResponse[] }) => {
      this.cards = res.results.map((cardResponse: CardResponse) => {
        return {
          card: cardResponse,
          myCards: {cardId: cardResponse.id, normal: 0, foil: 0, total: 0}
        };
    });
      this.sortCardsBySetAndNumber(this.cards);
    })
  }

  sortCardsBySetAndNumber(cards: CardDetail[]) {
    cards.sort((a: CardDetail, b: CardDetail) =>
      a.card.set.code.padStart(3, '0').localeCompare(b.card.set.code.padStart(3, '0')) || a.card.collector_number.padStart(3, '0').localeCompare(b.card.collector_number.padStart(3, '0'))
    );
  }

  formatCardDescription(cardId: string, cardDescription: string) {
    const container = document.getElementById(cardId);
    if (container) {
      let result = cardDescription.replaceAll("{L}", `<img src="./../../../assets/images/common/lore.png" width="10px"/>`);
      container.innerHTML = result;
      result = result.replaceAll("{S}", `<img src="./../../../assets/images/common/strength.png" width="12px"/>`);
      container.innerHTML = result;
      result = result.replaceAll("{W}", `<img src="./../../../assets/images/common/willpower.png" width="12px"/>`);
      container.innerHTML = result;
      result = result.replaceAll("{I}", `<img src="./../../../assets/images/common/cost.png" width="12px"/>`);
      container.innerHTML = result;
      result = result.replaceAll("{E}", `<img src="./../../../assets/images/common/exert.png" width="13px"/>`);
      container.innerHTML = result;
    }
  }

  exportData() {
    this.exportService.exportToExcel(this.cards);
  }

  updateMyTotalCards(myCards: NumberOfCards) {
    myCards.total = myCards.normal + myCards.foil;
  }
}
