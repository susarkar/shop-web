export interface Product {
    id: number;
    name: string;
    sku: string;
    purchasePrice: number;
    salePrice: number;
    stockQuantity: number;
    taxRate: number;
    barcode: string;
    categoryId: number;
}