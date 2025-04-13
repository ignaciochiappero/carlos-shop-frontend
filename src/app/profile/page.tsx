//front-new\src\app\profile\page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { usersApi } from "@/lib/api";
import { User } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const { user: storeUser, setUser, isAuthenticated } = useAuthStore();
  const [user, setLocalUser] = useState<User | null>(storeUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
  });
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    // Verificación de autenticación con mejor manejo de errores
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      console.log('No hay token, mostrando mensaje de login');
      setError("Por favor inicia sesión para ver tu perfil");
      setLoading(false);
      // No redirigimos para permitir ver el mensaje de error
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Intentando obtener perfil de usuario...");
        
        const userData = await usersApi.getProfile();
        
        console.log("Perfil obtenido:", userData);
        
        if (userData) {
          setLocalUser(userData);
          setUser(userData);
          setFormData({
            userName: userData.userName || "",
          });
          
          // Verificar si estamos usando datos de prueba
          if (userData.id === "test-user-id" || userData.id === "test-id") {
            setUsingMockData(true);
            console.log("Usando datos de prueba");
          } else {
            setUsingMockData(false);
          }
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        
        // Manejo de error específico
        if ((error as any)?.response?.status === 401) {
          setError("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
          localStorage.removeItem('access_token');
        } else if ((error as any)?.response?.status === 500) {
          setError("Error en el servidor. Por favor intenta más tarde.");
        } else {
          setError("No pudimos cargar tu perfil. Por favor intenta de nuevo.");
        }
        
        // Usar datos de demostración como fallback
        setLocalUser({
          id: "demo-user",
          email: "demo@example.com",
          userName: "Usuario Demo",
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          cognitoId: "demo-cognito-id"
        });
        
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const updatedUser = await usersApi.updateProfile({
        userName: formData.userName,
      });
      
      setLocalUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);
      setSuccess("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("No pudimos actualizar tu perfil. Por favor intenta de nuevo.");
    }
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-700 to-purple-700">
        <div className="text-white text-2xl">Cargando perfil...</div>
      </div>
    );
  }

  // Mostrar mensaje para iniciar sesión si no hay usuario y hay error
  if (!user && error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-700 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Acceso al perfil
            </h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
              {usingMockData && (
                <div className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                  Modo Vista Previa
                </div>
              )}
              <Link 
                href="/"
                className="text-white hover:text-indigo-100 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            
            {usingMockData && (
              <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                Estás viendo datos de demostración. Es posible que necesites iniciar sesión para ver tu perfil real.
                <div className="mt-2">
                  <Link 
                    href="/login"
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Ir al login
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="relative w-32 h-32 rounded-full bg-indigo-200 flex items-center justify-center">
                      <span className="text-4xl text-indigo-600 font-bold">
                        {user?.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800">{user?.userName}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user?.role}
                    </span>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setEditing(!editing)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                      disabled={usingMockData}
                    >
                      {editing ? "Cancelar" : "Editar Perfil"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                {editing ? (
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Editar Información</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="userName" className="block text-gray-700 font-medium mb-2">
                          Nombre de Usuario
                        </label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">ID de Usuario</h4>
                        <p className="text-gray-800">{user?.id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Nombre de Usuario</h4>
                        <p className="text-gray-800">{user?.userName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Correo Electrónico</h4>
                        <p className="text-gray-800">{user?.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Rol</h4>
                        <p className="text-gray-800">{user?.role}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Fecha de Registro</h4>
                        <p className="text-gray-800">
                          {user?.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString() 
                            : 'No disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones rápidas */}
                <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Ver Productos
                    </Link>
                    <Link
                      href="/cart"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Mi Carrito
                    </Link>
                    <Link
                      href="/wishlist"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Mi Lista de Deseos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}