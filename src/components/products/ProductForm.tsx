//front-new\src\components\products\ProductForm.tsx

"use client"

import type { Product, CreateProductDto, UpdateProductDto } from "@/types/product"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRouter } from "next/navigation"
import { productsApi } from "@/lib/api"
import ImageUploader from "./ImageUploader"
import { useState } from "react"

const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").min(0, "Price must be greater than or equal to 0"),
  image: yup.string().optional(), // Hacer que la imagen sea opcional
})

interface ProductFormProps {
  product?: Product
  isEditing?: boolean
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(product?.image || "")
  const [imageKey, setImageKey] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...product,
      image: "", // We'll handle the image separately
    },
  })

  const onSubmit = async (data: Omit<CreateProductDto | UpdateProductDto, "image">) => {
    try {
      // Construir el objeto de producto
      const productData: any = {
        ...data,
      };
      
      // Solo agregar imagen si existe y no está vacía
      if (imageUrl && imageUrl.trim() !== '') {
        productData.image = imageUrl;
      }
  
      if (isEditing && product) {
        await productsApi.update(product.id, productData);
      } else {
        await productsApi.create(productData as CreateProductDto);
      }
      
      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + (error instanceof Error ? error.message : String(error)));
    }
  }
  

  const handleImageChange = (url: string) => {
    setImageUrl(url)
    setValue("image", url)
  }

  const handleImageKeyChange = (key: string) => {
    setImageKey(key)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <ImageUploader
          initialImage={product?.image}
          onImageChange={handleImageChange}
          onImageKeyChange={handleImageKeyChange}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          {...register("price")}
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {isEditing ? "Update" : "Create"} Product
        </button>
      </div>
    </form>
  )
}

