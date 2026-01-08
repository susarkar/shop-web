import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { single } from 'rxjs';
import { Supplier } from './supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  getSupplierById(supplierId: number) {
    this.http.get<Supplier>(`${this.API_URL}/${this.END_POINT}/${supplierId}`).subscribe(supplier => this.supplierSignal.set([supplier]));

  }

  API_URL = environment.apiUrl;
  END_POINT = "suppliers";
  http = inject(HttpClient);

  private supplierSignal = signal<Supplier[]>([]);

  get suppliers() {
    return this.supplierSignal;
  }

  constructor() { }

  getSuppliers() {
    this.http.get<Supplier[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(suppliers => this.supplierSignal.set(suppliers));
  }
  getSupplier(supplierId: any) {
    this.http.get<Supplier>(`${this.API_URL}/${this.END_POINT}/${supplierId}`).subscribe(supplier => this.supplierSignal.set([supplier]));
  }
  addSupplier(data: any) {
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getSuppliers());
  }
  updateSupplier(id: any, data: any) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/${id}`, data).subscribe(() => this.getSuppliers());
  }
  deleteSupplier(supplierId: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${supplierId}`).subscribe(() => this.getSuppliers());
  }
  searchSupplier(searchCriteria: any) {
    this.http.get<Supplier[]>(`${this.API_URL}/${this.END_POINT}/search/${searchCriteria}`).subscribe(suppliers => this.supplierSignal.set(suppliers));
  }

}
