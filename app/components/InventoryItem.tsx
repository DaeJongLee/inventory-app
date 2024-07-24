import Image from 'next/image'

interface InventoryItemProps {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
}

export default function InventoryItem({ name, quantity, imageUrl }: InventoryItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
      <div className="relative w-32 h-32 mb-2">
        <Image 
          src={imageUrl} 
          alt={name} 
          layout="fill" 
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>수량: {quantity}</p>
    </div>
  )
}