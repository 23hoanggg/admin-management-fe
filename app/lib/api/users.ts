import { authClient } from "../auth-client";

export interface CreateUserInput {
  email: string;
  password: string;
  username: string;
  name: string;
  role: "user";
}

export interface UpdateUserInput {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface ListUsersParams {
  currentPage: number;
  pageSize: number;
}

export async function listUsers({ currentPage, pageSize }: ListUsersParams) {
  const { data, error } = await authClient.admin.listUsers({
    query: {
      filterField: "role",
      filterValue: "user",
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      sortBy: "name",
      sortDirection: "desc",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function banUser(userId: string) {
  const { data, error } = await authClient.admin.banUser({
    userId,
    banReason: "Banned by admin",
  });

  console.log("data:", data);
  console.log("error:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function unbanUser(userId: string) {
  const { data, error } = await authClient.admin.unbanUser({
    userId,
  });

  console.log("data:", data);
  console.log("error:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function impersonateUser(userId: string) {
  const { data, error } = await authClient.admin.impersonateUser({
    userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function stopImpersonateUser() {
  const { data, error } = await authClient.admin.stopImpersonating();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function removeUser(userId: string) {
  const { data: deletedUser, error } = await authClient.admin.removeUser({
    userId,
  });
  if (error) {
    throw new Error(error.message);
  }

  return deletedUser;
}

export async function getUser(userId: string) {
  const { data, error } = await authClient.admin.getUser({
    query: {
      id: userId,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function setRole(userId: string) {
  const { data, error } = await authClient.admin.setRole({
    userId,
    role: "admin",
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  const updateData: Record<string, string> = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.username !== undefined) updateData.username = input.username;
  if (input.email !== undefined) updateData.email = input.email;

  if (Object.keys(updateData).length > 0) {
    const { error } = await authClient.admin.updateUser({
      userId,
      data: updateData,
    });
    if (error) throw new Error(error.message);
  }

  if (input.password && input.password.trim() !== "") {
    const { error: pwdError } = await authClient.admin.setUserPassword({
      userId,
      newPassword: input.password,
    });
    if (pwdError) throw new Error(pwdError.message);
  }
}

export async function createUser(input: CreateUserInput) {
  const { data, error } = await authClient.admin.createUser({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role,
    data: {
      username: input.username,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
