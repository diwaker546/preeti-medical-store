import Link from 'next/link';

export default function AdminHome(){
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-3">Admin</h1>
      <div className="space-y-3">
        <Link href="/admin/orders"><a className="text-green-700">Orders</a></Link>
        <Link href="/admin/upload"><a className="text-green-700">Upload Product</a></Link>
      </div>
    </div>
  );
}
