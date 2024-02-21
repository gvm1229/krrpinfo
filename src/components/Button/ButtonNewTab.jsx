import React from 'react';

const ButtonNewTab = ({
  href,
  className,
  containerStyle,
  isNewTab = true,
  children,
}) => {
  if (href == null || href === '') return (
    <div
      className={className}
      style={containerStyle}
    >
      {children}
    </div>
  );

  if (isNewTab) return (
    <a
      href={href}
      className={className}
      style={containerStyle}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );

  return (
    <a
      href={href}
      className={className}
      style={containerStyle}
    >
      {children}
    </a>
  );
};

export default ButtonNewTab;
