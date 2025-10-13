import { atom } from 'jotai'

export type CartItem = {
  id: number
  name: string
  price: number
  imageUrl?: string
  qty: number
}

export const cartItemsAtom = atom<CartItem[]>([])

