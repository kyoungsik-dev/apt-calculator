
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AptType, SubType, FloorType, UserSelection, OptionItem, AptData } from './types';
import { APT_DATA, TYPES, SUB_TYPES, FLOORS, formatCurrency, getAvailableFloors } from './constants';
import * as htmlToImage from 'html-to-image';

// Fix for TypeScript missing Kakao on window object
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 앱 키 (개발자 본인의 키로 교체 필요)
const KAKAO_APP_KEY = 'ef79df4f4050b5cbd75d2aceaacf3ad8';

// URL에서 선택값 읽기
const getSelectionFromURL = (): Partial<UserSelection> => {
  const params = new URLSearchParams(window.location.search);
  const result: Partial<UserSelection> = {};

  const aptType = params.get('aptType');
  if (aptType && TYPES.includes(aptType as AptType)) {
    result.aptType = aptType as AptType;
  }

  const subType = params.get('subType');
  if (subType && SUB_TYPES.includes(subType)) {
    result.subType = subType as SubType;
  }

  const floor = params.get('floor');
  if (floor && FLOORS.includes(floor as FloorType)) {
    result.floor = floor as FloorType;
  }

  const options = params.get('options');
  if (options) {
    result.selectedOptions = options.split(',').filter(Boolean);
  }

  return result;
};

// 선택값으로 URL 생성
const buildShareURL = (selection: UserSelection): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  if (selection.aptType) params.set('aptType', selection.aptType);
  if (selection.subType) params.set('subType', selection.subType);
  if (selection.floor) params.set('floor', selection.floor);
  if (selection.selectedOptions.length > 0) {
    params.set('options', selection.selectedOptions.join(','));
  }

  const paramString = params.toString();
  return paramString ? `${baseUrl}?${paramString}` : baseUrl;
};

const initialSelection: UserSelection = {
  aptType: null,
  subType: null,
  floor: null,
  selectedOptions: [],
};

const App: React.FC = () => {
  const [selection, setSelection] = useState<UserSelection>(() => {
    const urlSelection = getSelectionFromURL();
    // URL에 파라미터가 있으면 해당 값 사용, 없으면 null (아무것도 선택 안 된 상태)
    if (urlSelection.aptType) {
      const aptType = urlSelection.aptType;
      const availableFloors = getAvailableFloors(aptType);
      const requestedFloor = urlSelection.floor || null;
      const floor = requestedFloor && availableFloors.includes(requestedFloor) ? requestedFloor : null;
      return {
        aptType,
        subType: urlSelection.subType || null,
        floor,
        selectedOptions: urlSelection.selectedOptions || [],
      };
    }
    return initialSelection;
  });

  const resetSelection = () => {
    setSelection(initialSelection);
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const estimateRef = useRef<HTMLDivElement>(null);

  // Initialize Kakao SDK
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
    }
  }, []);

  const currentAptData = selection.aptType ? APT_DATA[selection.aptType] : null;

  const groupedOptions = useMemo(() => {
    const groups: Record<string, OptionItem[]> = {};
    if (!currentAptData) return groups;
    currentAptData.options.forEach(opt => {
      if (!groups[opt.category]) {
        groups[opt.category] = [];
      }
      groups[opt.category].push(opt);
    });
    return groups;
  }, [currentAptData]);

  const handleAptTypeChange = (type: AptType) => {
    setSelection(s => {
      const availableFloors = getAvailableFloors(type);
      const newFloor = s.floor && availableFloors.includes(s.floor) ? s.floor : null;
      return { ...s, aptType: type, floor: newFloor, selectedOptions: [] };
    });
  };

  // number에서 기본 번호(N) 추출: "7-1" -> "7", "15-3" -> "15", "A" -> "A"
  const getBaseNumber = (number: string): string => {
    return number.split('-')[0];
  };

  const toggleOption = (optionId: string) => {
    if (!currentAptData) return;

    setSelection(prev => {
      // 이미 선택된 옵션이면 해제
      if (prev.selectedOptions.includes(optionId)) {
        return {
          ...prev,
          selectedOptions: prev.selectedOptions.filter(id => id !== optionId),
        };
      }

      // 새로 선택하는 옵션의 기본 번호 추출
      const clickedOption = currentAptData.options.find(opt => opt.id === optionId);
      if (!clickedOption) return prev;

      const clickedBaseNumber = getBaseNumber(clickedOption.number);

      // 같은 기본 번호를 가진 기존 선택 옵션 제거 후 새 옵션 추가
      const filteredOptions = prev.selectedOptions.filter(id => {
        const opt = currentAptData.options.find(o => o.id === id);
        return opt ? getBaseNumber(opt.number) !== clickedBaseNumber : true;
      });

      return {
        ...prev,
        selectedOptions: [...filteredOptions, optionId],
      };
    });
  };

  const totals = useMemo(() => {
    if (!currentAptData || !selection.floor) {
      return { base: 0, balcony: 0, optionsCost: 0, total: 0, deposit: 0 };
    }
    const base = currentAptData.basePrice[selection.floor] ?? 0;
    const balcony = currentAptData.balconyPrice;
    const optionsCost = currentAptData.options
      .filter(opt => selection.selectedOptions.includes(opt.id))
      .reduce((acc, opt) => acc + opt.price, 0);

    // 계약금 계산: 분양가 5% + 발코니(사전청약 50만/일반 100만) + 옵션비 5%
    const balconyDeposit = selection.subType === '사전청약 당첨자' ? 500000 : 1000000;
    const deposit = Math.round(base * 0.05) + balconyDeposit + Math.round(optionsCost * 0.05);

    return {
      base,
      balcony,
      optionsCost,
      total: base + balcony + optionsCost,
      deposit,
    };
  }, [selection, currentAptData]);

  const saveAsImage = async () => {
    if (!estimateRef.current) return;
    if (!selection.aptType || !selection.floor || !selection.subType) {
      alert('타입, 청약 구분, 층수를 모두 선택해주세요.');
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(estimateRef.current, {
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0px',
        }
      });
      const link = document.createElement('a');
      link.download = `과천주암C1_분양가계산_${selection.aptType}형.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to save image', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  // 헤더용 사이트 공유
  const shareSiteToKakao = () => {
    if (!window.Kakao) return;

    const siteUrl = window.location.origin + window.location.pathname;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '과천주암 C1 분양가 계산기',
        description: '프리미엄 주거 라이프 옵션 시뮬레이터로 나만의 견적을 계산해보세요!',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400',
        link: {
          mobileWebUrl: siteUrl,
          webUrl: siteUrl,
        },
      },
      buttons: [
        {
          title: '견적 계산하러 가기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    });
  };

  // 견적 공유
  const shareToKakao = () => {
    if (!window.Kakao) return;
    if (!selection.aptType || !selection.floor || !selection.subType) {
      alert('타입, 청약 구분, 층수를 모두 선택해주세요.');
      return;
    }

    const shareUrl = buildShareURL(selection);
    const siteUrl = window.location.origin + window.location.pathname;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `과천주암 C1 ${selection.aptType}형 옵션선택 공유합니다.`,
        description: `${selection.floor} / ${selection.subType}`,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      itemContent: {
        items: [
          { item: '분양가', itemOp: formatCurrency(totals.base) },
          { item: '발코니 확장비', itemOp: formatCurrency(totals.balcony) },
          { item: '옵션', itemOp: formatCurrency(totals.optionsCost) },
          { item: '총합', itemOp: formatCurrency(totals.total) },
        ],
      },
      buttons: [
        {
          title: '견적 살펴보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        {
          title: '나도 견적내보기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 lg:pb-0">
      {/* Header */}
      <header className="bg-indigo-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">과천주암 C1 분양가 계산기</h1>
            <p className="text-indigo-200 text-sm font-medium">프리미엄 주거 라이프 옵션 시뮬레이터</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetSelection}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm transition-all active:scale-95 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">초기화</span>
            </button>
            <button
              onClick={shareSiteToKakao}
              className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#FADB00] text-[#3C1E1E] px-4 py-2 rounded-full font-bold text-sm transition-all active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.8 1.94 5.25 4.86 6.55l-1.23 4.5c-.08.3.18.55.44.43l5.23-2.48c.55.07 1.11.11 1.7.11 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
              </svg>
              <span className="hidden sm:inline">공유하기</span>
            </button>
            <div className="flex items-center gap-2 bg-indigo-800/50 px-4 py-2 rounded-full border border-indigo-700">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">실시간 견적 산출 중</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Unit Selection */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              기본 정보 선택
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">공급 유형 (Type)</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(type => (
                    <button key={type} onClick={() => handleAptTypeChange(type)} className={`py-3 px-1 rounded-xl text-sm font-bold border-2 transition-all ${selection.aptType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">청약 구분</label>
                <div className="flex flex-col gap-2">
                  {SUB_TYPES.map(sub => (
                    <button key={sub} onClick={() => setSelection(s => ({ ...s, subType: sub as SubType }))} className={`py-3 px-4 rounded-xl text-sm font-bold border-2 text-left transition-all ${selection.subType === sub ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{sub}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">층수 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableFloors(selection.aptType).map(floor => (
                    <button key={floor} onClick={() => setSelection(s => ({ ...s, floor }))} className={`py-3 px-3 rounded-xl text-sm font-bold border-2 transition-all ${selection.floor === floor ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{floor}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Optional Items */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              유상 옵션 품목 {selection.aptType && `(${selection.aptType}형)`}
            </h2>
            {!selection.aptType ? (
              <div className="text-center py-12 text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="font-semibold text-slate-500">공급 유형을 먼저 선택해주세요</p>
                <p className="text-sm mt-1">타입별 옵션 목록이 표시됩니다</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedOptions).map(([category, options]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{category}</h3>
                      <div className="h-px bg-slate-100 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {options.map(option => {
                        const isSelected = selection.selectedOptions.includes(option.id);
                        return (
                          <div key={option.id} onClick={() => toggleOption(option.id)} className={`cursor-pointer group relative px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 ${isSelected ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50/20' : 'border-slate-100 bg-slate-50/50 hover:border-indigo-100 hover:bg-slate-50'}`}>
                            <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-bold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{option.number}</span>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-semibold text-slate-800 text-sm leading-tight">{option.name}</span>
                              <span className="text-indigo-600 font-bold text-xs">+ {formatCurrency(option.price)}</span>
                            </div>
                            <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 group-hover:border-indigo-300'}`}>
                              {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Section: Summary (Desktop) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <div ref={estimateRef}>
               <SummaryCard totals={totals} selection={selection} currentAptData={currentAptData} onSaveImage={saveAsImage} onShare={shareToKakao} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Contact Info */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 pb-8 lg:pb-8">
        <div className="text-center py-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            제작: <span className="font-semibold text-slate-700">코코넛파이</span>
          </p>
          <a
            href="https://open.kakao.com/o/s2Pqmfag"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.8 1.94 5.25 4.86 6.55l-1.23 4.5c-.08.3.18.55.44.43l5.23-2.48c.55.07 1.11.11 1.7.11 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
            </svg>
            카카오톡 문의하기
          </a>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-5 flex justify-between items-center shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-50">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">ESTIMATED TOTAL</p>
          <p className="text-lg font-black text-indigo-600 leading-none">{formatCurrency(totals.total)}</p>
        </div>
        <div className="flex gap-2">
            <button 
              className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg active:scale-95 transition-all text-sm"
              onClick={() => setIsDetailModalOpen(true)}
            >
              상세 견적 보기
            </button>
        </div>
      </div>

      {/* Mobile Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
          <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
            <h3 className="font-black text-slate-900 uppercase">견적 명세서</h3>
            <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-slate-100 rounded-full">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6">
            <div ref={estimateRef}>
               <SummaryCard totals={totals} selection={selection} currentAptData={currentAptData} onSaveImage={saveAsImage} onShare={shareToKakao} noShadow />
            </div>
            <div className="mt-8 pb-12">
               <button onClick={() => setIsDetailModalOpen(false)} className="w-full bg-slate-100 text-slate-600 font-black py-4 rounded-2xl">창 닫기</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

// Summary Component
const SummaryCard: React.FC<{
  totals: { base: number; balcony: number; optionsCost: number; total: number; deposit: number };
  selection: UserSelection;
  currentAptData: AptData | null;
  onSaveImage: () => void;
  onShare: () => void;
  noShadow?: boolean;
}> = ({ totals, selection, currentAptData, onSaveImage, onShare, noShadow }) => (
  <div className={`bg-white rounded-3xl border border-slate-200 overflow-hidden ${noShadow ? '' : 'shadow-2xl shadow-slate-200'}`}>
    <div className="bg-indigo-950 text-white p-8">
      <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3">Estimated Investment</h3>
      <div className="flex flex-col">
        <span className="text-4xl font-black text-white">{formatCurrency(totals.total)}</span>
        <div className="flex items-center gap-2 mt-4">
          <span className="px-2 py-0.5 bg-indigo-800 text-indigo-200 text-[10px] font-black rounded tracking-tighter">VAT 포함</span>
          <span className="px-2 py-0.5 bg-indigo-800 text-indigo-200 text-[10px] font-black rounded tracking-tighter">발코니 포함</span>
        </div>
      </div>
    </div>

    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-bold uppercase tracking-tighter">선택 타입</span>
          <span className="text-slate-900 font-black">{selection.aptType ? `${selection.aptType} Type` : '-'} / {selection.subType || '-'}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-bold uppercase tracking-tighter">선택 층수</span>
          <span className="text-slate-900 font-black">{selection.floor || '-'}</span>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 font-bold">기본 분양가</span>
          <span className="font-bold text-slate-800">{formatCurrency(totals.base)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 font-bold">발코니 확장비</span>
          <span className="font-bold text-slate-800">{formatCurrency(totals.balcony)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 font-black">유상 옵션 합계</span>
          <span className="font-black text-indigo-600">
            {selection.selectedOptions.length > 0 ? '+' : ''} {formatCurrency(totals.optionsCost)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-100">
          <span className="text-sm text-amber-700 font-black">계약금 (예상)</span>
          <span className="font-black text-amber-600">{formatCurrency(totals.deposit)}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-right">
          분양가 5% + 발코니({selection.subType === '사전청약 당첨자' ? '50만' : '100만'}) + 옵션 5%
        </p>
      </div>

      {selection.selectedOptions.length > 0 && currentAptData && (
        <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
            <span>선택 옵션 ({selection.selectedOptions.length})</span>
          </p>
          <div className="space-y-3">
            {/* Fix: Explicitly type options filter/map to ensure array methods are recognized */}
            {currentAptData.options
              .filter((opt: OptionItem) => selection.selectedOptions.includes(opt.id))
              .map((opt: OptionItem) => (
                <div key={opt.id} className="flex flex-col text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold truncate max-w-[150px]"><span className="text-indigo-600 mr-1">{opt.number}</span>{opt.name}</span>
                    <span className="text-slate-900 font-black shrink-0">{formatCurrency(opt.price)}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{opt.category}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-4">
          <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={onSaveImage}
          >
            이미지로 저장하기
          </button>
          <button 
            className="w-full bg-[#FEE500] hover:bg-[#FADB00] text-[#3C1E1E] font-black py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={onShare}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.8 1.94 5.25 4.86 6.55l-1.23 4.5c-.08.3.18.55.44.43l5.23-2.48c.55.07 1.11.11 1.7.11 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
            </svg>
            카카오톡 공유하기
          </button>
      </div>
    </div>
  </div>
);

export default App;
