import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators'
import { Product, State, states } from 'src/app/models';
import { CartService } from 'src/app/services';
import { DatalayerService } from 'src/app/services/datalayer.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  items$: Observable<Product[]>;
  shippableStates: State[] = states;

  constructor(
    private cartService: CartService,
    private datalayer: DatalayerService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.items$ = this.cartService.getItems();
  }

  /**
   * Get the cart's order total cost.
   */
  getCartTotal(): number {
    return this.cartService.calculateTotalCost();
  }

  /**
   * Process the order form and checkout.
   */
  checkout() {
    // do some processing ...
    this.items$.pipe(first()).subscribe(items => this.datalayer.checkout(items));
    this.cartService.clear();
    this.router.navigate(['/thankyou']);
  }

}
