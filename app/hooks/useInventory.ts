import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item } from '../types/types';

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

  return { items, isLoading, updateItems, deleteItem };
}