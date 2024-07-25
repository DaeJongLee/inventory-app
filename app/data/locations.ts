import { Location } from '../types/types';

export const locations: Location[] = [
  {
    id: 'sales',
    name: '판매구역',
    children: [
      { id: 'refrigerator', name: '냉장고' },
      { id: 'warm-storage', name: '온장고' },
      { id: 'red', name: 'Red-', 
        children: [
          { id: 'red-a', name: 'A' },
          { id: 'red-b', name: 'B' }
        ]
      },
      { id: 'blue', name: 'Blue-', 
        children: [
          { id: 'blue-a', name: 'A' },
          { id: 'blue-b', name: 'B' }
        ]
      },
      { id: 'green', name: 'Green-' },
      { id: 'a', name: 'A', children: [{ id: 'a-drawer', name: '밑서랍' }] },
      { id: 'b', name: 'B', children: [{ id: 'b-drawer', name: '밑서랍' }] },
      { id: 'c', name: 'C', children: [{ id: 'c-drawer', name: '밑서랍' }] },
      { id: 'd', name: 'D', children: [{ id: 'd-drawer', name: '밑서랍' }] },
      { id: 'e', name: 'E', children: [{ id: 'e-drawer', name: '밑서랍' }] },
      { id: 'f', name: 'F', children: [{ id: 'f-drawer', name: '밑서랍' }] },
      { id: 'g', name: 'G', children: [{ id: 'g-drawer', name: '밑서랍' }] },
      { id: 'h', name: 'H', children: [{ id: 'h-drawer', name: '밑서랍' }] },
      { id: 'numbered', name: '숫자로 표시된 위치', 
        children: [
          { id: 'num-1', name: '1 (Red-A 아래)' },
          { id: 'num-2', name: '2 (Red-A 아래)' },
          { id: 'num-3', name: '3 (Red-A와 Blue-A 사이)' },
          { id: 'num-4', name: '4 (Blue-A 아래)' },
          { id: 'num-5', name: '5 (Blue-A 아래)' },
          { id: 'num-6', name: '6 (Green- 아래)' },
          { id: 'num-7', name: '7 (Green- 아래)' },
          { id: 'num-8', name: '8 (Green- 아래)' },
          { id: 'num-9', name: '9 (Green- 아래)' }
        ]
      },
      { id: 'rack', name: '랙' },
      { id: 'under-chair', name: '의자밑' },
      { id: 'band-stand', name: '밴드매대' },
      { id: 'dpa', name: 'DPA' },
      { id: 'dpb', name: 'DPB' },
      { id: 'dpc', name: 'DPC' },
      { id: 'dpd', name: 'DPD' },
      { id: 'dpe', name: 'DPE' },
      { id: 'dpf', name: 'DPF' },
      { id: 'dpg', name: 'DPG' }
    ]
  },
  {
    id: 'storage',
    name: '집하장',
    children: [
      { id: 'ss', name: 'SS (저장소)' },
      { id: 'sr', name: 'SR (Right)' },
      { id: 'sm', name: 'SM (Middle)' },
      { id: 'sl', name: 'SL (Left)' }
    ]
  },
  {
    id: 'preparation',
    name: '조제실',
    children: [
      { id: 'left', name: 'Left', 
        children: [
          { id: 'la', name: 'LA' },
          { id: 'lb', name: 'LB' },
          { id: 'lc', name: 'LC' }
        ]
      },
      { id: 'middle', name: 'Middle',
        children: [
          { id: 'ma', name: 'MA' },
          { id: 'mb', name: 'MB' }
        ]
      },
      { id: 'right', name: 'Right',
        children: [
          { id: 'ra', name: 'RA' },
          { id: 'rb', name: 'RB' },
          { id: 'rc', name: 'RC' }
        ]
      },
      { id: 'ins', name: 'INS' },
      { id: 'n-0-9', name: 'N (0-9)' }
    ]
  }
];