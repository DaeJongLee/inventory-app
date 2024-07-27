'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, onSnapshot, updateDoc, doc, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import InventoryItem from './InventoryItem'
import InventoryItemStatus from './InventoryItemStatus'
import { Search, ArrowUpDown } from 'lucide-react'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Item>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    fetchItems()
  }, [sortField, sortDirection])

  const fetchItems = async (searchTerm = '', lastDocSnapshot: QueryDocumentSnapshot | null = null) => {
    setLoading(true)
    setError(null)
    try {
      let q = query(
        collection(db, 'inventory'),
        orderBy(sortField, sortDirection),
        limit(ITEMS_PER_PAGE)
      )

      if (lastDocSnapshot) {
        q = query(q, startAfter(lastDocSnapshot))
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const inventoryItems: Item[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
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
        setItems(prevItems => lastDocSnapshot ? [...prevItems, ...inventoryItems] : inventoryItems)
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null)
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE)
        setLoading(false)
      }, (err) => {
        console.error("Error fetching items: ", err)
        setError("아이템을 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (err) {
      console.error("Error setting up snapshot listener: ", err)
      setError("아이템 목록을 불러오는 데 실패했습니다.")
      setLoading(false)
    }
  }

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
      setError(`아이템 상태 업데이트 중 오류가 발생했습니다.`);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setItems([])
    setLastDoc(null)
    fetchItems(searchTerm)
  }

  const handleSort = (field: keyof Item) => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
    setSortField(field)
  }

  const loadMore = () => {
    if (lastDoc) {
      fetchItems(searchTerm, lastDoc)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">재고 목록</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="아이템 검색..."
            className="flex-grow p-2 border rounded-l"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
            <Search size={20} />
          </button>
        </div>
      </form>

      <div className="mb-4">
        <button onClick={() => handleSort('name')} className="mr-2">
          이름순 정렬 <ArrowUpDown size={16} className="inline" />
        </button>
        <button onClick={() => handleSort('quantity')}>
          수량순 정렬 <ArrowUpDown size={16} className="inline" />
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">

            <InventoryItemStatus 
              itemId={item.id}
              lowStock={item.lowStock}
              orderPlaced={item.orderPlaced}
              lowStockTime={item.lowStockTime}
              orderPlacedTime={item.orderPlacedTime}
              onStatusChange={(itemId, status, value) => updateItemStatus(itemId, status as 'lowStock' | 'orderPlaced', value)}
            />
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4">로딩 중...</p>}

      {!loading && hasMore && (
        <button 
          onClick={loadMore} 
          className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
        >
          더 보기
        </button>
      )}
    </div>
  )
}