import { PurchaseService } from './../purchase.service';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SupplierService } from '../../supplier/supplier.service';
import { Supplier } from '../../supplier/supplier.model';
import { Observable } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductService } from '../../product/product.service';
import { Product } from '../../product/product.model';
import { PurchaseDto, PurchaseDtoRequest, PurchaseItemDto } from '../purchase.model';

@Component({
  selector: 'app-purchase-add-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatDialogClose,
    MatIconModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
  templateUrl: './purchase-add-edit.component.html',
  styleUrls: ['./purchase-add-edit.component.scss'],

})
export class PurchaseAddEditComponent implements OnInit {

  supplierTerm = signal('');
  productTerm = signal('');

  today = new Date();

  private fb = inject(FormBuilder);
  purchaseForm: FormGroup = this.fb.group({
    supplier: [null as Supplier | string | null, Validators.required],
    date: [this.today, Validators.required],
    totalAmount: [{ value: '0', disabled: true }, Validators.required],
    taxAmount: [{ value: '0', disabled: true }, Validators.required],
    status: ['', Validators.required],
    items: this.fb.array([], [Validators.required, Validators.minLength(1)])
  });

  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }
  purchaseService = inject(PurchaseService);

  purchaseItems = this.purchaseService.purchaseItems;

  supplierService = inject(SupplierService);
  suppliers = this.supplierService.suppliers;


  productService = inject(ProductService);
  products = this.productService.products;

  itemTotals = signal<number[]>([]);

  readonly dialogRef = inject(MatDialogRef<PurchaseAddEditComponent>);
  readonly data = inject<PurchaseDto | null>(MAT_DIALOG_DATA);

  orderTotal = computed(() =>
    this.itemTotals().reduce((sum, total) => sum + total, 0)
  );

  displayFn(supplier: Supplier): string {
    const obj: any = supplier as any;
    return obj && (obj.name || obj.productName) ? (obj.name || obj.productName) : '';
  }

  supplierFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supplierTerm.set(filterValue);
    if (!filterValue || filterValue.trim() === '') {
      this.supplierService.getSuppliers();
    } else {
      this.supplierService.searchSupplier(filterValue);
    }
  }
  productFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!filterValue || filterValue.trim() === '') {
      this.productService.getProducts();
    } else {
      this.productService.searchProduct(filterValue);
    }
  }

  constructor() {
    // this.data = inject<Purchase>(MAT_DIALOG_DATA);
    this.supplierService.getSuppliers();
    this.productService.getProducts();
    if (this.data) {
      console.log('Editing purchase, loading items for purchase ID:', this.data.id);
      // Do NOT call getPurchase() here as it replaces the entire purchases list with just this one purchase
      // Instead, rely on data parameter passed via dialog and fetch items separately
      this.purchaseService.getItems(this.data?.id);
    }

    // When suppliers become available, set the supplier control for edit mode
    effect(() => {
      if (!this.data) return;
      const sups = this.suppliers();
      if (!sups || sups.length === 0) return;
      const found = sups.find((s: any) => String(s.id) === String(this.data?.supplierId) || s.id === this.data?.supplierId);
      if (found) {
        this.purchaseForm.get('supplier')?.setValue(found, { emitEvent: false });
      }
    });

    // If the service returned an updated purchase record, patch the form values
    effect(() => {
      if (!this.data) return;
      const purchases = this.purchaseService.purchases();
      if (!purchases || purchases.length === 0) return;
      const p = purchases.find(pr => String(pr.id) === String(this.data?.id)) || purchases[0];
      if (p) {
        this.purchaseForm.patchValue({
          date: p.date ? new Date(p.date) : this.today,
          status: p.status,
          totalAmount: p.totalAmount,
          taxAmount: p.taxAmount
        });
      }
    });

    // When editing, populate items from the service when they arrive
    effect(() => {
      if (!this.data) return;
      const pitems = this.purchaseItems();
      if (!pitems || pitems.length === 0) return;
      // clear existing items
      while (this.items.length) {
        this.items.removeAt(0);
      }
      pitems.forEach(pi => {
        // try to resolve full product object from products signal
        const prod = this.products() ? this.products().find((p: any) => p.id === pi.productId) : pi.productId;
        this.addItem({ product: prod || pi.productId, quantity: pi.quantity, price: pi.price, taxRate: pi.taxRate, itemTotal: (pi.quantity * pi.price) });
      });
    });

  }

  ngOnInit(): void {
    if (this.data) {
      // Pre-fill supplier control with minimal object (full object will be set when suppliers load)
      this.purchaseForm.patchValue({
        supplier: this.data.supplierId != null ? { id: this.data.supplierId, name: this.data.supplierName || '' } : null,
        date: this.data.date ? new Date(this.data.date) : this.today,
        status: this.data.status,
        totalAmount: this.data.totalAmount,
        taxAmount: this.data.taxAmount
      });
      // Items will be populated from the PurchaseService.getItems effect above

      // Make all controls except 'status' readonly
      Object.keys(this.purchaseForm.controls).forEach(key => {
        if (key !== 'status') {
          this.purchaseForm.get(key)?.disable({ emitEvent: false });
        }
      });
      // For items FormArray, disable all controls inside each group except 'status' (if present)
      this.items.controls.forEach(group => {
        Object.keys((group as FormGroup).controls).forEach(ctrlKey => {
          (group as FormGroup).get(ctrlKey)?.disable({ emitEvent: false });
        });
      });
    }
  }

  addItem(item?: any) {
    const group = this.fb.group({
      product: [item?.product || null, Validators.required],
      quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      price: [item?.price ?? 0, [Validators.required, Validators.min(0)]],
      taxRate: [item?.taxRate ?? 0, [Validators.required]],
      itemTotal: [{ value: item?.itemTotal ?? 0, disabled: true }, Validators.required]
    });
    if (this.data && item) {
      // If editing, recalculate item total immediately
      this.recalculateItemTotal(group);
      this.items.push(group);
      // If editing an existing purchase, make the item controls readonly (match overall form behavior)
      Object.keys((group as FormGroup).controls).forEach(ctrlKey => {
        (group as FormGroup).get(ctrlKey)?.disable({ emitEvent: false });
      });
      this.recalculateTotalAmount();
    } else {
      // Set up value change subscriptions once
      group.get('quantity')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
      group.get('price')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
      group.get('taxRate')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));

      this.items.push(group);
      this.recalculateTotalAmount();
    }
  }
  removeItem(index: number) {
    this.items.removeAt(index);
    this.recalculateTotalAmount();
  }

  recalculateItemTotal(group: FormGroup) {
    const quantity = group.get('quantity')!.value || 0;
    const price = group.get('price')!.value || 0;
    const total = quantity * price;
    group.get('itemTotal')!.setValue(total, { emitEvent: false });
    this.recalculateTotalAmount();
  }
  recalculateTotalAmount() {
    const total = this.items.controls.reduce((sum, item) => {
      const value = item.get('itemTotal')!.value;
      return sum + (typeof value === 'number' ? value : parseFloat(value) || 0);
    }, 0);
    this.purchaseForm.get('totalAmount')!.setValue(total, { emitEvent: false });
  }

  updateItemTotal(index: number) {
    const item = this.items.at(index);
    item.get('quantity')?.valueChanges.subscribe(() => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const taxRate = item.get('taxRate')?.value || 0;
      const total = quantity * price;
      item.get('itemTotal')?.setValue(total, { emitEvent: false });
    });
    item.get('price')?.valueChanges.subscribe(() => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const taxRate = item.get('taxRate')?.value || 0;
      const total = quantity * price;
      item.get('itemTotal')?.setValue(total, { emitEvent: false });
    });

    const totalAmount = this.items.controls.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.get('itemTotal')?.value || 0);
    }, 0);

    this.purchaseForm.get('totalAmount')?.setValue(totalAmount.toString(), { emitEvent: false });

  }
  onSubmit() {
    const formValue = this.purchaseForm.getRawValue();

    // Extract supplierId and supplierName
    let supplierId: number = 0;
    let supplierName: string | undefined;
    if (typeof formValue.supplier === 'object' && formValue.supplier) {

      supplierId = formValue.supplier.id || 0;
      supplierName = formValue.supplier.name;
    } else if (typeof formValue.supplier === 'string') {
      supplierId = Number(formValue.supplier) || 0;
      supplierName = '';
    }
    console.log('formValue.supplierviD:', formValue.supplier.id);
    // Map items to PurchaseItem[] (productId, quantity, price, taxRate)
    const itemsPayload: PurchaseItemDto[] = (formValue.items as any[]).map(item => {
      const productId = (typeof item.product === 'object' && item.product) ? item.product.id : item.product;
      return {
        productId,
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        taxRate: Number(item.taxRate) || 0
      } as PurchaseItemDto;
    });

    // Build the purchase object according to the model
    const purchasePayload: PurchaseDto = {
      supplierId: String(supplierId),
      date: formValue.date ?? new Date(),
      totalAmount: Number(formValue.totalAmount) || 0,
      taxAmount: Number(formValue.taxAmount) || 0,
      status: formValue.status || ''
    };

    const payload: PurchaseDtoRequest = {
      purchaseDto: purchasePayload,
      purchaseItemDtoList: itemsPayload
    };

    // call service with strongly-typed CreatePurchaseRequest
    this.purchaseService.addPurchase(payload as PurchaseDtoRequest);
    this.dialogRef.close(true);

  }
}

