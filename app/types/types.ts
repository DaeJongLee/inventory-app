export interface Location {
  id: string;
  name: string;
  children?: Location[];
}

export interface ItemLocation {
  main: string;
  sub?: string;
  final?: string;
}


export interface Item {
  id: string;
  name: string;
  location: ItemLocation;
  lowStock: boolean;
  orderPlaced: boolean;
  lowStockTime: string | null;
  orderPlacedTime: string | null;
}