import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = "/api/products";

    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            tap((products) => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<Product> {
        return this.http.post<Product>(this.path, product).pipe(
            tap((created) => this._products.update(products => [created, ...products])),
        );
    }

    public update(product: Product): Observable<Product> {
        return this.http.patch<Product>(`${this.path}/${product.id}`, product).pipe(
            tap((updated) => this._products.update(products => {
                return products.map(p => p.id === updated.id ? updated : p)
            })),
        );
    }

    public delete(productId: number): Observable<void> {
        return this.http.delete<void>(`${this.path}/${productId}`).pipe(
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}