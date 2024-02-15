'use client';

const RedeemButton = () => {
  const handleRedeemClick = () => {
    // Redirect to the specified URL
    window.location.href = 'https://mcoupon.nexon.com/kartrush?lang=ko';

    // Wait for the URL to load, then perform the actions
    setTimeout(() => {
      // Select the region as KR
      document.getElementById('eRedeemRegion').value = 'KR';

      // Set the value of 'eRedeemNpaCode' as 'sample123'
      document.getElementById('eRedeemNpaCode').value = '07S0LCI10W02W';

      // Set the value of 'eRedeemCoupon' as 'code098'
      document.getElementById('eRedeemCoupon').value = 'code098';
    }, 2000); // Adjust the delay as needed
  };

  return (
    <div className="center tab_box active" id="tab2">
      <button
        type="button"
        className="rounded-lg bg-purple-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-purple-400"
        onClick={handleRedeemClick}
        data-message="redeem"
      >
        Redeem
      </button>
    </div>
  );
};

export default RedeemButton;
