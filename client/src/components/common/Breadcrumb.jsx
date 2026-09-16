import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Universal EazeTrip Breadcrumb Component
 * @param {Array<{ label: string, path?: string }>} items
 * @param {string} [className]
 */
export default function Breadcrumb({ items = [], className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`eazetrip-breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0 && (item.label?.toLowerCase() === 'home' || item.path === '/');

          return (
            <li key={index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {index > 0 && (
                <ChevronRight size={13} className="breadcrumb-chevron" aria-hidden="true" />
              )}
              {isLast || !item.path ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="breadcrumb-link">
                  {isHome && <Home size={13} className="breadcrumb-home-icon" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
