//front-new\src\components\products\ImageUploader.tsx
"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageKeyChange?: (imageKey: string) => void;
}





export default function ImageUploader({
  initialImage,
  onImageChange,
  onImageKeyChange,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });

  
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };


  




  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
    return false; // Este retorno es opcional en las versiones más recientes
  }, []);

 // Mejora de la función getCroppedImg para depuración
const getCroppedImg = useCallback(() => {
  if (
    !imgRef.current ||
    !completedCrop ||
    !previewCanvasRef.current ||
    !originalFile
  ) {
    console.error("Falta información para recortar:", {
      imgRef: !!imgRef.current,
      completedCrop: !!completedCrop,
      canvas: !!previewCanvasRef.current,
      originalFile: !!originalFile
    });
    return null;
  }

  try {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    console.log("Información de recorte:", {
      imgWidth: image.width,
      imgHeight: image.height,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      cropWidth: crop.width,
      cropHeight: crop.height,
      cropX: crop.x,
      cropY: crop.y
    });

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("No se pudo obtener el contexto 2D del canvas");
      return null;
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("No se pudo generar blob desde canvas");
          reject(new Error("Error al generar la imagen recortada"));
          return;
        }
        
        console.log("Blob generado correctamente:", {
          size: blob.size,
          type: blob.type
        });
        
        const file = new File([blob], originalFile.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      }, "image/jpeg", 0.95); // Calidad 0.95 para JPEG
    });
  } catch (error) {
    console.error("Error al procesar la imagen recortada:", error);
    return null;
  }
}, [completedCrop, originalFile]);

  // Reemplaza solo la función uploadImage con esta versión
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError(null);
  
    try {
      console.log("Preparando archivo para subir:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const formData = new FormData();
      formData.append("file", file);
      
      // CORRECCIÓN CRUCIAL: Asegurar que la URL siempre tenga el formato correcto con /api/
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      // Asegurar que la URL base no termine con barra
      const cleanBaseUrl = baseUrl.endsWith('/') 
        ? baseUrl.slice(0, -1) 
        : baseUrl;
      
      // Construir la URL completa asegurándose de que /api/ esté presente
      const apiUrl = cleanBaseUrl.includes('/api') 
        ? cleanBaseUrl 
        : `${cleanBaseUrl}/api`;
        
      const uploadUrl = `${apiUrl}/files/upload`;
      
      console.log(`Enviando archivo a: ${uploadUrl}`);
      
      const token = localStorage.getItem("access_token");
      console.log(`Token presente: ${token ? 'Sí' : 'No'}`);
  
      // Paso 1: Subir el archivo
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // El resto de tu código para procesar la respuesta...
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
        console.log("Respuesta de subida parseada:", data);
      } catch (e) {
        console.error("Error al parsear respuesta como JSON:", responseText);
        throw new Error(`Error en formato de respuesta: ${responseText}`);
      }
  
      if (!response.ok) {
        console.error("Error en la respuesta de subida:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(`Error al subir imagen: ${response.status} ${response.statusText}`);
      }
  
      // Verificar que tenemos fileKey en la respuesta
      if (!data.fileKey) {
        console.error("Respuesta de subida sin fileKey:", data);
        throw new Error("No se recibió fileKey en la respuesta");
      }
      
      // Usar la URL de la respuesta si está disponible
      let imageUrl = data.url;
      
      // Si no hay URL en la respuesta, intentar obtenerla
      if (!imageUrl) {
        console.log("URL no incluida en respuesta, intentando obtenerla...");
        try {
          const urlResponse = await fetch(
            `${apiUrl}/files/url/${data.fileKey}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!urlResponse.ok) {
            const errorText = await urlResponse.text();
            console.error("Error al obtener URL:", errorText);
            // Construir URL manualmente como fallback
            const cloudName = "dtlh7gy1p"; // Tu cloud_name de Cloudinary
            imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${data.fileKey}`;
          } else {
            const urlData = await urlResponse.json();
            imageUrl = urlData.url;
          }
        } catch (urlError) {
          console.error("Error al obtener URL:", urlError);
          // Fallback a URL manual
          const cloudName = "dtlh7gy1p";
          imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${data.fileKey}`;
        }
      }
      
      if (!imageUrl) {
        console.error("No se pudo obtener la URL de la imagen");
        throw new Error("No se pudo obtener la URL de la imagen");
      }
  
      console.log("URL final de la imagen:", imageUrl);
      
      // Actualizar estado y notificar
      setImage(imageUrl);
      setImageKey(data.fileKey);
      onImageChange(imageUrl);
      if (onImageKeyChange) {
        onImageKeyChange(data.fileKey);
      }
      
      console.log("Imagen subida exitosamente:", {
        url: imageUrl,
        fileKey: data.fileKey
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al subir imagen";
      setError(errorMessage);
      console.error("Error al subir imagen:", err);
    } finally {
      setIsUploading(false);
      setShowCropper(false);
    }
  };

  const handleCropComplete = (crop: Crop) => {
    setCompletedCrop(crop);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalFile(null);
  };

  const handleCropConfirm = async () => {
    if (!completedCrop) {
      setShowCropper(false);
      return;
    }

    try {
      const croppedFile = await getCroppedImg();
      if (croppedFile) {
        await uploadImage(croppedFile);
      } else {
        setError("No se pudo generar la imagen recortada");
        setShowCropper(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la imagen"
      );
      setShowCropper(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageKey) {
      setImage(null);
      onImageChange("");
      return;
    }

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      console.log(`Eliminando imagen: ${apiUrl}/files/${imageKey}`);

      const response = await fetch(`${apiUrl}/files/${imageKey}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al eliminar imagen:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(
          `Failed to delete image: ${response.status} ${response.statusText}`
        );
      }

      setImage(null);
      setImageKey(null);
      onImageChange("");
      if (onImageKeyChange) {
        onImageKeyChange("");
      }

      console.log("Imagen eliminada exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      console.error("Error al eliminar imagen:", err);
    }
  };

  // Limpiar el input de archivo después de seleccionar
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [originalFile]);

  return (
    <div className="space-y-4">
      {/* Área de carga de imagen */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
        {image ? (
          <div className="w-full flex flex-col items-center">
            <img
              src={image}
              alt="Product"
              className="max-h-64 object-contain mb-4 rounded-md"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  Cambiar
                </span>
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm border border-red-300 rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50"
                onClick={handleRemoveImage}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Eliminar
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <div className="mt-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                Subir imagen del producto
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif"
          onChange={onSelectFile}
        />
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {isUploading && (
        <div className="text-blue-500 text-sm mt-1">Subiendo imagen...</div>
      )}

      {/* Modal de recorte de imagen */}
      {showCropper && originalFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recortar imagen</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCropCancel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
              >
                <img
                  src={URL.createObjectURL(originalFile)}
                  onLoad={(e) => onImageLoaded(e.currentTarget)}
                  className="max-h-[400px] object-contain"
                />
              </ReactCrop>
              <canvas ref={previewCanvasRef} className="hidden" />
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={handleCropCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={handleCropConfirm}
              >
                Aplicar recorte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
