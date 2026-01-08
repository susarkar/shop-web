import { environment } from './../../environments/environment';
import { inject, Injectable, signal } from '@angular/core';
import { Unit } from './unit.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UnitService {
    constructor() { }

    API_URL = environment.apiUrl;
    END_POINT = 'units';
    http = inject(HttpClient);

    private unitSignal = signal<Unit[]>([]);

    get units() {
        return this.unitSignal;
    }

    getUnits() {
        this.http.get<Unit[]>(`${this.API_URL}/${this.END_POINT}`).subscribe(units => this.unitSignal.set(units));
    }

    getUnit(unitCode: any) {
        this.http.get<Unit>(`${this.API_URL}/${this.END_POINT}/${unitCode}`).subscribe(unit => {
            const units = this.unitSignal();
            const index = units.findIndex(u => u.code === unitCode);
            if (index !== -1) {
                units[index] = unit;
                this.unitSignal.set(units);
            }
        });
    }

    addUnit(data: any) {
        this.http.post(`${this.API_URL}/${this.END_POINT}`, data).subscribe(() => this.getUnits());
    }

    updateUnit(id: any, data: any) {
        this.http.put(`${this.API_URL}/${this.END_POINT}/${id}`, data).subscribe(() => this.getUnits());
    }

    deleteUnit(unitId: any) {
        this.http.delete(`${this.API_URL}/${this.END_POINT}/${unitId}`).subscribe(() => this.getUnits());
    }

    searchUnit(searchCriteria: any) {
        this.http.get<Unit[]>(`${this.API_URL}/${this.END_POINT}/search/${searchCriteria}`).subscribe(units => this.unitSignal.set(units));
    }

}
