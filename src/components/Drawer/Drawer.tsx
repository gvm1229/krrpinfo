import React from 'react';

const Drawer = () => (
  <div className="daisy-drawer daisy-drawer-end">
    <input id="my-drawer" type="checkbox" className="daisy-drawer-toggle" />
    <div className="daisy-drawer-content">
      {/* Page content here */}
      <label
        htmlFor="my-drawer"
        className="daisy-btn daisy-btn-primary daisy-drawer-button"
      >
        Open drawer
      </label>
    </div>
    <div className="daisy-drawer-side mt-20 w-full">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="daisy-drawer-overlay"
      />
      <ul className="daisy-menu min-h-full w-80 bg-base-200 p-4 text-base-content">
        {/* Sidebar content here */}
        <li>
          <a>Sidebar Item 1</a>
        </li>
        <li>
          <a>Sidebar Item 2</a>
        </li>
      </ul>
    </div>
  </div>
);

export default Drawer;
