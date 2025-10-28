import { type ReactNode } from "react";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileListDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;

  /** Callback when drawer open state changes */
  onOpenChange: (open: boolean) => void;

  /** Title for the drawer */
  title: string;

  /** Content to display in the drawer */
  children: ReactNode;

  /** Total count of items to show on the button */
  itemCount: number;

  /** Label for the button (e.g., "View List") */
  buttonLabel?: string;

  /** Optional className for the DrawerContent */
  className?: string;
}

/**
 * Reusable mobile drawer component for list pages
 * Shows a floating button that opens a bottom drawer with list content
 *
 * @example
 * ```tsx
 * <MobileListDrawer
 *   isOpen={isDrawerOpen}
 *   onOpenChange={setIsDrawerOpen}
 *   title="Airports List"
 *   itemCount={filteredAirports.length}
 *   buttonLabel="View List"
 * >
 *   <ListContent {...listContentProps} />
 * </MobileListDrawer>
 * ```
 */
export function MobileListDrawer({
  isOpen,
  onOpenChange,
  title,
  children,
  itemCount,
  buttonLabel = "View List",
}: MobileListDrawerProps) {
  return (
    <>
      {" "}
      <div className="absolute bottom-0 w-full z-999">
        {/* Floating button to open drawer */}
        {!isOpen && (
          <Button
            className="fixed bottom-22 right-6 shadow-lg z-999"
            size="lg"
            onClick={() => onOpenChange(true)}
          >
            <List className="mr-2 h-5 w-5" />
            {buttonLabel} ({itemCount})
          </Button>
        )}

        {/* Drawer with list content */}
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent className={"h-1/2 z-999"}>
            <DrawerHeader>
              <DrawerTitle className="text-2xl">{title}</DrawerTitle>
            </DrawerHeader>

            <div className="mt-4 px-4 overflow-auto">{children}</div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
