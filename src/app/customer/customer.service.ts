import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  API_URL = environment.apiUrl;
  END_POINT = "customers";
  http = inject(HttpClient);
  private customerSignal = signal<Customer[]>([]);
  get customers() {
    return this.customerSignal;
  }
  getCustomers() {
    this.http.get<Customer[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(customers => this.customerSignal.set(customers));
  }
  getCustomer(customerId: any) {
    this.http.get<Customer>(`${this.API_URL}/${this.END_POINT}/${customerId}`).subscribe(customer => this.customerSignal.set([customer]));
  }
  addCustomer(data: any) {
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getCustomers());
  }
  updateCustomer(id: any, data: any) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/${id}`, data).subscribe(() => this.getCustomers());
  }
  deleteCustomer(customerId: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${customerId}`).subscribe(() => this.getCustomers());
  }
  searchCustomer(searchCriteria: any) {
    this.http.get<Customer[]>(`${this.API_URL}/${this.END_POINT}/${searchCriteria}`).subscribe(customers => this.customerSignal.set(customers));
  }


  constructor() { }
}
