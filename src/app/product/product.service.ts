import { environment } from './../../environments/environment';
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

  get products() {
    return this.productSignal;
  }

  getProducts() {
    this.http.get<Product[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(products => this.productSignal.set(products));
  }
  getProduct(productId: any) {
    this.http.get<Product>(`${this.API_URL}/${this.END_POINT}/${productId}`).subscribe(product => {
      const products = this.productSignal();
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = product;
        this.productSignal.set(products);
      }
    });
  }
  addProduct(data: any) {
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getProducts());
  }
  updateProduct(id: any, data: any) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/${id}`, data).subscribe(() => this.getProducts());
  }
  deleteProduct(productId: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${productId}`).subscribe(() => this.getProducts());
  }
  searchProduct(searchCriteria: any) {
    this.http.get<Product[]>(`${this.API_URL}/${this.END_POINT}/search/${searchCriteria}`).subscribe(products => this.productSignal.set(products));
  }



}
