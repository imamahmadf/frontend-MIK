import { Suspense } from "react";
import UserCard from "./UserCard";
import { fetchUsers } from "@/lib/api/users";

async function UsersContent() {
  const users = await fetchUsers();

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada data users yang ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default function UsersList() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
