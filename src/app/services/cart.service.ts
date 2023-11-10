import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  // Display information to the user once we got the product in the cart
  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    // Destructure
    const items = [...this.cart.value.items];

    // If we find an item thats already in cart, just increase the quantity by 1
    const itemsInCart = items.find((_item) => _item.id === item.id);
    if (itemsInCart) {
      itemsInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    // Service, opens a snackbar with a message, close duration 3s
    this._snackBar.open('1 item added to cart.', 'OK', { duration: 3000 });
    console.log(this.cart.value);
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval!: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'OK', { duration: 3000 });
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared.', 'OK', { duration: 3000 });
  }

  // The filter() method creates a new array filled with elements that pass a test provided by a function.
  // Only remove one item from array (Only keep values that match the condition)
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'OK', {
        duration: 3000,
      });
    }

    return filteredItems;
  }
}