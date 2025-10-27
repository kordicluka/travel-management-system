import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Plane, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, DeleteConfirmDialog } from "@/components/common";
import { ListLayout, ListContent, MobileListDrawer } from "@/components/list";
import { Button } from "@/components/ui/button";
import { QUERY_LIMITS } from "@/constants";
import { ROUTE_PATHS } from "@/router/routePaths";
import { useAirports, useDeleteAirport } from "../hooks";
import {
  AirportCardAdapter,
  AirportCardSkeleton,
  AirportListFilters,
} from "../components";
import { AirportMap, type MapBounds } from "@/components/map";
import type { Airport } from "@/types";

export function AirportListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedAirportId, setSelectedAirportId] = useState<string | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);

  // Initialize map bounds from URL params
  const initialBoundsData = (() => {
    const minLat = searchParams.get("minLat");
    const maxLat = searchParams.get("maxLat");
    const minLon = searchParams.get("minLon");
    const maxLon = searchParams.get("maxLon");

    if (minLat && maxLat && minLon && maxLon) {
      return {
        bounds: {
          minLat: parseFloat(minLat),
          maxLat: parseFloat(maxLat),
          minLon: parseFloat(minLon),
          maxLon: parseFloat(maxLon),
        },
        hasInitialBounds: true,
      };
    }
    return { bounds: null, hasInitialBounds: false };
  })();

  // Filter states
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [codeInput, setCodeInput] = useState(
    () => searchParams.get("code") || ""
  );
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [code, setCode] = useState(() => searchParams.get("code") || "");
  const [countries, setCountries] = useState<string[]>(() => {
    const countriesParam = searchParams.get("countries");
    return countriesParam ? countriesParam.split(",").filter(Boolean) : [];
  });

  // Map bounds state
  const [mapBoundsImmediate, setMapBoundsImmediate] =
    useState<MapBounds | null>(initialBoundsData.bounds);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(
    initialBoundsData.bounds
  );
  const [hasUserMovedMap, setHasUserMovedMap] = useState(
    initialBoundsData.hasInitialBounds
  );

  // Debounce search input
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setDisplayLimit(50);
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce code input
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setCode(codeInput);
      setDisplayLimit(50);
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [codeInput]);

  // Debounce map bounds
  useEffect(() => {
    if (!mapBoundsImmediate || !hasUserMovedMap) return;

    setIsFiltering(true);
    const timer = setTimeout(() => {
      setMapBounds(mapBoundsImmediate);
      setDisplayLimit(50);
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [mapBoundsImmediate, hasUserMovedMap]);

  // Sync filters to URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (code) params.set("code", code);
    if (countries.length > 0) params.set("countries", countries.join(","));

    if (mapBounds && hasUserMovedMap) {
      params.set("minLat", mapBounds.minLat.toString());
      params.set("maxLat", mapBounds.maxLat.toString());
      params.set("minLon", mapBounds.minLon.toString());
      params.set("maxLon", mapBounds.maxLon.toString());
    }

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, code, countries, mapBounds, hasUserMovedMap]);

  // Fetch airports
  const { data, isLoading, error } = useAirports({
    page: 1,
    limit: QUERY_LIMITS.ALL_ITEMS,
    sortBy: "name" as const,
    sortOrder: "asc" as const,
    search: search || undefined,
    code: code || undefined,
    country: countries.length > 0 ? countries : undefined,
  });

  const deleteAirport = useDeleteAirport();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteAirport.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleMapMarkerClick = (airport: Airport) => {
    setSelectedAirportId(airport.id);
  };

  const handleMapBoundsChange = useCallback(
    (bounds: MapBounds, isUserInteraction: boolean = true) => {
      const clampedBounds = {
        minLat: Math.max(-90, Math.min(90, bounds.minLat)),
        maxLat: Math.max(-90, Math.min(90, bounds.maxLat)),
        minLon: Math.max(-180, Math.min(180, bounds.minLon)),
        maxLon: Math.max(-180, Math.min(180, bounds.maxLon)),
      };
      setMapBoundsImmediate(clampedBounds);

      if (isUserInteraction && !hasUserMovedMap) {
        setHasUserMovedMap(true);
      }
    },
    [hasUserMovedMap]
  );

  const handleCountriesChange = (value: string[]) => {
    setIsFiltering(true);
    setCountries(value);
    setDisplayLimit(50);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCodeInput("");
    setSearch("");
    setCode("");
    setCountries([]);
    setDisplayLimit(50);
  };

  const hasActiveFilters = Boolean(
    searchInput || codeInput || countries.length > 0
  );

  // Client-side filtering by map bounds
  const allAirports = data?.data || [];
  const filteredAirports = useMemo(() => {
    return allAirports.filter((airport) => {
      if (mapBounds && hasUserMovedMap) {
        return (
          airport.latitude >= mapBounds.minLat &&
          airport.latitude <= mapBounds.maxLat &&
          airport.longitude >= mapBounds.minLon &&
          airport.longitude <= mapBounds.maxLon
        );
      }
      return true;
    });
  }, [allAirports, mapBounds, hasUserMovedMap]);

  const displayedAirports = useMemo(() => {
    return filteredAirports.slice(0, displayLimit);
  }, [filteredAirports, displayLimit]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollPercentage =
        (target.scrollTop + target.clientHeight) / target.scrollHeight;

      if (
        scrollPercentage > 0.8 &&
        displayLimit < filteredAirports.length &&
        !isLoading
      ) {
        setDisplayLimit((prev) => prev + 50);
      }
    },
    [displayLimit, filteredAirports.length, isLoading]
  );

  const listContentProps = {
    items: displayedAirports,
    isLoading,
    isFiltering,
    error,
    hasActiveFilters,
    CardComponent: AirportCardAdapter,
    SkeletonComponent: AirportCardSkeleton,
    emptyIcon: Plane,
    emptyTitle: "No airports found",
    emptyDescription: "Get started by creating your first airport",
    emptyWithFiltersDescription: "No airports match your filters",
    entityName: "airports",
    emptyAction: (
      <Button onClick={() => navigate(ROUTE_PATHS.AIRPORT_NEW)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Airport
      </Button>
    ),
    emptyWithFiltersAction: (
      <Button variant="outline" onClick={handleClearFilters}>
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    ),
    onDelete: setDeleteId,
    selectedItemId: selectedAirportId,
    onScroll: handleScroll,
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="All Airports"
        action={
          <Button onClick={() => navigate(ROUTE_PATHS.AIRPORT_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Airport
          </Button>
        }
      />

      <AirportListFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        codeInput={codeInput}
        onCodeChange={setCodeInput}
        countries={countries}
        onCountriesChange={handleCountriesChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Desktop: Resizable Split View */}
      <ListLayout
        listContent={<ListContent {...listContentProps} />}
        mapContent={
          <AirportMap
            airports={filteredAirports}
            selectedAirportId={selectedAirportId}
            initialBounds={initialBoundsData.bounds}
            onAirportClick={handleMapMarkerClick}
            onBoundsChange={handleMapBoundsChange}
          />
        }
      />

      {/* Mobile: Map with drawer */}
      <div className="lg:hidden flex-1 relative h-full">
        <div className="absolute inset-0">
          <AirportMap
            airports={filteredAirports}
            selectedAirportId={selectedAirportId}
            onAirportClick={handleMapMarkerClick}
            onBoundsChange={handleMapBoundsChange}
          />
        </div>

        <MobileListDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          title="Airports List"
          itemCount={filteredAirports.length}
          className="relative z-50"
        >
          <ListContent {...listContentProps} />
        </MobileListDrawer>
      </div>

      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Airport"
        description={
          <>
            Are you sure you want to delete this airport?
            <br />
            <br />
            <span className="text-destructive font-semibold">
              Warning: This will also permanently delete all routes associated
              with this airport.
            </span>
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        isLoading={deleteAirport.isPending}
      />
    </div>
  );
}
