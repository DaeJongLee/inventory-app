'use client'

import { useState, useEffect } from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import InventoryItem from './InventoryItem'

interface Item {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
}

export default function InventoryList() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const q = query(collection(db, 'inventory'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryItems: Item[] = []
      querySnapshot.forEach((doc) => {
        inventoryItems.push({ id: doc.id, ...doc.data() } as Item)
      })
      setItems(inventoryItems)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <InventoryItem key={item.id} {...item} />
      ))}
    </div>
  )
}