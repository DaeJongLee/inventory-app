import { locations } from '../data/locations';

// 한글 음절 배열
const koreanSyllables = [
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하',
  '강', '명', '민', '박', '백', '서', '석', '신', '안', '양', '엄', '오', '우', '원', '유', '윤', '이', '임', '정', '조', '주', '지', '진', '최', '한', '홍',
  '약', '정', '산', '액', 'dispersible', '과립', '시럽', '주사', '연고', '크림', '로션', '패치'
];

// 랜덤 한글 약 이름 생성 함수
export function generateRandomMedicineName(): string {
  const nameLength = Math.floor(Math.random() * 3) + 2; // 2~4 음절
  let name = '';
  for (let i = 0; i < nameLength; i++) {
    name += koreanSyllables[Math.floor(Math.random() * koreanSyllables.length)];
  }
  return name;
}

// 랜덤 위치 선택 함수
function getRandomLocation(locationArray: any[]): string {
  return locationArray[Math.floor(Math.random() * locationArray.length)].id;
}

// 랜덤 판매 위치 생성 함수
export function generateRandomSalesLocation() {
  const main = getRandomLocation(locations);
  const mainLocation = locations.find(loc => loc.id === main);
  const sub = mainLocation?.children ? getRandomLocation(mainLocation.children) : '';
  const subLocation = mainLocation?.children?.find(loc => loc.id === sub);
  const final = subLocation?.children ? getRandomLocation(subLocation.children) : '';

  return { main, sub, final };
}

// 랜덤 저장 위치 생성 함수
export function generateRandomStorageLocation() {
  const storageLocation = locations.find(loc => loc.id === 'storage');
  const storageMain = 'storage';
  const storageSub = storageLocation?.children ? getRandomLocation(storageLocation.children) : '';
  const storageFinal = ''; // 저장 위치에는 final 위치가 없다고 가정

  return { storageMain, storageSub, storageFinal };
}