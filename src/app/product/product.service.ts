import { environment } from './../../environments/environment.development';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() { }

  API_URL = environment.apiUrl;
  END_POINT = "products";
  http = inject(HttpClient);
  productSignal = signal<Product[]>([]);

  get Products() {
    return this.productSignal;
  }
  getProducts() {
    return this.http.get<Product[]>(`${this.API_URL}/${this.END_POINT}`).subscribe((data) => {
      this.productSignal.set(data);
    });
  }
  addProduct(data: any) {
    return this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getProducts());
  }

  editProduct(data: any) {
    return this.http.put(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getProducts());
  }
  deleteProduct(productId: any) {
    return this.http.delete(`${this.API_URL}/${this.END_POINT}/${productId}`).subscribe(() => this.getProducts());
  }
  getProduct(productId: any) {
    return this.http.get<Product>(`${this.API_URL}/${this.END_POINT}/${productId}`);
  }
  searchProduct(searchCriteria: any) {
    return this.http.get<Product[]>(`${this.API_URL}/${this.END_POINT}/${searchCriteria}`);
  }

}
