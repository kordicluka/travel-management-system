import { Link, useLocation } from "react-router-dom";
import { Plane, Building2, Route, User } from "lucide-react";
import { ROUTE_PATHS } from "@/router/routePaths";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Airports",
    href: ROUTE_PATHS.AIRPORTS,
    icon: Plane,
  },
  {
    name: "Airlines",
    href: ROUTE_PATHS.AIRLINES,
    icon: Building2,
  },
  {
    name: "Routes",
    href: ROUTE_PATHS.ROUTES,
    icon: Route,
  },
  {
    name: "Profile",
    href: ROUTE_PATHS.PROFILE,
    icon: User,
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
