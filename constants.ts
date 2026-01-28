
import { AptType, AptData, FloorType } from './types';

// Approximate price data based on market trends for Gwacheon Juam C1 (Unit: KRW)
export const APT_DATA: Record<AptType, AptData> = {
  '46': {
    basePrice: {
      '1층': 571700000,
      '2층': 577790000,
      '3층': 589950000,
      '4층': 602110000,
      '5층이상': 608200000,
    },
    balconyPrice: 6500000,
    options: [
      { id: 'ac_46_3', name: '시스템 에어컨 (3대)', price: 4500000, category: '가전' },
      { id: 'kitchen_lux', name: '주방 엔지니어드스톤 업그레이드', price: 2800000, category: '인테리어' },
      { id: 'wardrobe_m', name: '안방 붙박이장', price: 1500000, category: '가구' },
      { id: 'induction_3', name: '3구 인덕션', price: 850000, category: '가전' },
    ]
  },
  '55A': {
    basePrice: {
      '1층': 682150000,
      '2층': 689410000,
      '3층': 703920000,
      '4층': 718440000,
      '5층이상': 725700000,
    },
    balconyPrice: 7200000,
    options: [
      { id: 'ac_55_4', name: '시스템 에어컨 (4대)', price: 5800000, category: '가전' },
      { id: 'kitchen_lux_55', name: '주방 세라믹 타일 및 상판', price: 3200000, category: '인테리어' },
      { id: 'dressroom_55', name: '드레스룸 시스템 선반', price: 1200000, category: '가구' },
      { id: 'dishwasher_55', name: '식기세척기 빌트인', price: 1100000, category: '가전' },
    ]
  },
  '55B': {
    basePrice: {
      '1층': 682030000,
      '2층': 689290000,
      '3층': 703800000,
      '4층': 718310000,
      '5층이상': 725570000,
    },
    balconyPrice: 7100000,
    options: [
      { id: 'ac_55_4_b', name: '시스템 에어컨 (4대)', price: 5800000, category: '가전' },
      { id: 'floor_upgrade_b', name: '거실/주방 원목마루', price: 4200000, category: '인테리어' },
      { id: 'entrance_sliding', name: '현관 슬라이딩 중문', price: 1500000, category: '인테리어' },
    ]
  },
  '55C': {
    basePrice: {
      '1층': 682150000,
      '2층': 689410000,
      '3층': 703920000,
      '4층': 718440000,
      '5층이상': 725700000,
    },
    balconyPrice: 7300000,
    options: [
      { id: 'ac_55_4_c', name: '시스템 에어컨 (4대)', price: 5800000, category: '가전' },
      { id: 'kitchen_pantry', name: '주방 팬트리 시스템', price: 2100000, category: '가구' },
      { id: 'lighting_lux', name: '감성 조명 패키지', price: 1800000, category: '인테리어' },
    ]
  },
  '84A': {
    basePrice: {
      '1층': 1022490000,
      '2층': 1033370000,
      '3층': 1055120000,
      '4층': 1076880000,
      '5층이상': 1087760000,
    },
    balconyPrice: 12500000,
    options: [
      { id: 'ac_84_5', name: '시스템 에어컨 (5대)', price: 7200000, category: '가전' },
      { id: 'kitchen_full', name: '풀빌트인 키친 패키지', price: 8500000, category: '가전' },
      { id: 'alpha_room_glass', name: '알파룸 유리 슬라이딩 도어', price: 2400000, category: '인테리어' },
      { id: 'master_room_closet', name: '안방 대형 드레스룸 확장', price: 3500000, category: '가구' },
    ]
  },
  '84B': {
    basePrice: {
      '3층': 1055500000,
      '4층': 1077260000,
      '5층이상': 1088150000,
    },
    balconyPrice: 12200000,
    options: [
      { id: 'ac_84_5_b', name: '시스템 에어컨 (5대)', price: 7200000, category: '가전' },
      { id: 'terrace_decor', name: '테라스 카페 조경 인테리어', price: 4800000, category: '인테리어' },
      { id: 'refrigerator_set', name: '비스포크 냉장고 세트', price: 3200000, category: '가전' },
    ]
  }
};

export const TYPES: AptType[] = ['46', '55A', '55B', '55C', '84A', '84B'];
export const SUB_TYPES: string[] = ['사전청약 당첨자', '일반 당첨자'];
export const FLOORS: FloorType[] = ['1층', '2층', '3층', '4층', '5층이상'];

export const getAvailableFloors = (aptType: AptType): FloorType[] => {
  return FLOORS.filter(floor => APT_DATA[aptType].basePrice[floor] !== undefined);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
};
