import InventoryLayout from './components/InventoryLayout'
import ItemForm from './components/ItemForm'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">재고 위치</h1>
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">새 아이템 추가</h2>
        <ItemForm />
      </div> */}
      <InventoryLayout />
    </main>
  )
}