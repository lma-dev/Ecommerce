"use client";

import { useAtom } from 'jotai'
import { cartItemsAtom, CartItem } from './atoms'

export function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom)

  const add = (item: Omit<CartItem, 'qty'>, qty: number = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id)
      if (found) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...item, qty }]
    })
  }

  const updateQty = (id: number, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  }

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.qty * (i.price || 0), 0)

  return { items, add, updateQty, remove, clear, count, subtotal }
}

