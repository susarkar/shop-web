import { environment } from './../../environments/environment';
import { inject, Injectable, signal } from '@angular/core';
import { GlType } from './gl-type.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlTypeService {
  constructor() { }

  API_URL = environment.apiUrl;
  END_POINT = 'gltypes';
  http = inject(HttpClient);

  private glTypeSignal = signal<GlType[]>([]);

  get glTypes() {
    return this.glTypeSignal;
  }

  getGlTypes() {
    this.http.get<GlType[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(glTypes => this.glTypeSignal.set(glTypes));
  }

  getGlType(id: any) {
    this.http.get<GlType>(`${this.API_URL}/${this.END_POINT}/${id}`).subscribe(glType => {
      const arr = this.glTypeSignal();
      const index = arr.findIndex(a => a.id === id);
      if (index !== -1) {
        arr[index] = glType;
        this.glTypeSignal.set(arr);
      }
    });
  }

  addGlType(data: any) {
    this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getGlTypes());
  }

  updateGlType(id: any, data: any) {
    this.http.put(`${this.API_URL}/${this.END_POINT}/${id}`, data).subscribe(() => this.getGlTypes());
  }

  deleteGlType(id: any) {
    this.http.delete(`${this.API_URL}/${this.END_POINT}/${id}`).subscribe(() => this.getGlTypes());
  }

  searchGlType(criteria: any) {
    this.http.get<GlType[]>(`${this.API_URL}/${this.END_POINT}/search/${criteria}`).subscribe(glTypes => this.glTypeSignal.set(glTypes));
  }

}
