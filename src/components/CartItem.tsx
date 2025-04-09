import Image from "next/image";
import { useCart, CartItem as CartItemType } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex py-6 border-b border-gray-200 last:border-b-0">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">${item.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <label
              htmlFor={`quantity-${item.id}`}
              className="mr-2 text-gray-500"
            >
              Qty:
            </label>
            <select
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="rounded border border-gray-300 py-1 px-2"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="font-medium text-red-600 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="mt-1 text-right text-sm font-medium text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
