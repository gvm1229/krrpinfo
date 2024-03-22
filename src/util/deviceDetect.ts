export function deviceDetect() {
  // if (navigator.userAgent.indexOf('Mac') > -1) return 'mac';
  // if (navigator.userAgent.indexOf('Windows') > -1) return 'windows';

  const user = navigator.userAgent;
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(user);

  return isMac ? 'apple' : 'else';
}
