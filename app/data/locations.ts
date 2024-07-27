import { Location } from '../types/types';

export const locations: Location[] = [
  {
    id: 'sales',
    name: '판매구역',
    children: [
      { id: 'red', name: 'Red-', 
        children: [
          { id: 'red-a', name: 'red-a' },
          { id: 'red-b', name: 'red-b' },
          { id: 'red-1', name: '1' },
          { id: 'red-2', name: '2' },
          { id: 'red-3', name: '3' },
          { id: 'red-4', name: '4' },
          { id: 'red-5', name: '5' }
        ]
      },
      { id: 'blue', name: 'Blue-', 
        children: [
          { id: 'blue-a', name: 'blue-a' },
          { id: 'blue-b', name: 'blue-B' },
          { id: 'blue-1', name: '1' },
          { id: 'blue-2', name: '2' }
        ]
      },
      { id: 'green', name: 'Green-' },
      { id: 'dp', name: 'DP', 
        children: [
          { id: 'dpa', name: 'DPA' },
          { id: 'dpb', name: 'DPB' },
          { id: 'dpc', name: 'DPC' },
          { id: 'dpd', name: 'DPD' },
          { id: 'dpe', name: 'DPE' },
          { id: 'dpf', name: 'DPF' },
          { id: 'dpg', name: 'DPG' }
        ]
      },
      { id: 'other', name: '그외',
        children: [
          { id: 'refrigerator', name: '냉장고' },
          { id: 'warm-storage', name: '온장고' },
          { id: 'rack', name: '랙' },
          { id: 'under-chair', name: '의자밑' },
          { id: 'band-stand', name: '밴드매대' }
        ]
      }
    ]
  },
  {
    id: 'storage',
    name: '집하장',
    children: [
      { id: 'ss', name: 'SS (저장소)' },
      { id: 'sr', name: 'SR (Right)' },
      { id: 'sm', name: 'SM (Middle)' },
      { id: 'sl', name: 'SL (Left)' },
      { id: 'sd', name: 'SD' }
    ]
  },
  {
    id: 'preparation',
    name: '조제실',
    children: [
      { id: 'left', name: 'L', 
        children: [
          { id: 'la', name: 'LA' },
          { id: 'lb', name: 'LB' },
          { id: 'lc', name: 'LC' }
        ]
      },
      { id: 'middle', name: 'M',
        children: [
          { id: 'ma', name: 'MA' },
          { id: 'mb', name: 'MB' }
        ]
      },
      { id: 'right', name: 'R',
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