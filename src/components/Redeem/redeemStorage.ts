// 회원번호 localStorage key
const NPA_STORAGE_KEY = 'krrpinfo:npaCode';
// 회원번호별 사용 완료 쿠폰 key
const usedKey = (npaCode: string) => `krrpinfo:redeemed:${npaCode}`;
// 회원번호 변경 알림 event
export const NPA_CHANGE_EVENT = 'krrpinfo:npa-change';

// 저장된 회원번호 조회
export const readNpaCode = () => {
  try {
    return localStorage.getItem(NPA_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
};

// 회원번호 저장 또는 삭제 후 변경 알림
export const writeNpaCode = (value: string) => {
  try {
    if (value) localStorage.setItem(NPA_STORAGE_KEY, value);
    else localStorage.removeItem(NPA_STORAGE_KEY);
  } catch {
    // 저장 불가 환경 무시
  }
  window.dispatchEvent(new Event(NPA_CHANGE_EVENT));
};

// 회원번호의 사용 완료 쿠폰 목록 조회
export const readUsedCoupons = (npaCode: string): string[] => {
  if (!npaCode) return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(usedKey(npaCode)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((code) => typeof code === 'string') : [];
  } catch {
    return [];
  }
};

// 회원번호의 사용 완료 쿠폰 추가
export const addUsedCoupon = (npaCode: string, coupon: string) => {
  const used = readUsedCoupons(npaCode);
  if (used.includes(coupon)) return;
  try {
    localStorage.setItem(usedKey(npaCode), JSON.stringify([...used, coupon]));
  } catch {
    // 저장 불가 환경 무시
  }
};
