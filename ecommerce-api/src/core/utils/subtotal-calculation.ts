import { CartItem } from "../../modules/cart/entity/cart-item.entity";

export async function calculateSubTotal(cartItems: CartItem[]) {
    return cartItems.reduce(
      (subTotal, cartItem) => subTotal + cartItem.product.price * cartItem.quantity,
      0
    );
    
  }