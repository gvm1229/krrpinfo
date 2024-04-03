import React from 'react';

interface ButtonNewTabProps {
  href: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  isNewTab?: boolean;
  children?: React.ReactNode;
}

const ButtonNewTab = ({
  href,
  className,
  containerStyle,
  isNewTab = true,
  children,
}: ButtonNewTabProps) => {
  if (href == null || href === '') return (
    <button
      id="buttonNewTab_null"
      className={className}
      style={containerStyle}
    >
      {children}
    </button>
  );

  if (isNewTab) return (
    <a
      id="buttonNewTab_default"
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
      id="buttonNewTab_noNewTab"
      href={href}
      className={className}
      style={containerStyle}
    >
      {children}
    </a>
  );
};

export default ButtonNewTab;
