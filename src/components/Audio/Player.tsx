/* eslint-disable jsx-a11y/media-has-caption */

const Player = () => (
  <audio
    controls
    loop
    src="/assets/audio/네모_ASTERIA_겨울에는캐롤.mp3"
    className="container mt-8 max-w-108"
  >
    Your browser does not support the
    <code>audio</code>
    {' '}
    element.
  </audio>
);

export default Player;
