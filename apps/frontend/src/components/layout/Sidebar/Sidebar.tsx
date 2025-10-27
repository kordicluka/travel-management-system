import { Link, useLocation } from 'react-router-dom';
import { Plane, Building2, Route } from 'lucide-react';
import { ROUTE_PATHS } from '@/router/routePaths';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Airports',
    href: ROUTE_PATHS.AIRPORTS,
    icon: Plane,
  },
  {
    name: 'Airlines',
    href: ROUTE_PATHS.AIRLINES,
    icon: Building2,
  },
  {
    name: 'Routes',
    href: ROUTE_PATHS.ROUTES,
    icon: Route,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-20 flex-col items-center bg-white border-r py-6 space-y-6">
      {navigation.map((item) => {
        const isActive = location.pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors',
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        );
      })}
    </aside>
  );
}
