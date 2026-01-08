import { Component, effect, inject, ViewChild } from '@angular/core';
import { CustomerService } from '../customer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../customer.model';
import { CustomerAddEditComponent } from '../customer-add-edit/customer-add-edit.component';

@Component({
  selector: 'app-customer-list',
  imports: [MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],

  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {
  customerService = inject(CustomerService);

  customers: Customer[] = this.customerService.customers();

  displayedColumns: string[] = ['name', 'email', 'phone', 'gstin', 'actions'];
  dataSource = new MatTableDataSource<Customer>(this.customers);
  totalRecords: number = 0;
  pageSize: number = 10;
  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.customerService.getCustomers();
    effect(() => {
      const customers = this.customerService.customers();
      this.dataSource.data = customers;
      this.totalRecords = customers.length;

      //  this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
  }

  openAddCustomer() {
    const dialogRef = this.dialog.open(CustomerAddEditComponent, {
      width: '900px',
      maxHeight: '90vh',
    });
  }
  openEditCustomer(data: any) {
    const dialogRef = this.dialog.open(CustomerAddEditComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: data // Pass any data you need to the dialog
    });
  }
  deleteCustomer(id: any) {
    if (confirm('Are you sure you want to delete this Customer?')) {
      this.customerService.deleteCustomer(id);
      this.snackBar.open('Customer deleted successfully', undefined, { duration: 3000 });
    }
  }
  onPageChange($event: PageEvent) {
    this.pageSize = $event.pageSize;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageIndex = $event.pageIndex;
    this.dataSource.paginator.pageSize = $event.pageSize;
    this.dataSource.paginator.length = this.totalRecords;

  }

}
