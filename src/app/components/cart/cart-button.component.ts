import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services';

@Component({
  selector: 'app-cart-button',
  templateUrl: 'cart-button.component.html',
})
export class CartButtonComponent implements OnInit {
  cartBadge: number;

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartBadge = items.length);
  }
}
