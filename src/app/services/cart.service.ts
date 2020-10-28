import { Injectable } from '@angular/core';
import { Product } from '../models';
import { ReplaySubject } from 'rxjs';
import { ProductService } from './product.service';
import { DatalayerService } from './datalayer.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: Product[] = [];
  private subject = new ReplaySubject<Product[]>();

  constructor(private datalayer: DatalayerService,
    private productService: ProductService) {

  }

  /**
   * Adds an item to the shopping cart. If not already added, product details
   * will be obtained from the catalog. If the item already exists, the item's
   * quantity will be incremented by one.
   * @param productId the Product ID of the corresponding item
   */
  addItem(productId: number): void {
    // check if the item is already in the cart
    const item = this.items.find(product => product.id === productId);

    if (item) {
      // update the item's quantity and notify observers
      const { quantity } = item;
      item.quantity += quantity;

      this.subject.next(this.items);

      // update the data layer
      this.datalayer.addToCart(item, this.items);
    } else {
      // get the product from the catalog and add as an initial item
      this.productService.getProduct(productId).subscribe(product => {
        const item: Product = {
          ...product,
          quantity: 1 // initial quantity of 1
        }

        // store the item and notify observers
        this.items.push(item);
        this.subject.next(this.items);

        // update the data layer
        this.datalayer.addToCart(item, this.items);
      });
    }
  }

  /**
   * Calculates the total cost of all items in the cart (price x quantity).
   */
  calculateTotalCost(): number {
    return this.items.reduce((acc: number, item: Product) => acc += item.price * item.quantity, 0)
  }

  /**
   * Empties all items in the cart.
   */
  clear() {
    this.items = [];
    this.subject.next(this.items);
  }

  /**
   * Gets the items in the cart as an Observable.
   * A ReplaySubject is used to re-emit the cart's items to newly instantiated
   * components.
   */
  getItems(): ReplaySubject<Product[]> {
    return this.subject;
  }

  /**
   * Removes an item entirely from the cart.
   * @param productId the Product ID of the corresponding item
   */
  removeItem(productId: number): void {
    // find the item
    const index = this.items.findIndex(product => product.id === productId)

    if (index >= 0) {
      const item = this.items[index];

      // remove the item and notify observers
      this.items.splice(index, 1);
      this.subject.next(this.items);

      // update the data layer
      this.datalayer.removeFromCart(item, this.items);
    }
  }
}