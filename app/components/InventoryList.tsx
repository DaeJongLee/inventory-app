'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import InventoryItem from './InventoryItem'
import InventoryItemStatus from './InventoryItemStatus'

interface Item {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
  lowStock: boolean;
  orderPlaced: boolean;
  lowStockTime: string | null;
  orderPlacedTime: string | null;
}

export default function InventoryList() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const q = query(collection(db, 'inventory'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryItems: Item[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        inventoryItems.push({
          id: doc.id,
          name: data.name,
          quantity: data.quantity,
          imageUrl: data.imageUrl,
          lowStock: data.lowStock || false,
          orderPlaced: data.orderPlaced || false,
          lowStockTime: data.lowStockTime || null,
          orderPlacedTime: data.orderPlacedTime || null
        })
      })
      setItems(inventoryItems)
    })

    return () => unsubscribe()
  }, [])

  const updateItemStatus = async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    try {
      const itemRef = doc(db, 'inventory', itemId);
      const now = new Date().toISOString();
      
      await updateDoc(itemRef, { 
        [status]: value,
        [`${status}Time`]: value ? now : null
      });

      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, [status]: value, [`${status}Time`]: value ? now : null } : item
        )
      );

      console.log(`Item ${itemId} ${status} updated to ${value}`);
    } catch (error) {
      console.error(`Error updating item ${itemId} ${status}:`, error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg">
          <InventoryItem 
            id={item.id} 
            name={item.name} 
            quantity={item.quantity} 
            imageUrl={item.imageUrl} 
          />
          <InventoryItemStatus 
            itemId={item.id}
            lowStock={item.lowStock}
            orderPlaced={item.orderPlaced}
            lowStockTime={item.lowStockTime}
            orderPlacedTime={item.orderPlacedTime}
            onStatusChange={updateItemStatus}
          />
        </div>
      ))}
    </div>
  )
}