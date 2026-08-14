import { Search, Plus, Inbox } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "../../shared/components/Loader";
import {
  deleteProductThunk,
  getProductsThunk,
} from "../../slice/product/productThunk";
import { useDispatch, useSelector } from "react-redux";
import ProductRow from "../components/ProductRow";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

const PRODUCTS_PER_PAGE = 8;

const AllProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  const deferredSearch = useDeferredValue(search);
  const searchValue = deferredSearch.trim().toLowerCase();

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch]);

  const filteredProducts = useMemo(() => {
    if (!searchValue) return products;
    return products.filter((product) => {
      const text = `${product.name} ${product.category} ${product.subCategory || ""}`.toLowerCase();
      return text.includes(searchValue);
    });
  }, [products, searchValue]);

  const {
    totalPages,
    currentProducts,
    indexOfFirstProduct,
    indexOfLastProduct,
  } = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const page = Math.min(currentPage, totalPages || 1);

    const indexOfLastProduct = page * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;

    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

    return {
      totalPages,
      currentProducts,
      indexOfFirstProduct,
      indexOfLastProduct,
    };
  }, [filteredProducts, currentPage]);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Product?",
        text: "You won't be able to recover this product.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Delete",
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-xl font-bold px-5 py-2.5',
          cancelButton: 'rounded-xl font-bold px-5 py-2.5'
        }
      });

      if (!result.isConfirmed) return;

      try {
        await dispatch(deleteProductThunk(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error?.message ?? "Failed to delete product");
      }
    },
    [dispatch],
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  if (isLoading) {
    return <Loader text="Loading Products..." />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-950">All Products</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">Manage your inventory, pricing, and stock items</p>
        </div>

        <Link
          to="/admin/add-product"
          className="w-full sm:w-auto bg-[#06A1B7] hover:bg-[#058a9d] text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm font-bold text-xs md:text-sm active:scale-95 shrink-0"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={handleSearch}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#06A1B7] text-xs sm:text-sm text-gray-800 placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 p-12 text-center my-6">
          <div className="w-16 h-16 bg-cyan-50 text-[#06A1B7] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Inbox size={28} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">No Products Found</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Try searching with a different keyword or filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden border border-gray-100 mb-6">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="text-left p-4 md:px-6">Image</th>
                  <th className="text-left p-4 md:px-6">Product</th>
                  <th className="text-left p-4 md:px-6">Category</th>
                  <th className="text-left p-4 md:px-6">Price</th>
                  <th className="text-left p-4 md:px-6">Stock</th>
                  <th className="text-left p-4 md:px-6">Status</th>
                  <th className="text-center p-4 md:px-6">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-sm">
                {currentProducts.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Responsive Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden mb-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination Component */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={filteredProducts.length}
        />
      )}
    </div>
  );
};

export default AllProducts;