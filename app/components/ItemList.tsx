'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemLocation, StorageLocation, Location } from '../types/types';
import { locations } from '../data/locations';
import LocationChangeModal from './LocationChangeModal';
import InventoryItemStatus from './InventoryItemStatus';
import InventoryStatusLists from './InventoryStatusLists';
import { Search, Info, MapPin } from 'lucide-react';

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [highlightedLocation, setHighlightedLocation] = useState<ItemLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSubLocationModalOpen, setIsSubLocationModalOpen] = useState(false);
  const [selectedMainLocation, setSelectedMainLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const newItems = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lowStock: data.lowStock || false,
          orderPlaced: data.orderPlaced || false,
          lowStockTime: data.lowStockTime || null,
          orderPlacedTime: data.orderPlacedTime || null
        };
      }) as Item[];
      setItems(newItems);
      setDisplayedItems(newItems);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    const sectionItems = items.filter(item => {
      const location = item.location;
      if (location && typeof location === 'object') {
        return (
          location.main?.toLowerCase() === section.toLowerCase() ||
          location.sub?.toLowerCase() === section.toLowerCase() ||
          location.final?.toLowerCase() === section.toLowerCase() ||
          Object.values(location).some(value => 
            typeof value === 'string' && value.toLowerCase() === section.toLowerCase()
          )
        );
      }
      return false;
    });
    setDisplayedItems(sectionItems);
    setHighlightedLocation(null);
    setCurrentPage(1); // Reset to first page on section change
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const results = items.filter(item => {
      if (item && typeof item.name === 'string') {
        const itemName = item.name.toLowerCase();
        return searchTerms.every(term => itemName.includes(term));
      }
      return false;
    });
    setDisplayedItems(results);
    setSelectedSection(null);
    if (results.length > 0) {
      setHighlightedLocation({ main: results[0].location.main });
    }
    setCurrentPage(1); // Reset to first page on search
  };

  const handleUpdateLocation = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleLocationChange = async (itemId: string, newLocation: ItemLocation, newStorageLocation: StorageLocation) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { 
        location: newLocation,
        storageLocation: newStorageLocation
      });
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error updating item location:", error);
    }
  };
  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'items', itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const getLocationName = (location: ItemLocation) => {
    const mainName = locations.find(loc => loc.id === location.main)?.name || location.main;
    const subName = location.sub ? ` > ${locations.find(loc => loc.id === location.sub)?.name || location.sub}` : '';
    const finalName = location.final ? ` > ${locations.find(loc => loc.id === location.final)?.name || location.final}` : '';
    return `${mainName}${subName}${finalName}`;
  };

  const handleMainLocationClick = (location: string) => {
    if (location === 'red-' || location === 'blue-') {
      setSelectedMainLocation(location);
      setIsSubLocationModalOpen(true);
    } else {
      handleSectionClick(location);
    }
  };

  const handleSubLocationSelect = (subLocation: string) => {
    setIsSubLocationModalOpen(false);
    handleSectionClick(`${selectedMainLocation}${subLocation}`);
  };

  const updateItemStatus = async (itemId: string, status: 'lowStock' | 'orderPlaced', value: boolean) => {
    try {
      const itemRef = doc(db, 'items', itemId);
      
      await updateDoc(itemRef, { 
        [status]: value,
        [`${status}Time`]: value ? new Date().toISOString() : null
      });
  
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, [status]: value, [`${status}Time`]: value ? new Date().toISOString() : null } : item
        )
      );
    } catch (error) {
      console.error(`Error updating item ${status}:`, error);
    }
  };

  const renderPagination = (itemsCount: number) => {
    const pageCount = Math.ceil(itemsCount / itemsPerPage);
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
      <div className="mt-4">
        {pages.map(page => (
          <button 
            key={page} 
            onClick={() => setCurrentPage(page)} 
            className={`p-2 border ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  const paginatedDisplayedItems = displayedItems.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search items..."
          className="border p-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Search</button>
      </form>
      
      <div className="mb-4">
        {locations.map(location => (
          <button 
            key={location.id}
            onClick={() => handleMainLocationClick(location.id)}
            className="p-2 border mr-2"
          >
            {location.name}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-100 p-4 border rounded">
        <ul>
          {paginatedDisplayedItems.map(item => (
            <li key={item.id} className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <strong>{item.name}</strong> 
                  <span className="text-gray-500">{getLocationName(item.location)}</span>
                </div>
                <InventoryItemStatus
                  itemId={item.id}
                  lowStock={item.lowStock}
                  orderPlaced={item.orderPlaced}
                  lowStockTime={item.lowStockTime}
                  orderPlacedTime={item.orderPlacedTime}
                  onStatusChange={(itemId, status, value) => updateItemStatus(itemId, status as 'lowStock' | 'orderPlaced', value)}
                />
                <div>
                  <button 
                    onClick={() => handleUpdateLocation(item)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    위치 변경
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {renderPagination(displayedItems.length)}

        {selectedItem && (
  <LocationChangeModal 
    isOpen={isModalOpen} 
    item={selectedItem}
    onClose={() => setIsModalOpen(false)}
    onSave={handleLocationChange}
    locations={locations}
  />
)}
      </div>
      {isModalOpen && selectedItem && (
  <LocationChangeModal
    isOpen={isModalOpen}
    item={selectedItem}
    onClose={() => setIsModalOpen(false)}
    onSave={handleLocationChange}
    locations={locations}
  />
)}
      
    </div>
  );
};

export default ItemList;
