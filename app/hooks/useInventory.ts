import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation, StorageLocation } from '../types/types';

export function useInventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(newItems);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateItems = useCallback(async (updatedItems: Item[]) => {
    const batch = writeBatch(db);
    updatedItems.forEach((item) => {
      const itemRef = doc(db, 'items', item.id);
      batch.set(itemRef, item, { merge: true });
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error('Error updating items:', error);
      throw error;
    }
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }, []);

  const swapLocations = useCallback(async (itemId: string, newLocation: ItemLocation, newStorageLocation: StorageLocation) => {
    const itemRef = doc(db, 'items', itemId);
    try {
      await updateDoc(itemRef, { location: newLocation, storageLocation: newStorageLocation });
    } catch (error) {
      console.error('Error swapping locations:', error);
      throw error;
    }
  }, []);

  return { items, isLoading, updateItems, deleteItem, swapLocations };
}