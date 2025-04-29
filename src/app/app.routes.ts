import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'product-list', component: ProductListComponent },

    { path: '**', redirectTo: 'home' }
]