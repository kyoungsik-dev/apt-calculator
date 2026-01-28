
export type AptType = '46' | '55A' | '55B' | '55C' | '84A' | '84B';
export type SubType = '사전청약 당첨자' | '일반 당첨자';
export type FloorType = '1층' | '2층' | '3층' | '4층' | '5층이상';

export interface OptionItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface AptData {
  basePrice: Partial<Record<FloorType, number>>;
  balconyPrice: number;
  options: OptionItem[];
}

export interface UserSelection {
  aptType: AptType;
  subType: SubType;
  floor: FloorType;
  selectedOptions: string[]; // Option IDs
}
