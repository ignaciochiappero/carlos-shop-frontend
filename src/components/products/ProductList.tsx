import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        {initialProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900">
              No products found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div
        id="notification"
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 opacity-0 flex items-center"
      >
        <svg
          className="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        Product added to cart!
      </div>
    </div>
  );
}
