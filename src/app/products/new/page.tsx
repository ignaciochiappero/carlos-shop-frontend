//front-new\src\app\products\new\page.tsx

import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Product
        </h1>
        <ProductForm />
      </div>
    </div>
  );
}