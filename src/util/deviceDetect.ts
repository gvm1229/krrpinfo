'use client';

export function isAppleDevice() {
  // if (navigator.userAgent.indexOf('Mac') > -1) return 'mac';
  // if (navigator.userAgent.indexOf('Windows') > -1) return 'windows';

  // if (typeof window !== 'undefined') {
  //   const user = navigator.userAgent;
  //   const isMac = /(Mac|iPhone|iPod|iPad)/i.test(user);
  //
  //   return isMac ? 'apple' : null;
  // }

  const isApple = typeof navigator === 'undefined'
    ? null
    : /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);

  // console.log('isApple: ', isApple);

  return isApple;
}
