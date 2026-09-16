import { Link } from 'react-router-dom';
import { seoDirectoryData } from '../../data/siteData';

export default function SeoFooterDirectory() {
  return (
    <div className="seo-directory-wrapper">
      <div className="container">
        {/* Category 1: Popular Flight Routes */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">Popular Flight Routes</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.popularFlightRoutes.map((route, idx) => (
              <Link key={idx} to={route.path} className="seo-dir-link">
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 2: Popular Domestic Flight Routes */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">Popular Domestic Flight Routes</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.popularDomesticRoutes.map((route, idx) => (
              <Link key={idx} to={route.path} className="seo-dir-link">
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 3: Popular International Flight Routes */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">Popular International Flight Routes</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.popularInternationalRoutes.map((route, idx) => (
              <Link key={idx} to={route.path} className="seo-dir-link">
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 4: Popular Train Routes */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">Popular Train Routes</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.popularTrainRoutes.map((route, idx) => (
              <Link key={idx} to={route.path} className="seo-dir-link">
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 5: Popular Bus Routes */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">Popular Intercity Bus Routes</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.popularBusRoutes.map((route, idx) => (
              <Link key={idx} to={route.path} className="seo-dir-link">
                {route.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 6: Curated Holiday Packages */}
        {seoDirectoryData.popularHolidayPackages && (
          <div className="seo-directory-group">
            <h4 className="seo-group-title">Curated Holiday Packages & Tour Escapes</h4>
            <div className="seo-links-inline-grid">
              {seoDirectoryData.popularHolidayPackages.map((pkg, idx) => (
                <Link key={idx} to={pkg.path} className="seo-dir-link">
                  {pkg.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category 7: EazeTrip Travel Products */}
        <div className="seo-directory-group">
          <h4 className="seo-group-title">EazeTrip Products</h4>
          <div className="seo-links-inline-grid products-row">
            {seoDirectoryData.eazetripProducts.map((prod, idx) => (
              <Link key={idx} to={prod.path} className="seo-dir-link product-pill">
                {prod.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Category 7: Company Useful Links */}
        <div className="seo-directory-group last-group">
          <h4 className="seo-group-title">Company Useful Links</h4>
          <div className="seo-links-inline-grid">
            {seoDirectoryData.companyUsefulLinks.map((linkItem, idx) => (
              <Link key={idx} to={linkItem.path} className="seo-dir-link">
                {linkItem.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
