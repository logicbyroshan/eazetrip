import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';

export default function HelpDeskWidget() {
  return (
    <div className="helpdesk-floating-hub">
      <Link
        to="/helpdesk"
        id="helpdesk-launcher-btn"
        className="helpdesk-launcher-btn"
        aria-label="24/7 Help Desk"
        title="24/7 Help Desk & Problem Resolution"
      >
        <div className="helpdesk-icon-wrap">
          <Headphones size={20} />
          <span className="helpdesk-pulse-dot" />
        </div>
        <span className="helpdesk-btn-text">24/7 Help Desk</span>
      </Link>
    </div>
  );
}
