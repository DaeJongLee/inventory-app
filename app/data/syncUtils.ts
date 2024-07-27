// app/data/syncUtils.ts
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item } from '../types/types';

export const loadLocalData = async (): Promise<Item[]> => {
  const response = await fetch('/json/inventory_data.json');
  return response.json();
};

export const syncWithFirebase = async (items: Item[]): Promise<Item[]> => {
  try {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docRef = doc(db, 'items', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();

    const snapshot = await getDocs(collection(db, 'items'));
    const firebaseData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Item));
    
    console.log('Synced with Firebase successfully');
    return firebaseData;
  } catch (error) {
    console.error('Error syncing with Firebase:', error);
    return items;
  }
};