import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

function CollectionPage() {
  const dispatch = useDispatch();
  const { collection } = useParams(); // category or collection from route param
  const [searchParams] = useSearchParams(); // filter values from URL
  const queryParams = Object.fromEntries([...searchParams]);

  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //console.log(collection, searchParams);

  // Fetch products from DB whenever filter or category changes
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  // Close sidebar on outside click
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center rounded">
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* Sidebar filter (mobile + desktop) */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
        <FilterSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">
          {collection ? `${collection} Collection` : "All Collections"}
        </h2>

        {/* Sort dropdown */}
        <SortOptions />

        {/* Product grid */}

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default CollectionPage;
