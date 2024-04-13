import React from 'react';

const TruncateText = ({
  text,
  mobileOnlyLength = 10,
  tabletAboveLength = 20,
}: {
  text: string;
  mobileOnlyLength?: number;
  tabletAboveLength?: number;
}) => (
  <>
    {/* only mobile view */}
    <span className="tablet:hidden">
      {text.slice(0, mobileOnlyLength) + (text.length > mobileOnlyLength ? '...' : '')}
    </span>
    {/* tablet and above view */}
    <span className="mobile_only:hidden">
      {text.slice(0, tabletAboveLength) + (text.length > tabletAboveLength ? '...' : '')}
    </span>
  </>
);

export default TruncateText;
