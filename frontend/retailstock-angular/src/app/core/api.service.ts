import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type RoleName = 'ADMIN' | 'WAREHOUSE_MANAGER' | 'STORE_STAFF' | 'PROCUREMENT' | 'VIEWER';
export type WarehouseType = 'DC' | 'STORE' | 'RETURNS';
export type MovementType = 'INBOUND' | 'OUTBOUND' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGE' | 'COUNT_CORRECTION';
export interface Address { street: string; city: string; state: string; postalCode: string; country: string; }
export interface User { id?: number; firstName: string; lastName: string; email: string; phoneNo?: string; active?: boolean; roles?: RoleName[]; }
export interface RegisterPayload { firstName: string; lastName: string; email: string; phoneNo: string; password: string; roleName: RoleName; }
export interface Category { id?: number; name: string; description?: string; active?: boolean; }
export interface Product { id?: number; sku: string; name: string; description?: string; basePrice: number; active?: boolean; category?: Category; variant?: ProductVariant[]; }
export interface ProductVariant { id?: number; sku: string; name: string; description?: string; price: number; active?: boolean; productId: number; }
export interface Warehouse { id?: number; code: string; name: string; type: WarehouseType; address: Address; active?: boolean; }
export interface Supplier { id?: number; code: string; name: string; email?: string; phoneNo?: string; paymentTerms?: string; leadTimeDays?: number; rating?: number; }
export interface Inventory { id?: number; productId: number; warehouseId: number; quantityOnHand: number; quantityReserved: number; quantityIncoming: number; lastCountedAt?: string; version?: number; }
export interface StockMovement { id?: number; productId: number; warehouseId: number; movementType: MovementType; quantity: number; balanceAfter?: number; referenceType?: string; referenceId?: number; reason?: string; performedBy?: number; occurredAt?: string; }
export interface SupplierProduct { id?: number; supplierId: number; productId: number; unitCost: number; moq: number; }
export interface LoginResponse { token: string; }

export class ApiError extends Error { constructor(message: string, public readonly status: number) { super(message); } }

function parseBody(value: unknown): unknown {
  if (typeof value !== 'string' || !value.trim()) return value;
  try { return JSON.parse(value); } catch { return value; }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private headers(token?: string | null) { let headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return token ? headers.set('Authorization', `Bearer ${token}`) : headers; }
  request<T>(path: string, method: string = 'GET', body?: unknown, token?: string | null): Observable<T> {
    return this.http.request(method, `${environment.apiUrl}${path}`, { body, headers: this.headers(token), responseType: 'text' }).pipe(map((value) => parseBody(value) as T), catchError((err: HttpErrorResponse) => {
      const data = parseBody(err.error) as { message?: string } | string | null;
      const serverMessage = data && typeof data === 'object' ? data.message : typeof data === 'string' && data.length < 240 ? data : '';
      const message = serverMessage || (err.status === 0 ? 'Cannot reach the backend on port 8080. Check that Spring Boot is running on port 8080.' : err.status === 401 ? 'Your session has expired. Please sign in again.' : `The backend rejected the request (HTTP ${err.status}).`);
      return throwError(() => new ApiError(message, err.status));
    }));
  }
  login(email: string, password: string) { return this.request<LoginResponse>('/api/auth/login', 'POST', { email, password }); }
  register(payload: RegisterPayload) { return this.request('/api/auth/register', 'POST', payload); }
  getAllUsers(token: string) { return this.request<User[]>('/api/auth/all', 'GET', undefined, token); }
  getUser(id: number, token: string) { return this.request<User>(`/api/auth/${id}`, 'GET', undefined, token); }
  updateUser(id: number, payload: unknown, token: string) { return this.request(`/api/auth/update/${id}`, 'PUT', payload, token); }
  deactivateUser(id: number, token: string) { return this.request(`/api/auth/deactivate/${id}`, 'PUT', undefined, token); }
  categories(token: string) { return this.request<Category[]>('/api/categories', 'GET', undefined, token); }
  createCategory(payload: unknown, token: string) { return this.request<Category>('/api/categories', 'POST', payload, token); }
  updateCategory(id: number, payload: unknown, token: string) { return this.request<Category>(`/api/categories/${id}`, 'PUT', payload, token); }
  deactivateCategory(id: number, token: string) { return this.request(`/api/categories/${id}/deactivate`, 'PATCH', undefined, token); }
  products(token: string) { return this.request<Product[]>('/api/auth/getAll', 'GET', undefined, token); }
  createProduct(payload: unknown, token: string) { return this.request<Product>('/api/auth/create_Product', 'POST', payload, token); }
  updateProduct(id: number, payload: unknown, token: string) { return this.request<Product>(`/api/auth/updateProduct/${id}`, 'PUT', payload, token); }
  deactivateProduct(id: number, token: string) { return this.request(`/api/auth/${id}/deactivate_pro`, 'PATCH', undefined, token); }
  variants(token: string) { return this.request<ProductVariant[]>('/api/product-variants', 'GET', undefined, token); }
  createVariant(payload: unknown, token: string) { return this.request<ProductVariant>('/api/product-variants', 'POST', payload, token); }
  updateVariant(id: number, payload: unknown, token: string) { return this.request<ProductVariant>(`/api/product-variants/${id}`, 'PUT', payload, token); }
  deactivateVariant(id: number, token: string) { return this.request(`/api/product-variants/${id}/deactivateVariant`, 'PATCH', undefined, token); }
  warehouses(token: string) { return this.request<Warehouse[]>('/api/warehouses', 'GET', undefined, token); }
  createWarehouse(payload: unknown, token: string) { return this.request<Warehouse>('/api/warehouses', 'POST', payload, token); }
  updateWarehouse(id: number, payload: unknown, token: string) { return this.request<Warehouse>(`/api/warehouses/${id}`, 'PUT', payload, token); }
  deactivateWarehouse(id: number, token: string) { return this.request(`/api/warehouses/${id}/deactivate`, 'PATCH', undefined, token); }
  suppliers(token: string) { return this.request<Supplier[]>('/api/suppliers', 'GET', undefined, token); }
  createSupplier(payload: unknown, token: string) { return this.request<Supplier>('/api/suppliers', 'POST', payload, token); }
  updateSupplier(id: number, payload: unknown, token: string) { return this.request<Supplier>(`/api/suppliers/${id}`, 'PUT', payload, token); }
  deleteSupplier(id: number, token: string) { return this.request(`/api/suppliers/${id}`, 'DELETE', undefined, token); }
  inventory(token: string) { return this.request<Inventory[]>('/api/inventory', 'GET', undefined, token); }
  createInventory(payload: unknown, token: string) { return this.request<Inventory>('/api/inventory', 'POST', payload, token); }
  updateInventory(id: number, payload: unknown, token: string) { return this.request<Inventory>(`/api/inventory/${id}`, 'PUT', payload, token); }
  deleteInventory(id: number, token: string) { return this.request(`/api/inventory/${id}`, 'DELETE', undefined, token); }
  movements(token: string) { return this.request<StockMovement[]>('/api/stock-movements', 'GET', undefined, token); }
  createMovement(payload: unknown, token: string) { return this.request<StockMovement>('/api/stock-movements', 'POST', payload, token); }
  supplierProducts(token: string) { return this.request<SupplierProduct[]>('/api/supplier-products', 'GET', undefined, token); }
  createSupplierProduct(payload: unknown, token: string) { return this.request<SupplierProduct>('/api/supplier-products', 'POST', payload, token); }
  updateSupplierProduct(id: number, payload: unknown, token: string) { return this.request<SupplierProduct>(`/api/supplier-products/${id}`, 'PUT', payload, token); }
  deleteSupplierProduct(id: number, token: string) { return this.request(`/api/supplier-products/${id}`, 'DELETE', undefined, token); }
}
