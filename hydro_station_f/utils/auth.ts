// utils/auth.ts

export const saveCustomerSession = (cusID: number, cusName: string) => {
  localStorage.setItem("cusID", cusID.toString());
  localStorage.setItem("cusName", cusName);
};

export const getCustomerID = (): number | null => {
  const id = localStorage.getItem("cusID");
  return id ? parseInt(id, 10) : null;
};

export const getCustomerName = (): string | null => {
  return localStorage.getItem("cusName");
};

export const clearCustomerSession = () => {
  localStorage.removeItem("cusID");
  localStorage.removeItem("cusName");
};
