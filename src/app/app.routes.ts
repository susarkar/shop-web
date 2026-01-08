import { CategoryListComponent } from './category/category-list/category-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { appConfig } from './app.config';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { SaleListComponent } from './sale/sale-list/sale-list.component';



export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'category-list', component: CategoryListComponent },
    { path: 'product-list', component: ProductListComponent },
    // { path: 'category-list', component: CategoryListComponent },
    { path: 'supplier-list', component: SupplierListComponent },
    { path: 'purchase-list', component: PurchaseListComponent },
    { path: 'sale-list', component: SaleListComponent },
    { path: 'customer-list', component: CustomerListComponent },
    { path: '**', redirectTo: 'home' }
]