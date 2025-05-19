"use client"; // For tRPC hooks and UserForm

import { useState } from "react";
import { Container } from "../../components/layout/Container"; // Relative path
import { Stack } from "../../components/layout/Stack"; // Relative path
import { UserForm } from "../../components/forms/UserForm"; // Relative path
import { DataGrid, type ColumnDef } from "../../components/ui/DataGrid"; // Relative path
import { Button } from "../../components/ui/Button"; // Relative path
import { trpc } from "../../lib/trpc/client"; // Relative path
import type { AppRouter } from "../../api/index"; // Relative path
import type { inferRouterOutputs } from "@trpc/server";
import type { CellContext } from "@tanstack/react-table";
import { PlusCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"; // Relative path

// Infer User type using inferRouterOutputs
type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput["user"]["list"][number];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: CellContext<User, unknown>) => <div className="truncate w-20">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }: CellContext<User, unknown>) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  // Add more columns as needed, e.g., actions
];

export default function UserManagementPage() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const userListQuery = trpc.user.list.useQuery();
  const utils = trpc.useUtils();

  const handleUserCreated = () => {
    utils.user.list.invalidate(); // Refetch user list after creation
    setIsCreateUserModalOpen(false); // Close modal
  };

  return (
    <Container size="xl" className="py-8"> {/* Changed maxWidth to size */}
      <Stack gap="lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Stack direction="row" gap="sm">
            <Button
              variant="outline"
              onClick={() => userListQuery.refetch()}
              disabled={userListQuery.isFetching}
              leftIcon={<RefreshCw className={`w-4 h-4 ${userListQuery.isFetching ? 'animate-spin' : ''}`} />}
            >
              {userListQuery.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
              <DialogTrigger asChild>
                <Button leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <UserForm onSuccess={handleUserCreated} />
              </DialogContent>
            </Dialog>
          </Stack>
        </div>

        {userListQuery.isLoading && <p>Loading users...</p>}
        {userListQuery.error && (
          <p className="text-red-500">Error loading users: {userListQuery.error.message}</p>
        )}
        {userListQuery.data && (
          <DataGrid
            columns={columns}
            data={userListQuery.data}
            // Optional: Add pagination, sorting, filtering props if implemented in DataGrid
          />
        )}
      </Stack>
    </Container>
  );
}
