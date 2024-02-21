import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import './Card3D.css';

const Card3D = ({
  width = 200,
  height = 300,
  containerClassName,
  containerStyle,
  backgroundImage = 'https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg',
  backgroundImageClassName,
  popupTitleImage = 'https://ggayane.github.io/css-experiments/cards/dark_rider-title.png',
  popupTitleImageClassName,
  popupCharacterImage = 'https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp',
  popupCharacterImageClassName,
  toNavigate,
  hyperlink = 'https://www.mythrillfiction.com/the-dark-rider',
  isClickButtonExist = false,
  clickButtonClassName = 'top-6 px-4 py-3 bg-white transition hover:bg-blue-500',
  clickButtonTitle = 'Click Me',
  clickButtonTitleClassName,
}) => {
  const children = (
    <>
      <div className="wrapper">
        <Image
          src={backgroundImage}
          className={`cover-image pointer-events-none ${backgroundImageClassName}`}
          width={width}
          height={height}
          alt="Cover"
        />
      </div>
      {isClickButtonExist && (
        <>
          {toNavigate && (
            <Link
              href={`/${toNavigate}`}
              className={`card-btn ${clickButtonClassName}`}
            >
              <h1 className={clickButtonTitleClassName}>
                {clickButtonTitle}
              </h1>
            </Link>
          )}
          {hyperlink && (
            <ButtonNewTab
              href={hyperlink}
              className={`card-btn ${clickButtonClassName}`}
            >
              <h1 className={clickButtonTitleClassName}>
                {clickButtonTitle}
              </h1>
            </ButtonNewTab>
          )}
          {(!hyperlink && !toNavigate) && (
            <div className={`card-btn ${clickButtonClassName}`}>
              <h1 className={clickButtonTitleClassName}>
                {clickButtonTitle}
              </h1>
            </div>
          )}
        </>
      )}
      {popupTitleImage && (
        <Image
          src={popupTitleImage}
          className={`title pointer-events-none ${popupTitleImageClassName}`}
          width={width}
          height={100}
          alt="Title"
        />
      )}
      {popupCharacterImage && (
        <Image
          src={popupCharacterImage}
          className={`character pointer-events-none h-full w-auto ${popupCharacterImageClassName}`}
          width={width}
          height={height}
          alt="Character"
        />
      )}
    </>
  );

  const mutualClassName = `card relative group ${containerClassName}`;

  if (toNavigate && !isClickButtonExist)
    return (
      <Link
        href={`/${toNavigate}`}
        className={mutualClassName}
        style={containerStyle}
      >
        {children}
      </Link>
    );

  if (hyperlink && !isClickButtonExist)
    return (
      <ButtonNewTab
        href={hyperlink}
        className={mutualClassName}
        containerStyle={containerStyle}
      >
        {children}
      </ButtonNewTab>
    );

  return (
    <div
      className={mutualClassName}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default Card3D;
