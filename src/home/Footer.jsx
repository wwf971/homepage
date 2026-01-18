import React from 'react';
import { GITHUB_URL_THIS_PAGE } from '../../config.js';
import './Footer.css';

/**
 * Footer Component
 * Reusable footer component that can be used across different pages
 * 
 * Props:
 * - className: string (optional) - Additional CSS class for styling
 * - text: string (optional) - Custom footer text, defaults to construction message
 * - showLinks: boolean (optional) - Whether to show additional links, defaults to false
 */
function Footer({ 
  className = '', 
  text = null,
  showLinks = false 
}) {
  const defaultContent = (
    <>
      This website is under construction. Created using React.js/Zustand as frontend
      (<a 
        href={GITHUB_URL_THIS_PAGE}
        target="_blank" 
        rel="noopener noreferrer"
        className="footer-link"
      >)
        Source Code
      </a> and Flask/Nginx as backend.{' '}
    </>
  );

  return (
    <div className={`footer ${className}`}>
      <span className="footer-text">
        {text || defaultContent}
      </span>
      {showLinks && (
        <div className="footer-links">
          {/* Add any additional footer links here if needed */}
        </div>
      )}
    </div>
  );
}

export default Footer;
