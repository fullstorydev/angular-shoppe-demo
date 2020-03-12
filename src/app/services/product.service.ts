import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Product } from '../models'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly imageUrl = 'https://fruitshoppe.firebaseapp.com/images'; // URL of product images folder
  readonly productsEndpoint = '/products';  // API route to retrieve products
  readonly apiUrl: string;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    // based on whether to use mocks or the API server, build the full API URL
    this.apiUrl = environment.useMockApi ? `${environment.localApiRoot}${this.productsEndpoint}` :
      `${environment.remoteApiRoot}${this.productsEndpoint}`;
  }

  /**
   * Gets an observable that emits a product from the catalog.
   * @param id the identifier of the product
   */
  getProduct(id: number): Observable<Product | null> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<Product>(url).pipe(
      map(product => this.setImageUrl(product)),
      catchError(this.handleError<Product>('getProduct', null))
    );
  }

  /**
   * Gets an observable that emits a list of products from the catalog.
   * @param query An optional query string to search for products
   */
  getProducts(query?: string): Observable<Product[]> {
    // searching for products will not work for mocks
    const url = query ? `${this.apiUrl}?q=${query}` : this.apiUrl;

    return this.http.get<Product[]>(url).pipe(
      map(products => products.map(product => this.setImageUrl(product))),
      catchError(this.handleError<Product[]>('getProducts', []))
    );
  }

  /**
   * Provides a selector to allow handling of errors from service calls.
   * @param operation the operation display name that encountered an error
   * @param result the return value that should be passed to the next operator
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // TODO (van) possibly open a snackbar to inform the user of error

      return of(result as T);
    };
  }

  /**
   * By default, products have the image filename in the `image` property.
   * This function returns a copy of a product with the `image` property set to
   * the full URL to the image. It also sanitizes the URL so that it is deemed
   * safe by Angular.
   * @param product
   */
  private setImageUrl(product: Product): Product {
    let { image } = product;
    image = `${this.imageUrl}/${image}`;

    // depending on the usage of the URL, sanitize
    this.sanitizer.bypassSecurityTrustStyle(image); // if image is used as a style backgroundImage

    return {
      ...product,
      image
    };
  }
}
