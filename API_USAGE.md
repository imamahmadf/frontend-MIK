# 🔌 Penggunaan API dengan Axios

Dokumen ini menjelaskan cara menggunakan API dengan axios di proyek ini.

## 📦 Instalasi

Axios sudah terinstall di proyek ini. Jika perlu install ulang:

```bash
npm install axios
```

## 🏗️ Struktur API

```
src/
├── lib/
│   ├── axios.ts          # Axios instance dengan konfigurasi
│   └── api/
│       └── users.ts      # API functions untuk users
└── app/
    └── users/            # Halaman yang menggunakan API
        ├── page.tsx      # List users
        ├── loading.tsx   # Loading state
        ├── error.tsx      # Error handling
        └── [id]/
            └── page.tsx  # Detail user
```

## 🔧 Axios Instance

File `src/lib/axios.ts` berisi konfigurasi axios instance yang bisa digunakan di seluruh aplikasi.

### Konfigurasi Default

```typescript
import apiClient from "@/lib/axios";

// Base URL bisa diatur via environment variable
// NEXT_PUBLIC_API_URL=https://api.example.com
```

### Request Interceptor

Digunakan untuk menambahkan header (seperti auth token) ke setiap request:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Digunakan untuk handle error global:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error di sini
    return Promise.reject(error);
  }
);
```

## 📝 Membuat API Function

Contoh membuat API function di `src/lib/api/users.ts`:

```typescript
import apiClient from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  // ... fields lainnya
}

// GET - Fetch semua users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Gagal memuat data users");
  }
}

// GET - Fetch user by ID
export async function fetchUserById(id: number): Promise<User> {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw new Error(`Gagal memuat data user dengan ID ${id}`);
  }
}

// POST - Create user
export async function createUser(userData: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.post<User>("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Gagal membuat user");
  }
}

// PUT - Update user
export async function updateUser(
  id: number,
  userData: Partial<User>
): Promise<User> {
  try {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw new Error(`Gagal mengupdate user dengan ID ${id}`);
  }
}

// DELETE - Delete user
export async function deleteUser(id: number): Promise<void> {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw new Error(`Gagal menghapus user dengan ID ${id}`);
  }
}
```

## 🎯 Menggunakan di Server Component (Next.js App Router)

Di Next.js 14 dengan App Router, gunakan Server Components untuk fetch data:

```typescript
// src/app/users/page.tsx
import { fetchUsers } from "@/lib/api/users";

export default async function UsersPage() {
  // Fetch data langsung di Server Component
  const users = await fetchUsers();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Dengan Loading State

```typescript
// src/app/users/page.tsx
import { Suspense } from "react";
import UsersList from "@/components/users/UsersList";

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersList />
    </Suspense>
  );
}

// src/components/users/UsersList.tsx
import { fetchUsers } from "@/lib/api/users";

export default async function UsersList() {
  const users = await fetchUsers();
  // Render users
}
```

### Dengan Error Handling

```typescript
// src/app/users/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Terjadi Kesalahan</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Coba Lagi</button>
    </div>
  );
}
```

## 💻 Menggunakan di Client Component

Untuk fetch data di Client Component (misalnya dengan useEffect):

```typescript
"use client";

import { useState, useEffect } from "react";
import { fetchUsers, type User } from "@/lib/api/users";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🌐 Environment Variables

Untuk mengatur base URL API, buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

Kemudian gunakan di `src/lib/axios.ts`:

```typescript
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com",
  // ...
});
```

## 🔐 Authentication

### Menambahkan Token ke Request

Update interceptor di `src/lib/axios.ts`:

```typescript
apiClient.interceptors.request.use((config) => {
  // Untuk Client Component
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### Refresh Token

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/auth/refresh", {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem("token", token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
```

## 📊 Contoh Halaman yang Sudah Dibuat

### 1. Halaman Users List (`/users`)

- **File**: `src/app/users/page.tsx`
- **API**: `fetchUsers()` dari `src/lib/api/users.ts`
- **Fitur**:
  - Server Component dengan async data fetching
  - Loading state dengan Suspense
  - Error handling dengan error.tsx
  - SEO metadata

### 2. Halaman User Detail (`/users/[id]`)

- **File**: `src/app/users/[id]/page.tsx`
- **API**: `fetchUserById(id)` dari `src/lib/api/users.ts`
- **Fitur**:
  - Dynamic routing
  - Dynamic metadata untuk SEO
  - 404 handling

## 🧪 Testing API

### Manual Testing

1. Jalankan development server:

```bash
npm run dev
```

2. Akses halaman:

- `http://localhost:3000/users` - List users
- `http://localhost:3000/users/1` - Detail user

### Mock API

Proyek ini menggunakan [JSONPlaceholder](https://jsonplaceholder.typicode.com) sebagai contoh API. Untuk production, ganti dengan API Anda sendiri.

## 💡 Best Practices

1. **Gunakan TypeScript interfaces** untuk type safety
2. **Handle errors dengan baik** - jangan biarkan error tidak tertangani
3. **Gunakan Server Components** untuk data fetching di Next.js 14
4. **Implement loading states** untuk UX yang lebih baik
5. **Gunakan environment variables** untuk API URLs
6. **Implement retry logic** untuk network errors
7. **Cache responses** jika memungkinkan (React Query, SWR, dll)

## 🔄 Alternatif: React Query / SWR

Untuk aplikasi yang lebih kompleks, pertimbangkan menggunakan:

- [TanStack Query (React Query)](https://tanstack.com/query)
- [SWR](https://swr.vercel.app/)

Keduanya menyediakan caching, revalidation, dan fitur lainnya.

## 📚 Referensi

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
