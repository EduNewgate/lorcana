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

import { CardResponse, Ink, Rarity, SetDetail } from './../../models/common.model';

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

  layout: "list" | "grid" = 'grid';

  inks: Ink[] | undefined;
  rarities: Rarity[] | undefined;
  sets: SetDetail[] | undefined;

  lastSet: SetDetail | undefined;

  formGroup!: FormGroup;

  cards!: CardResponse[];

  normal: number | undefined;
  foil: number | undefined;

  constructor(private commonService: CommonService) { }

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
      this.commonService.getFilteredCards(this.formGroup.value).subscribe((res: { results: CardResponse[] }) => {
        this.cards = res.results;
        this.sortCardsBySetAndNumber(this.cards);
      })
    });
  }

  searchCards() {
    this.commonService.getFilteredCards(this.formGroup.value).subscribe((res: { results: CardResponse[] }) => {
      this.cards = res.results;
      this.sortCardsBySetAndNumber(this.cards);
    })
  }

  sortCardsBySetAndNumber(cards: CardResponse[]) {
    cards.sort((a: CardResponse, b: CardResponse) =>
      a.set.code.padStart(3, '0').localeCompare(b.set.code.padStart(3, '0')) || a.collector_number.padStart(3, '0').localeCompare(b.collector_number.padStart(3, '0'))
    );
  }
}
