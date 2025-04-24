'use client';

import { useParams } from 'next/navigation';
import EditProductForm from '@/app/component/EditProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  // Debug it
  console.log("🧩 Params:", params);

  // Safety check
  if (!id || isNaN(Number(id))) {
    return <div className="text-red-500">Invalid Product ID</div>;
  }

  return <EditProductForm productId={parseInt(id as string)} />;
}
