import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/router/routePaths';
import { UserMenu } from '../UserMenu';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link to={ROUTE_PATHS.HOME} className="flex items-center">
          <span className="text-xl font-bold text-foreground">TravelHub</span>
        </Link>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
