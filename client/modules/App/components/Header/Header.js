import React from 'react';
import { Link } from 'react-router';

export function Header() {
  return (
    <div className="header">
      <div className="content">
        <h1 className="site-title">
          <Link to="/" >
            <img src="/assets/images/logo.png"/>
          </Link>
        </h1>
      </div>
    </div>
  );
}
export default Header;
