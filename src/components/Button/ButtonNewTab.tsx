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
