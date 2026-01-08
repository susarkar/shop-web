
export interface PurchaseDto {
    id?: string; // e.g. GUID
    supplierId: string;
    supplierName?: string;
    date: string; // ISO datetime string
    totalAmount: number;
    taxAmount: number;
    status?: string;
}

export interface PurchaseItemDto {
    id?: string; // e.g. GUID
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
    taxRate: number;
}

export interface PurchaseDtoRequest {
    purchaseDto: PurchaseDto;
    purchaseItemDtoList: PurchaseItemDto[];
}
