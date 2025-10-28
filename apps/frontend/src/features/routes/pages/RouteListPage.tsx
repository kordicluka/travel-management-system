import { useState, useEffect, useCallback } from "react";
import { Plus, X, Plane } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, DeleteConfirmDialog } from "@/components/common";
import { ListLayout, ListContent, MobileListDrawer } from "@/components/list";
import { Button } from "@/components/ui/button";
import { routePaths } from "@/router/routePaths";
import { useRoutes, useDeleteRoute } from "../hooks";
import {
  RouteCardAdapter,
  RouteCardSkeleton,
  RouteListFilters,
} from "../components";
import { RouteMap } from "@/components/map";
import type { RouteResponse } from "@/types";

export function RouteListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [page, setPage] = useState(1);
  const [accumulatedRoutes, setAccumulatedRoutes] = useState<RouteResponse[]>(
    []
  );

  // Filter states
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [fromAirportId, setFromAirportId] = useState<string | undefined>(
    () => searchParams.get("fromAirportId") || undefined
  );
  const [toAirportId, setToAirportId] = useState<string | undefined>(
    () => searchParams.get("toAirportId") || undefined
  );
  const [airlineIds, setAirlineIds] = useState<string[]>(() => {
    const airlinesParam = searchParams.get("airlineId");
    return airlinesParam ? airlinesParam.split(",").filter(Boolean) : [];
  });

  const ITEMS_PER_PAGE = 20;

  // Debounce search input
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync filters to URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (fromAirportId) params.set("fromAirportId", fromAirportId);
    if (toAirportId) params.set("toAirportId", toAirportId);
    if (airlineIds.length > 0) params.set("airlineId", airlineIds.join(","));

    setSearchParams(params, { replace: true });
  }, [page, search, fromAirportId, toAirportId, airlineIds, setSearchParams]);

  // Fetch routes
  const { data, isLoading, error } = useRoutes({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
    search: search || undefined,
    fromAirportId: fromAirportId || undefined,
    toAirportId: toAirportId || undefined,
    airlineId: airlineIds.length > 0 ? airlineIds.join(",") : undefined,
    include: ["fromAirport", "toAirport", "airline"],
  });

  // Accumulate routes
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAccumulatedRoutes(data.data);
      } else {
        setAccumulatedRoutes((prev) => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, fromAirportId, toAirportId, airlineIds]);

  const deleteRoute = useDeleteRoute();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteRoute.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleMapRouteClick = (route: RouteResponse) => {
    setSelectedRouteId(route.id);
  };

  const handleFromAirportChange = (value: string | undefined) => {
    setIsFiltering(true);
    setFromAirportId(value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleToAirportChange = (value: string | undefined) => {
    setIsFiltering(true);
    setToAirportId(value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleAirlinesChange = (value: string[]) => {
    setIsFiltering(true);
    setAirlineIds(value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setFromAirportId(undefined);
    setToAirportId(undefined);
    setAirlineIds([]);
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchInput || fromAirportId || toAirportId || airlineIds.length > 0
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollPercentage =
        (target.scrollTop + target.clientHeight) / target.scrollHeight;

      const hasMore = data?.meta && page < data.meta.lastPage;

      if (scrollPercentage > 0.8 && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [page, data?.meta, isLoading]
  );

  const listContentProps = {
    items: accumulatedRoutes,
    isLoading,
    isFiltering,
    error,
    hasActiveFilters,
    CardComponent: RouteCardAdapter,
    SkeletonComponent: RouteCardSkeleton,
    emptyIcon: Plane,
    emptyTitle: "No routes found",
    emptyDescription: "Get started by creating your first route",
    emptyWithFiltersDescription: "No routes match your filters",
    entityName: "routes",
    emptyAction: (
      <Button onClick={() => navigate(routePaths.routeNew())}>
        <Plus className="mr-2 h-4 w-4" />
        Add Route
      </Button>
    ),
    emptyWithFiltersAction: (
      <Button variant="outline" onClick={handleClearFilters}>
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    ),
    onDelete: setDeleteId,
    selectedItemId: selectedRouteId,
    onScroll: handleScroll,
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="All Routes"
        action={
          <Button onClick={() => navigate(routePaths.routeNew())}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Route
          </Button>
        }
      />

      <RouteListFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        fromAirportId={fromAirportId}
        onFromAirportChange={handleFromAirportChange}
        toAirportId={toAirportId}
        onToAirportChange={handleToAirportChange}
        airlineIds={airlineIds}
        onAirlinesChange={handleAirlinesChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Desktop: Resizable Split View */}
      <ListLayout
        listContent={<ListContent {...listContentProps} />}
        mapContent={
          <RouteMap
            routes={accumulatedRoutes}
            selectedRouteId={selectedRouteId}
            onRouteClick={handleMapRouteClick}
          />
        }
      />

      {/* Mobile: Map with drawer */}
      <div className="lg:hidden flex-1 relative h-full">
        <div className="w-full h-full">
          <RouteMap
            routes={accumulatedRoutes}
            selectedRouteId={selectedRouteId}
            onRouteClick={handleMapRouteClick}
          />
        </div>

        <MobileListDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          title="Routes List"
          itemCount={accumulatedRoutes.length}
        >
          <ListContent {...listContentProps} />
        </MobileListDrawer>
      </div>
      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        isLoading={deleteRoute.isPending}
      />
    </div>
  );
}
