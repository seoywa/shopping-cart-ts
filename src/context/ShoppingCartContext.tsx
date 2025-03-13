import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type CartItem = { 
  id: number,
  quantity: number
}

type ShoppingCartContext = { 
  openCart: () => void,
  closeCart: () => void,
  cartQuantity: number,
  cartItems: CartItem[],
  getItemQuantity: (id: number) => number,
  increaseCartQuantity: (id: number) => void,
  decreaseCartQuantity: (id: number) => void,
  removeFromCart: (id: number) => void,
}

type ShoppingCartProviderProps = {
  children: ReactNode
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({children}: ShoppingCartProviderProps ) {

  const [ isOpen, setIsOpen ] = useState(false);

  const [ cartItems, setCartItems ] = useLocalStorage<CartItem[]>(
    'shopping-cart', []);

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0
  }

  function increaseCartQuantity(id: number) {
    setCartItems(currItem => {
      if (currItem.find(item => item.id === id) == null) {
        return [...currItem, {id, quantity: 1}]
      } else {
        return currItem.map(item => {
          if (item.id === id) {
            return {...item, quantity: item.quantity + 1}
          } else { return item }
        })
      }
    })
  }

  function decreaseCartQuantity(id: number) {
    setCartItems(currItem => {
      if (currItem.find(item => item.id === id)?.quantity === 1) {
        return currItem.filter( item => item.id !== id )
      } else {
        return currItem.map(item => {
          if (item.id === id) {
            return {...item, quantity: item.quantity - 1}
          } else { return item }
        })
      }
    })
  }

  function removeFromCart(id: number) {
    setCartItems(currItems => {
      return currItems.filter(item => item.id !== id)
    })
  }

  return (
    <ShoppingCartContext.Provider 
    value={{ 
      getItemQuantity, 
      increaseCartQuantity, 
      decreaseCartQuantity, 
      removeFromCart,
      openCart,
      closeCart,
      cartItems,
      cartQuantity,
    }}>
    {children}
    <ShoppingCart isOpen={isOpen}/>
  </ShoppingCartContext.Provider>
  )
}