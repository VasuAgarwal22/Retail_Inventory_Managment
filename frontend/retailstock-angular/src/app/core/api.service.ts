import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface RegisterPayload { firstName: string; lastName: string; email: string; phoneNo: string; password: string; }
export interface LoginResponse { token: string; }
export interface User { id?: number; firstName: string; lastName: string; email: string; phoneNo?: string; roles?: string[]; active?: boolean; }
export interface UserUpdateRequest { newPassword: string; }

// ── Category ──────────────────────────────────────────────────────────────────
export interface CategoryRequest { name: string; description: string; }
export interface CategoryResponse { id: number; name: string; description: string; active: boolean; }

// ── Product ───────────────────────────────────────────────────────────────────
export interface ProductRequest { sku: string; name: string; description: string; basePrice: number; categoryId: number; brandId?: number; }
export interface ProductResponse { id: number; sku: string; name: string; description: string; basePrice: number; categoryId?: number; active: boolean; }

// ── ProductVariant ────────────────────────────────────────────────────────────
export interface ProductVariantRequest { sku: string; name: string; description: string; price: number; productId: number; }
export interface ProductVariantResponse { id: number; sku: string; name: string; description: string; price: number; active: boolean; }

// ── Warehouse ─────────────────────────────────────────────────────────────────
export interface Address { street: string; city: string; state: string; postalCode: string; country: string; }
export interface WarehouseRequest { code: string; name: string; type: string; address: Address; }
export interface WarehouseResponse { id: number; code: string; name: string; type: string; address?: Address; active: boolean; }

// ── Supplier ──────────────────────────────────────────────────────────────────
export interface SupplierRequest { code: string; name: string; email: string; phoneNo: string; paymentTerms: string; leadTimeDays: number; rating: number; }
export interface SupplierResponse { id: number; code: string; name: string; email: string; phoneNo: string; paymentTerms: string; leadTimeDays: number; rating: number; }

// ── SupplierProduct ───────────────────────────────────────────────────────────
export interface SupplierProductRequest { supplierId: number; productId: number; unitCost: number; moq: number; }
export interface SupplierProductResponse { id: number; supplierId?: number; productId?: number; unitCost: number; moq: number; }

// ── Inventory ─────────────────────────────────────────────────────────────────
export interface InventoryRequest { productId: number; warehouseId: number; quantityOnHand: number; quantityReserved: number; quantityIncoming: number; }
export interface InventoryResponse { id: number; productId?: number; warehouseId?: number; quantityOnHand: number; quantityReserved: number; quantityIncoming: number; }

// ── StockMovement ─────────────────────────────────────────────────────────────
export const MOVEMENT_TYPES = ['INBOUND', 'OUTBOUND', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'RETURN', 'DAMAGE', 'COUNT_CORRECTION'] as const;
export type MovementType = typeof MOVEMENT_TYPES[number];
export interface StockMovementRequest { productId: number; warehouseId: number; movementType: MovementType; quantity: number; referenceType: string; referenceId: number; reason: string; performedBy: number; }
export interface StockMovementResponse { id: number; productId?: number; warehouseId?: number; movementType: string; quantity: number; reason: string; createdAt?: string; }

/** Error carrying the HTTP status */
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private headers(token?: string | null): HttpHeaders {
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  private handle<T>(obs: Observable<string>): Observable<T> {
    return obs.pipe(
      map(text => { try { return JSON.parse(text) as T; } catch { return text as unknown as T; } }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 0) return throwError(() => new ApiError('Cannot reach server. Is backend running on port 8080?', 0));
        let msg = 'Something went wrong. Please try again.';
        if (err.status === 401 || err.status === 403) msg = 'Unauthorized.';
        try { const d = JSON.parse(err.error); if (d?.message) msg = d.message; } catch { }
        return throwError(() => new ApiError(msg, err.status));
      }),
    );
  }

  get<T>(path: string, token?: string | null): Observable<T> {
    return this.handle<T>(this.http.get(`${environment.apiUrl}${path}`, { headers: this.headers(token), responseType: 'text' }));
  }
  post<T>(path: string, body: unknown, token?: string | null): Observable<T> {
    return this.handle<T>(this.http.post(`${environment.apiUrl}${path}`, body, { headers: this.headers(token), responseType: 'text' }));
  }
  put<T>(path: string, body: unknown, token?: string | null): Observable<T> {
    return this.handle<T>(this.http.put(`${environment.apiUrl}${path}`, body, { headers: this.headers(token), responseType: 'text' }));
  }
  patch<T>(path: string, body: unknown, token?: string | null): Observable<T> {
    return this.handle<T>(this.http.patch(`${environment.apiUrl}${path}`, body, { headers: this.headers(token), responseType: 'text' }));
  }
  delete<T>(path: string, token?: string | null): Observable<T> {
    return this.handle<T>(this.http.delete(`${environment.apiUrl}${path}`, { headers: this.headers(token), responseType: 'text' }));
  }

  // ── Auth ──────────────────────────────────────────────────────────────────────
  login(email: string, password: string) { return this.post<LoginResponse>('/api/auth/login', { email, password }); }
  register(payload: RegisterPayload) { return this.post<string>('/api/auth/register', payload); }
  getAllUsers(token: string) { return this.get<User[]>('/api/auth/all', token); }
  getUserById(token: string, id: number) { return this.get<User>(`/api/auth/${id}`, token); }
  updatePassword(token: string, id: number, r: UserUpdateRequest) { return this.put<string>(`/api/auth/update/${id}`, r, token); }
  deactivateUser(token: string, id: number) { return this.put<string>(`/api/auth/deactivate/${id}`, {}, token); }

  // ── Category ──────────────────────────────────────────────────────────────────
  createCategory(token: string, r: CategoryRequest) { return this.post<CategoryResponse>('/api/categories', r, token); }
  getAllCategories(token: string) { return this.get<CategoryResponse[]>('/api/categories', token); }
  getCategoryById(token: string, id: number) { return this.get<CategoryResponse>(`/api/categories/${id}`, token); }
  updateCategory(token: string, id: number, r: CategoryRequest) { return this.put<CategoryResponse>(`/api/categories/${id}`, r, token); }
  deactivateCategory(token: string, id: number) { return this.patch<string>(`/api/categories/${id}/deactivate`, {}, token); }

  // ── Product ───────────────────────────────────────────────────────────────────
  createProduct(token: string, r: ProductRequest) { return this.post<ProductResponse>('/api/auth/create_Product', r, token); }
  getAllProducts(token: string) { return this.get<ProductResponse[]>('/api/auth/getAll', token); }
  getProductById(token: string, id: number) { return this.get<ProductResponse>(`/api/auth/get/${id}`, token); }
  updateProduct(token: string, id: number, r: ProductRequest) { return this.put<ProductResponse>(`/api/auth/updateProduct/${id}`, r, token); }
  deactivateProduct(token: string, id: number) { return this.patch<string>(`/api/auth/${id}/deactivate_pro`, {}, token); }

  // ── ProductVariant ────────────────────────────────────────────────────────────
  createVariant(token: string, r: ProductVariantRequest) { return this.post<ProductVariantResponse>('/api/product-variants', r, token); }
  getAllVariants(token: string) { return this.get<ProductVariantResponse[]>('/api/product-variants', token); }
  getVariantById(token: string, id: number) { return this.get<ProductVariantResponse>(`/api/product-variants/${id}`, token); }
  getVariantsByProduct(token: string, productId: number) { return this.get<ProductVariantResponse[]>(`/api/product-variants/product/${productId}`, token); }
  updateVariant(token: string, id: number, r: ProductVariantRequest) { return this.put<ProductVariantResponse>(`/api/product-variants/${id}`, r, token); }
  deactivateVariant(token: string, id: number) { return this.patch<string>(`/api/product-variants/${id}/deactivateVariant`, {}, token); }

  // ── Warehouse ─────────────────────────────────────────────────────────────────
  createWarehouse(token: string, r: WarehouseRequest) { return this.post<WarehouseResponse>('/api/warehouses', r, token); }
  getAllWarehouses(token: string) { return this.get<WarehouseResponse[]>('/api/warehouses', token); }
  getWarehouseById(token: string, id: number) { return this.get<WarehouseResponse>(`/api/warehouses/${id}`, token); }
  updateWarehouse(token: string, id: number, r: WarehouseRequest) { return this.put<WarehouseResponse>(`/api/warehouses/${id}`, r, token); }
  deactivateWarehouse(token: string, id: number) { return this.patch<string>(`/api/warehouses/${id}/deactivate`, {}, token); }

  // ── Supplier ──────────────────────────────────────────────────────────────────
  createSupplier(token: string, r: SupplierRequest) { return this.post<SupplierResponse>('/api/suppliers', r, token); }
  getAllSuppliers(token: string) { return this.get<SupplierResponse[]>('/api/suppliers', token); }
  getSupplierById(token: string, id: number) { return this.get<SupplierResponse>(`/api/suppliers/${id}`, token); }
  updateSupplier(token: string, id: number, r: SupplierRequest) { return this.put<SupplierResponse>(`/api/suppliers/${id}`, r, token); }
  deleteSupplier(token: string, id: number) { return this.delete<string>(`/api/suppliers/${id}`, token); }

  // ── SupplierProduct ───────────────────────────────────────────────────────────
  createSupplierProduct(token: string, r: SupplierProductRequest) { return this.post<SupplierProductResponse>('/api/supplier-products', r, token); }
  getAllSupplierProducts(token: string) { return this.get<SupplierProductResponse[]>('/api/supplier-products', token); }
  getSupplierProductById(token: string, id: number) { return this.get<SupplierProductResponse>(`/api/supplier-products/${id}`, token); }
  updateSupplierProduct(token: string, id: number, r: SupplierProductRequest) { return this.put<SupplierProductResponse>(`/api/supplier-products/${id}`, r, token); }
  deleteSupplierProduct(token: string, id: number) { return this.delete<string>(`/api/supplier-products/${id}`, token); }

  // ── Inventory ─────────────────────────────────────────────────────────────────
  createInventory(token: string, r: InventoryRequest) { return this.post<InventoryResponse>('/api/inventory', r, token); }
  getAllInventory(token: string) { return this.get<InventoryResponse[]>('/api/inventory', token); }
  getInventoryById(token: string, id: number) { return this.get<InventoryResponse>(`/api/inventory/${id}`, token); }
  updateInventory(token: string, id: number, r: InventoryRequest) { return this.put<InventoryResponse>(`/api/inventory/${id}`, r, token); }
  deleteInventory(token: string, id: number) { return this.delete<string>(`/api/inventory/${id}`, token); }

  // ── StockMovement ─────────────────────────────────────────────────────────────
  createMovement(token: string, r: StockMovementRequest) { return this.post<StockMovementResponse>('/api/stock-movements', r, token); }
  getAllMovements(token: string) { return this.get<StockMovementResponse[]>('/api/stock-movements', token); }
  getMovementById(token: string, id: number) { return this.get<StockMovementResponse>(`/api/stock-movements/${id}`, token); }
  getMovementsByProduct(token: string, productId: number) { return this.get<StockMovementResponse[]>(`/api/stock-movements/product/${productId}`, token); }
  getMovementsByWarehouse(token: string, warehouseId: number) { return this.get<StockMovementResponse[]>(`/api/stock-movements/warehouse/${warehouseId}`, token); }
}
