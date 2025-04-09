import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-image.png",
    });

    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.remove("opacity-0");
      notification.classList.add("opacity-100");
      setTimeout(() => {
        notification.classList.remove("opacity-100");
        notification.classList.add("opacity-0");
      }, 3000);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <div className="relative h-full w-full">
          <Image
            src={product.image || "/placeholder-image.png"}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover object-center group-hover:opacity-75"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.png";
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </div>
    </Link>
  );
}
