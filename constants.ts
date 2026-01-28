
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
    balconyPrice: 5687000,
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
    balconyPrice: 7269000,
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
    balconyPrice: 6207000,
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
    balconyPrice: 6946000,
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
    balconyPrice: 8593000,
    options: [
      { id: '84a_space_a', name: 'A [공간확장형] 침실2/3통합', price: 0, category: '공간선택' },
      { id: '84a_kitchen_1_1', name: '냉장고장+키큰장(수납장+가전소물장)', price: 2295000, category: '주방' },
      { id: '84a_kitchen_1_3', name: '냉장고장(3도어)+키큰장', price: 1780000, category: '주방' },
      { id: '84a_kitchen_1_4', name: '냉장고장+김치냉장고장', price: 1350000, category: '주방' },
      { id: '84a_kitchen_3', name: '식기세척기 공간장', price: 0, category: '주방' },
      { id: '84a_kitchen_4', name: '[주방특화] 엔지니어드스톤 벽/상판+거위목 싱크수전+사각씽크볼+상부장 하부 간접조명', price: 3090000, category: '주방' },
      { id: '84a_cooktop_5_1', name: '인덕션 2구+가스 1구', price: 630000, category: '주방가전' },
      { id: '84a_cooktop_5_2', name: '인덕션 3구', price: 590000, category: '주방가전' },
      { id: '84a_furniture_6', name: '현관중문(3연동)', price: 1708000, category: '가구' },
      { id: '84a_furniture_7_1', name: '[침실1] 드레스룸+파우더가구', price: 3825000, category: '가구' },
      { id: '84a_furniture_7_2', name: '[침실1] 드레스룸+파우더가구+붙박이장(슬라이딩3장)', price: 7384000, category: '가구' },
      { id: '84a_furniture_8_1', name: '[침실2] 붙박이장(여닫이)+장식장', price: 1320000, category: '가구' },
      { id: '84a_furniture_8_2', name: '[침실2/침실3 통합] 붙박이장(슬라이딩4장)+장식장', price: 4864000, category: '가구' },
      { id: '84a_furniture_8_3', name: '[침실3] 붙박이장(여닫이)', price: 1723000, category: '가구' },
      { id: '84a_interior_9', name: '[거실] 아트월 광폭타일(600x1200)', price: 418000, category: '인테리어' },
      { id: '84a_interior_10', name: '[거실특화] 거실/현관/복도 벽체 시트판넬', price: 2934000, category: '인테리어' },
      { id: '84a_interior_11_1', name: '[조명특화] 중앙직부+간접조명+포인트조명+엣지등+식탁등', price: 3270000, category: '인테리어' },
      { id: '84a_interior_11_2', name: '[조명특화] 다운라이트8EA+간접조명+포인트조명+엣지등+식탁등', price: 4373000, category: '인테리어' },
      { id: '84a_interior_12', name: '기능성 륨카펫(6mm)', price: 0, category: '인테리어' },
      { id: '84a_bath_13', name: '600각 포세린 벽타일', price: 746000, category: '욕실자재' },
      { id: '84a_bath_14', name: '욕실 다기능팬', price: 580000, category: '욕실자재' },
      { id: '84a_ac_15_1', name: '거실+침실1(실내기2대)', price: 4490000, category: '시스템에어컨' },
      { id: '84a_ac_15_2', name: '거실+침실1+침실2+침실3(실내기4대)', price: 8130000, category: '시스템에어컨' },
      { id: '84a_ac_15_3', name: '거실+침실1+침실2/침실3 통합(실내기3대)', price: 6890000, category: '시스템에어컨' },
      { id: '84a_ac_15_4', name: '거실+침실1+침실2/침실3 통합+알파룸(실내기4대)', price: 8940000, category: '시스템에어컨' },
      { id: '84a_ac_15_5', name: '거실+침실1+침실2+침실3+알파룸(실내기5대)', price: 10200000, category: '시스템에어컨' },
      { id: '84a_etc_16', name: '현관창고 시스템선반', price: 399000, category: '기타' },
      { id: '84a_etc_17', name: '알파룸(축소)+슬라이딩도어+주방팬트리', price: 1919000, category: '기타' },
    ]
  },
  '84B': {
    basePrice: {
      '3층': 1055500000,
      '4층': 1077260000,
      '5층이상': 1088150000,
    },
    balconyPrice: 8481000,
    options: [
      { id: '84b_space_a', name: 'A [공간확장형] 침실2/3통합', price: 0, category: '공간선택' },
      { id: '84b_kitchen_1_1', name: '냉장고장+키큰장(수납장+가전소물장)', price: 945000, category: '주방' },
      { id: '84b_kitchen_1_3', name: '냉장고장(3도어)+키큰장', price: 430000, category: '주방' },
      { id: '84b_kitchen_2_1', name: '아일랜드식탁(MMA)', price: 1642000, category: '주방' },
      { id: '84b_kitchen_2_2', name: '[주방특화] 아일랜드식탁(엔지니어드스톤)', price: 1701000, category: '주방' },
      { id: '84b_kitchen_3', name: '식기세척기 공간장', price: 0, category: '주방' },
      { id: '84b_kitchen_4', name: '[주방특화] 엔지니어드스톤 벽/상판+거위목 싱크수전+사각씽크볼+상부장 하부 간접조명', price: 3527000, category: '주방' },
      { id: '84b_cooktop_5_1', name: '인덕션 2구+가스 1구', price: 630000, category: '주방가전' },
      { id: '84b_cooktop_5_2', name: '인덕션 3구', price: 590000, category: '주방가전' },
      { id: '84b_furniture_6', name: '현관중문(3연동)', price: 1708000, category: '가구' },
      { id: '84b_furniture_7_1', name: '[침실1] 드레스룸+파우더가구', price: 3710000, category: '가구' },
      { id: '84b_furniture_7_2', name: '[침실1] 드레스룸+파우더가구+붙박이장(슬라이딩3장)', price: 7269000, category: '가구' },
      { id: '84b_furniture_8_1', name: '[침실2] 붙박이장(여닫이)+장식장', price: 1320000, category: '가구' },
      { id: '84b_furniture_8_2', name: '[침실2/침실3 통합] 붙박이장(슬라이딩4장)+장식장', price: 4864000, category: '가구' },
      { id: '84b_furniture_8_3', name: '[침실3] 붙박이장(여닫이)', price: 1723000, category: '가구' },
      { id: '84b_interior_9', name: '[거실] 아트월 광폭타일(600x1200)', price: 418000, category: '인테리어' },
      { id: '84b_interior_10', name: '[거실특화] 거실/현관/복도 벽체 시트판넬', price: 3459000, category: '인테리어' },
      { id: '84b_interior_11_1', name: '[조명특화] 중앙직부+간접조명+포인트조명+엣지등+식탁등', price: 3374000, category: '인테리어' },
      { id: '84b_interior_11_2', name: '[조명특화] 다운라이트8EA+간접조명+포인트조명+엣지등+식탁등', price: 4477000, category: '인테리어' },
      { id: '84b_interior_12', name: '기능성 륨카펫(6mm)', price: 0, category: '인테리어' },
      { id: '84b_bath_13', name: '600각 포세린 벽타일', price: 775000, category: '욕실자재' },
      { id: '84b_bath_14', name: '욕실 다기능팬', price: 580000, category: '욕실자재' },
      { id: '84b_ac_15_1', name: '거실+침실1(실내기2대)', price: 4490000, category: '시스템에어컨' },
      { id: '84b_ac_15_2', name: '거실+침실1+침실2+침실3(실내기4대)', price: 8130000, category: '시스템에어컨' },
      { id: '84b_ac_15_3', name: '거실+침실1+침실2/침실3 통합(실내기3대)', price: 6890000, category: '시스템에어컨' },
      { id: '84b_etc_16', name: '현관창고 시스템선반', price: 226000, category: '기타' },
      { id: '84b_etc_18_1', name: '복도팬트리', price: 1513000, category: '기타' },
      { id: '84b_etc_18_2', name: '신발장+복도 팬트리(확장형)', price: 1879000, category: '기타' },
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
