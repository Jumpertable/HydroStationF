import { SERVER_URL } from "../../constant";

export async function getAllEmployees() {
  const res = await fetch(`${SERVER_URL}/manager/all-employees`);
  return res.json();
}

export async function getEmployeeById(id: number) {
  const res = await fetch(`${SERVER_URL}/manager/employee/${id}`);
  if (!res.ok) throw new Error("Employee not found");
  return res.json();
}

export async function createEmployee(data: any) {
  const res = await fetch(
    `${SERVER_URL}/manager/${data.manager_id}/create-employee`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function updateEmployee(id: number, data: any) {
  const res = await fetch(`${SERVER_URL}/manager/update-employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEmployee(id: number) {
  if (!id) {
    console.error("⚠️ Tried to delete an employee with undefined ID");
    return { message: "Invalid ID" };
  }

  const res = await fetch(`${SERVER_URL}/manager/remove-employee/${id}`, {
    method: "DELETE",
  });

  return res.json();
}
