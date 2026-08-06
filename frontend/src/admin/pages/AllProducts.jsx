import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
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
} from "react"

const AllProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

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
      const text = `${product.name} ${product.category}`.toLowerCase();
      return text.includes(searchValue);
    });
  }, [products, searchValue]);



 const {
  totalPages,
  currentProducts,
  indexOfFirstProduct,
  indexOfLastProduct,
} = useMemo(() => {
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const page = Math.min(currentPage, totalPages || 1);

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

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
}, [filteredProducts, currentPage, productsPerPage]);

 

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
    <div className="min-h-screen bg-[#F5F7FB] p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-500">Manage all products</p>
        </div>
        <Link
          to="/admin/add-product"
          className="bg-[#06A1B7] text-white px-5 py-3 rounded-xl flex items-center gap-2 justify-center hover:bg-[#04889b]"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#06A1B7]"
          />
        </div>
      </div>

      {currentProducts.length === 0 ? (
        <div className="w-full flex items-center justify-center py-20">
          <h2 className="text-center w-full">No Products Found</h2>
        </div>
      ) : (
        <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left">Product</th>
                <th className="text-left">Category</th>
                <th className="text-left">Price</th>
                <th className="text-left">Stock</th>
                <th className="text-left">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
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
      )}

      <div className="lg:hidden space-y-4">
        {currentProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={handleDelete}
          />
        ))}
      </div>

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
