import AddInventoryItem from './components/AddInventoryItem'
import InventoryList from './components/InventoryList'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">재고 관리 앱</h1>
      <div className="w-full max-w-2xl">
        <AddInventoryItem />
        <InventoryList />
      </div>
    </main>
  )
}