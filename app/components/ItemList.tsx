'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Image from 'next/image'
import { Item } from '../types/types'
import LocationSelector from './LocationSelector'

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), 
      (snapshot) => {
        const newItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Item[]
        setItems(newItems)
        setIsLoading(false)
      },
      (error) => {
        setError('아이템을 불러오는 중 오류가 발생했습니다.')
        console.error('Error fetching items:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'items', id))
      } catch (error) {
        setError('아이템 삭제 중 오류가 발생했습니다.')
        console.error('Error deleting item:', error)
      }
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item.id)
    setEditName(item.name)
    setEditLocation(item.location)
  }

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'items', id), {
        name: editName,
        location: editLocation
      })
      setEditingItem(null)
    } catch (error) {
      setError('아이템 수정 중 오류가 발생했습니다.')
      console.error('Error updating item:', error)
    }
  }

  if (isLoading) {
    return <p>로딩 중...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg">
          {editingItem === item.id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <LocationSelector onSelect={setEditLocation} />
              <button 
                onClick={() => handleUpdate(item.id)} 
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded mr-2"
              >
                저장
              </button>
              <button 
                onClick={() => setEditingItem(null)} 
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                취소
              </button>
            </>
          ) : (
            <>
              {item.imageUrl && (
                <div className="relative w-full h-48 mb-2">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-lg"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>위치: {item.location}</p>
              <button 
                onClick={() => handleEdit(item)} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded mr-2"
              >
                수정
              </button>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                삭제
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}