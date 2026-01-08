
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { SaleDto, SaleItemDto } from './sale.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SaleService {
  API_URL = environment.apiUrl; // Replace with your actual API URL
  END_POINT = 'sale-invoices';
  http = inject(HttpClient);
  private saleSignal = signal<SaleDto[]>([]); // Initialize the signal with an empty array  
  private saleItemSignal = signal<SaleItemDto[]>([]);
  get sales() {
    return this.saleSignal;
  }
  get saleItems() {
    return this.saleItemSignal;
  }
  getSales() {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(data => this.saleSignal.set(data));
  }
  getSale(saleId: any) {
    this.http.get<SaleDto>(`${this.API_URL}/${this.END_POINT}/${saleId}`).subscribe(data => this.saleSignal.set([data]));
  }
  deleteSale(saleId: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${saleId}`).subscribe(() => this.getSales());
  }
  searchSale(searchCriteria: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/${searchCriteria}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByCustomer(customerId: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/customer/${customerId}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByProduct(productId: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/product/${productId}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByDate(date: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/date/${date}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByDateRange(startDate: any, endDate: any) {

    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/date/${startDate}/${endDate}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByCustomerAndDate(customerId: any, date: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/customer/${customerId}/date/${date}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByCustomerAndDateRange(customerId: any, startDate: any, endDate: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/customer/${customerId}/date/${startDate}/${endDate}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByProductAndDate(productId: any, date: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/product/${productId}/date/${date}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByProductAndDateRange(productId: any, startDate: any, endDate: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/product/${productId}/date/${startDate}/${endDate}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByCustomerAndProduct(customerId: any, productId: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/customer/${customerId}/product/${productId}`).subscribe(data => this.saleSignal.set(data));
  }
  getSaleByCustomerAndProductAndDate(customerId: any, productId: any, date: any) {
    this.http.get<SaleDto[]>(`${this.API_URL}/${this.END_POINT}/customer/${customerId}/product/${productId}/date/${date}`).subscribe(data => this.saleSignal.set(data));
  }

  addSale(data: SaleDto) {
    console.log('adding sale', data);
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getSales());
  }
  updateSale(saleId: string, data: SaleDto) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/${saleId}`, data).subscribe(() => this.getSales());
  }

  /**
   * Return an Observable for sale items for a given sale id.
   * Endpoint: GET /sales/sale-items/{saleId}
   */
  getSaleItems(saleId: any): Observable<SaleItemDto[]> {
    return this.http.get<SaleItemDto[]>(`${this.API_URL}/${this.END_POINT}/${saleId}/items`);
  }

  /**
   * Fetch and store sale items in a signal for components to consume.
   */
  getItems(saleId: any) {
    this.http.get<SaleItemDto[]>(`${this.API_URL}/${this.END_POINT}/${saleId}/items`).subscribe(data => {
      this.saleItemSignal.set(data || []);
    });
  }

  constructor() { }
}
