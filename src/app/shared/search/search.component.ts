import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() filterChange = new EventEmitter<string>();

  private _filter: string;
  get filter() {
    return this._filter;
  }
  set filter(value: string) {
    this._filter = value;
    this.filterChange.emit(value);
  }
  constructor() { }

  ngOnInit(): void { }

  clearFilter() {
    this.filter = '';
  }
}
