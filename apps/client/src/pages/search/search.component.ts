import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SearchService } from './search.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './search.component.html',
})
export class SearchResultsComponent implements OnInit {
  searchQuery = 'northern'; // Current search input
  currentPage = 1; // Current page number
  totalPages = 0; // Total number of pages
  limit = 3; // Items per page

  private searchQuery$ = new BehaviorSubject<string>(this.searchQuery);
  searchResults$: Observable<{ data: any[]; totalPages: number }>;

  constructor(private searchService: SearchService) {
    // Debounce the search input to avoid excessive API calls
    this.searchResults$ = this.searchQuery$.pipe(
      debounceTime(400),
      switchMap((query) =>
        this.searchService.search({
          keyword: query,
          page: this.currentPage,
          limit: this.limit,
        })
      )
    );
  }

  ngOnInit(): void {
    this.onSearch(); // Trigger initial search
    this.searchResults$.subscribe(
      (res) => (this.totalPages = Math.ceil(res.totalPages / this.limit))
    );
  }

  onSearch(): void {
    this.searchQuery$.next(this.searchQuery);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onSearch();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onSearch();
    }
  }
}
