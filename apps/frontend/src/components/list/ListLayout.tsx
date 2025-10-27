import { type ReactNode } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface ListLayoutProps {
  /** Left panel content (list of items) */
  listContent: ReactNode;

  /** Right panel content (usually a map) */
  mapContent: ReactNode;

  /** Default size for list panel (0-100) */
  defaultListSize?: number;

  /** Minimum size for list panel (0-100) */
  minListSize?: number;

  /** Default size for map panel (0-100) */
  defaultMapSize?: number;

  /** Minimum size for map panel (0-100) */
  minMapSize?: number;
}

/**
 * Reusable layout for list pages with resizable split view
 * Used by: AirportListPage, RouteListPage
 *
 * @example
 * ```tsx
 * <ListLayout
 *   listContent={<div>List content here</div>}
 *   mapContent={<AirportMap airports={airports} />}
 *   defaultListSize={45}
 *   defaultMapSize={55}
 * />
 * ```
 */
export function ListLayout({
  listContent,
  mapContent,
  defaultListSize = 45,
  minListSize = 30,
  defaultMapSize = 55,
  minMapSize = 30,
}: ListLayoutProps) {
  return (
    <div className="hidden lg:block flex-1 overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-h-[calc(100vh-15rem)]"
      >
        <ResizablePanel
          defaultSize={defaultListSize}
          minSize={minListSize}
          className="h-full overflow-y-auto"
        >
          {listContent}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultMapSize} minSize={minMapSize}>
          <div className="h-full p-4 overflow-y-hidden">{mapContent}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
