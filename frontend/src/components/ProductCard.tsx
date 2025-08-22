export default function ProductCard({ p }:{ p:any }) {
  return (
    <div className="border rounded p-3 flex flex-col">
      <img src={p.imageUrl} alt={p.name} className="h-32 object-contain mb-2"/>
      <div className="font-medium">{p.name}</div>
      <div className="text-sm text-gray-600">{p.brand}</div>
      <div className="mt-auto">
        <div className="font-semibold">₹{p.price}</div>
        <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded">Add</button>
      </div>
    </div>
  );
}
