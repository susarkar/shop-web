import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from './category.model';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);
  API_URL = environment.apiUrl;
  END_POINT = "categories";
  categorySignal = signal<Category[]>([]);
  get Categories() {
    return this.categorySignal;
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.API_URL}/${this.END_POINT}`).subscribe((data) => {
      this.categorySignal.set(data);
    });
  }
  addCategory(data: any) {
    return this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getCategories());
  }
  editCategory(data: any) {
    return this.http.put(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getCategories());
  }
  deleteCategory(categoryId: any) {
    return this.http.delete(`${this.API_URL}/${this.END_POINT}/${categoryId}`).subscribe(() => this.getCategories());
  }
  getCategory(categoryId: any) {
    return this.http.get<Category>(`${this.API_URL}/${this.END_POINT}/${categoryId}`);
  }
  searchCategory(searchCriteria: any) {
    return this.http.get<Category[]>(`${this.API_URL}/${this.END_POINT}/${searchCriteria}`);
  }
  // getCategoryByName(name: string) {



  constructor() { }
}
