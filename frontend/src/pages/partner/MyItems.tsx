import { useEffect, useState, FormEvent } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import api from "../../api/axiosInstance";
import { Product, PartnerProfile } from "../../types";
import { productPlaceholder } from "../../utils/image";
import { partnerNavItems } from "./partnerNav";
import { generateProductListing } from "../../api/assistantApi";

export default function MyItems() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [aiHint, setAiHint] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const loadData = () => {
    api.get<PartnerProfile>("/partners/me").then((res) => setProfile(res.data)).catch(() => {});
    // Partner-scoped product listing isn't in the base scaffold yet —
    // see the note in productController.ts for the addition needed.
    api.get<Product[]>("/products/mine").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/products", { title, description, price: Number(price), imageUrl: imageUrl || undefined });
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    loadData();
  };

  const handleGenerateWithAi = async () => {
    if (!aiHint.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const listing = await generateProductListing(aiHint.trim());
      setTitle(listing.title);
      setDescription(listing.description);
    } catch {
      setAiError("Couldn't generate a listing right now. Try rephrasing or fill it in manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  return (
    <DashboardShell panelLabel="Partner panel" subLabel={profile?.storeName} items={partnerNavItems}>
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="fs-3 fw-bold text-navy-900">My items</h1>
          <p className="text-slate-500 mb-0">{profile?.storeName ?? "Your store"}</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <form onSubmit={handleSubmit} className="rounded-xl2 bg-white p-4 shadow-card">
            <h2 className="mb-3 fw-bold text-navy-900">Add new item</h2>

            <div className="mb-3 rounded-3 bg-brand-50 p-3">
              <span className="mb-1 d-flex align-items-center gap-1 fw-semibold text-brand-700" style={{ fontSize: ".8rem" }}>
                <i className="bi bi-stars" aria-hidden="true" />
                Not sure how to describe it? Let AI write it
              </span>
              <div className="d-flex gap-2 mt-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="e.g. grilled chicken plate with rice and garlic sauce"
                  value={aiHint}
                  onChange={(e) => setAiHint(e.target.value)}
                  disabled={aiLoading}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-brand flex-shrink-0"
                  onClick={handleGenerateWithAi}
                  disabled={aiLoading || !aiHint.trim()}
                >
                  {aiLoading ? "..." : "Generate"}
                </button>
              </div>
              {aiError && <p className="mt-2 mb-0 text-danger" style={{ fontSize: ".75rem" }}>{aiError}</p>}
            </div>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Image URL</span>
              <input
                className="form-control"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <span className="text-slate-400" style={{ fontSize: ".75rem" }}>
                Leave blank to use a placeholder photo.
              </span>
            </label>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Item title</span>
              <input className="form-control" placeholder="e.g. Grilled Kafta Plate" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Short description</span>
              <textarea className="form-control" rows={3} placeholder="Brief description of the item..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <label className="mb-4 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Price ($)</span>
              <input type="number" step="0.01" className="form-control" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>

            <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold">
              Save item
            </button>
          </form>
        </div>

        <div className="col-lg-8">
          <h2 className="mb-3 fw-bold text-navy-900">Published items ({products.length})</h2>
          <div className="row row-cols-2 row-cols-sm-3 g-3">
            {products.length === 0 && (
              <p className="small text-slate-400">
                No items yet — add your first one on the left.
              </p>
            )}
            {products.map((p) => (
              <div className="col" key={p._id}>
                <div className="overflow-hidden rounded-xl2 bg-white shadow-card h-100">
                  <div style={{ height: "6rem" }}>
                    <img
                      src={p.imageUrl || productPlaceholder(p.title)}
                      alt={p.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="fw-bold text-navy-900 mb-1">{p.title}</p>
                    {p.description && <p className="small text-slate-500 mb-0">{p.description}</p>}
                    <p className="mt-1 fw-bold text-brand-600">${p.price.toFixed(2)}</p>
                    <div className="mt-2 d-flex gap-2">
                      <button className="btn d-flex align-items-center gap-1 rounded-3 border-0 bg-brand-50 text-brand-700 fw-semibold hover-bg-brand-100 py-1 px-2" style={{ fontSize: ".75rem" }}>
                        <i className="ti ti-pencil" aria-hidden="true" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="btn d-flex align-items-center gap-1 rounded-3 border-0 bg-red-50 text-red-600 fw-semibold hover-bg-red-100 py-1 px-2" style={{ fontSize: ".75rem" }}>
                        <i className="ti ti-trash" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
