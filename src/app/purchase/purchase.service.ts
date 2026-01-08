import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PurchaseDto, PurchaseDtoRequest, PurchaseItemDto } from './purchase.model';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  API_URL = environment.apiUrl; // Replace with your actual API URL
  END_POINT = 'purchases';
  http = inject(HttpClient);
  private purchaseSignal = signal<PurchaseDto[]>([]); // Initialize the signal with an empty array
  private purchaseItemSignal = signal<PurchaseItemDto[]>([]); // Initialize the signal with an empty array for purchase items

  get purchases() {
    return this.purchaseSignal;
  }
  getPurchases() {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchase(purchaseId: any) {
    this.http.get<PurchaseDto>(`${this.API_URL}/${this.END_POINT}/${purchaseId}`).subscribe(data => this.purchaseSignal.set([data]));
  }
  addPurchase(data: PurchaseDtoRequest) {
    // payload: { purchase: Purchase, items: PurchaseItem[] }
    console.log('data', data);
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getPurchases());
  }
  updatePurchase(purchasseId: number, data: any) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/{purchasseId}`, data).subscribe(() => this.getPurchases());
  }
  deletePurchase(purchaseId: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${purchaseId}`).subscribe(() => this.getPurchases());
  }
  searchPurchase(searchCriteria: any) {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}/${searchCriteria}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchaseBySupplier(supplierId: any) {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}/supplier/${supplierId}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchaseByProduct(productId: any) {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}/product/${productId}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchaseByDate(date: any) {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}/date/${date}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchaseByDateRange(startDate: any, endDate: any) {
    this.http.get<PurchaseDto[]>(`${this.API_URL}/${this.END_POINT}/date/${startDate}/${endDate}`).subscribe(data => this.purchaseSignal.set(data));
  }
  getPurchaseItems(purchaseId: any): Observable<any[]> {
    // ...implementation that returns an Observable, e.g.:
    return this.http.get<any[]>(`${this.API_URL}/${this.END_POINT}/${purchaseId}/items`);
  }
  getItems(purchaseId: any) {
    this.http.get<PurchaseItemDto[]>(`${this.API_URL}/${this.END_POINT}/${purchaseId}/items`).subscribe(data => {

      this.purchaseItemSignal.set(data);
    });
  }
  get purchaseItems() {
    return this.purchaseItemSignal;
  }
}