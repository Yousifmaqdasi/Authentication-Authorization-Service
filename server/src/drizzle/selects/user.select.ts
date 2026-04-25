import { usersTable } from "../../models/users.schema";

export  const userFields = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
};
