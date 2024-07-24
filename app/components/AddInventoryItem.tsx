'use client'

import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

export default function AddInventoryItem() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !quantity || !image) return

    try {
      // Upload image
      const imageRef = ref(storage, `inventory/${Date.now()}_${image.name}`)
      await uploadBytes(imageRef, image)
      const imageUrl = await getDownloadURL(imageRef)

      // Add item to Firestore
      await addDoc(collection(db, 'inventory'), {
        name,
        quantity: Number(quantity),
        imageUrl
      })

      // Reset form
      setName('')
      setQuantity('')
      setImage(null)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Item
      </button>
    </form>
  )
}