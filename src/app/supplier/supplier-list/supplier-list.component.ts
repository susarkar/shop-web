import { ChangeDetectionStrategy, Component, effect, inject, ViewChild } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model'; // Adjust the path as needed
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupplierAddEditComponent } from '../supplier-add-edit/supplier-add-edit.component'; // Adjust the path as needed
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supplier-list',
  imports: [MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierListComponent {

  supplierService = inject(SupplierService);
  suppliers = this.supplierService.suppliers;
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Supplier>();
  totalRecords: number = 0;
  pageSize: number = 10;
  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.supplierService.getSuppliers();
    effect(() => {
      const suppliers = this.suppliers();
      this.dataSource.data = suppliers;
      this.totalRecords = suppliers.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddSupplier() {
    const dialogRef = this.dialog.open(SupplierAddEditComponent, {
      width: '400px',
    });
  }
  openEditSupplier(data: any) {
    const dialogRef = this.dialog.open(SupplierAddEditComponent, {
      data: data // Pass any data you need to the dialog
    });
  }
  deleteSupplier(id: any) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id);
      //      this.snackBar.open('Supplier deleted successfully')
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
