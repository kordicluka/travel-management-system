import { useState, useEffect, useCallback } from "react";
import { Plus, X, Building2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, DeleteConfirmDialog } from "@/components/common";
import { ListContent } from "@/components/list";
import { Button } from "@/components/ui/button";
import { routePaths } from "@/router/routePaths";
import { useAirlines, useDeleteAirline } from "../hooks";
import {
  AirlineCardAdapter,
  AirlineCardSkeleton,
  AirlineListFilters,
} from "../components";
import type { AirlineResponse } from "@/types";

export function AirlineListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [page, setPage] = useState(1);
  const [accumulatedAirlines, setAccumulatedAirlines] = useState<
    AirlineResponse[]
  >([]);

  // Filter states
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [baseCountries, setBaseCountries] = useState<string[]>(() => {
    const countriesParam = searchParams.get("baseCountry");
    return countriesParam ? countriesParam.split(",").filter(Boolean) : [];
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
    if (baseCountries.length > 0)
      params.set("baseCountry", baseCountries.join(","));

    setSearchParams(params, { replace: true });
  }, [page, search, baseCountries, setSearchParams]);

  // Fetch airlines
  const { data, isLoading, error } = useAirlines({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: "name" as const,
    sortOrder: "asc" as const,
    search: search || undefined,
    baseCountry: baseCountries.length > 0 ? baseCountries.join(",") : undefined,
    include: ["servicedAirports", "operatedRoutes"],
  });

  // Accumulate airlines
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAccumulatedAirlines(data.data);
      } else {
        setAccumulatedAirlines((prev) => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, baseCountries]);

  const deleteAirline = useDeleteAirline();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteAirline.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBaseCountriesChange = (value: string[]) => {
    setIsFiltering(true);
    setBaseCountries(value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setBaseCountries([]);
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchInput || baseCountries.length > 0);
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

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="All Airlines"
        action={
          <Button onClick={() => navigate(routePaths.airlineNew())}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Airline
          </Button>
        }
      />

      <AirlineListFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        baseCountries={baseCountries}
        onBaseCountriesChange={handleBaseCountriesChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="flex-1 overflow-hidden">
        <ListContent
          items={accumulatedAirlines}
          isLoading={isLoading}
          isFiltering={isFiltering}
          error={error}
          hasActiveFilters={hasActiveFilters}
          CardComponent={AirlineCardAdapter}
          SkeletonComponent={AirlineCardSkeleton}
          emptyIcon={Building2}
          emptyTitle="No airlines found"
          emptyDescription="Get started by creating your first airline"
          emptyWithFiltersDescription="No airlines match your filters"
          entityName="airlines"
          emptyAction={
            <Button onClick={() => navigate(routePaths.airlineNew())}>
              <Plus className="mr-2 h-4 w-4" />
              Add Airline
            </Button>
          }
          emptyWithFiltersAction={
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          }
          onDelete={setDeleteId}
          onScroll={handleScroll}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </div>

      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Airline"
        description={
          <>
            Are you sure you want to delete this airline?
            <br />
            <br />
            <span className="text-destructive font-semibold">
              Warning: This will also permanently delete all routes operated by
              this airline.
            </span>
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        isLoading={deleteAirline.isPending}
      />
    </div>
  );
}
