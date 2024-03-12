/* eslint-disable no-use-before-define */

'use server';

export async function handleUserLookup(payload) {
  try {
    const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Error fetching user: ${error}`);
  }
}

export async function handleRedeem(payload) {
  try {
    const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw new Error(`Error fetching coupon: ${error}`);
  }
}

export async function handleUnified(npaCode, coupon) {
  // const npaCode = '07S0LCI10W02W'; // 본계
  // const npaCode = '07X0MCW10M027'; // 부계
  // const coupon = '중요한건잊지않는마음';
  const region = 'KR';

  try {
    const payload = { npaCode, coupon, region };
    const responseData = await handleUserLookup(payload);
    console.log('Unified responseData', responseData);
    if (responseData.result)
      try {
        const redeemPayload = {
          coupon,
          id: responseData.info[0].id,
          name: responseData.info[0].name,
          npaCode,
          region,
          world: '',
        };
        const redeemResponseData = await handleRedeem(redeemPayload);
        console.log('Unified redeemResponseData', redeemResponseData);
        if (redeemResponseData.result)
          return {
            success: true,
            message: `{${responseData.name}} 에게 {${responseData.coupon}} 쿠폰 사용 성공`,
          };
        return {
          success: false,
          message: reformatMessage(redeemResponseData.message) ?? '이미 사용된 쿠폰 / 잘못된 입력',
        };
      } catch (error) {
        console.error('[Unified] Error fetching coupon:', error);
        return {
          success: false,
          message: `Error: ${error}`,
        };
      }
    else
      return {
        success: false,
        message: reformatMessage(responseData.message) ?? '이미 사용된 쿠폰 / 잘못된 입력',
      };
  } catch (error) {
    console.error('[Unified] Error fetching user:', error);
    return {
      success: false,
      message: `Error: fetch failed: ${error}`,
    };
  }
}

function reformatMessage(messageInput) {
  if (messageInput === 'Incorrect npaCode.')
    return '잘못된 회원번호';
  if (messageInput === 'NpaCode is required.')
    return '회원번호 미입력';
  if (messageInput === 'NpaCode is invalid length.')
    return '잘못된 회원번호';
  if (messageInput === 'Coupon is required.')
    return '쿠폰 미입력';
  if (messageInput === '해당 게임에서 사용할 수 없는 쿠폰')
    return '존재하지 않는 쿠폰';
  if (messageInput === '쿠폰사용기간이 아님')
    return '사용 기간이 지난 쿠폰';
  if (messageInput === '해당 쿠폰 완료 상태')
    return '이미 사용한 쿠폰';
  return messageInput;
}
