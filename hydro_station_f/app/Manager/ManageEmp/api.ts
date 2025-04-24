import { SERVER_URL } from "../../constant";

export async function getEmployees(managerId: number) {
  const res = await fetch(`${SERVER_URL}/${managerId}/employees`);
  return res.json();
}

export async function createEmployee(data: any) {
  const res = await fetch(`${SERVER_URL}/${data.manager_id}/create-employee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEmployee(id: number, data: any) {
  const res = await fetch(`${SERVER_URL}/update-employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEmployee(id: number) {
  const res = await fetch(`${SERVER_URL}/remove-employee/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
