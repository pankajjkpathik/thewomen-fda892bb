import { useState } from "react";
import { useAdminProducts } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImageGallery from "@/components/admin/ProductImageGallery";
import VariantStockEditor from "@/components/admin/VariantStockEditor";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const categoryOptions = ["Kurtis", "Ethnic Dresses", "Co-ord Sets", "Tailor Made", "New Arrivals", "Best Sellers"];

const emptyProduct = {
  name: "", slug: "", description: "", price: 0, original_price: null as number | null,
  category: "Kurtis", fabric: "", fit: "", occasion: "", sizes: [] as string[],
  colors: [] as string[], images: [] as string[], default_image_index: 0,
  care_instructions: "", is_new: false, is_best_seller: false, in_stock: true,
  stock_quantity: 0, variant_stock: {} as Record<string, number>,
  seo_title: "", seo_description: "",
};

const AdminProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const handleOpen = (product?: typeof products[0]) => {
    if (product) {
      setEditId(product.id);
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : null,
        category: product.category,
        fabric: product.fabric || "",
        fit: product.fit || "",
        occasion: product.occasion || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
        default_image_index: (product as any).default_image_index || 0,
        care_instructions: product.care_instructions || "",
        is_new: product.is_new || false,
        is_best_seller: product.is_best_seller || false,
        in_stock: product.in_stock ?? true,
        stock_quantity: product.stock_quantity || 0,
        variant_stock: ((product as any).variant_stock as Record<string, number>) || {},
        seo_title: (product as any).seo_title || "",
        seo_description: (product as any).seo_description || "",
      });
    } else {
      setEditId(null);
      setForm(emptyProduct);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.price) {
      toast.error("Name, slug, and price are required");
      return;
    }
    const payload = {
      ...form,
      price: form.price,
      original_price: form.original_price || undefined,
    };
    const error = editId
      ? await updateProduct(editId, payload)
      : await addProduct(payload);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editId ? "Product updated" : "Product added");
      setOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteProduct(id);
    if (error) toast.error(error.message);
    else toast.success("Product deleted");
  };

  const updateField = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl lg:text-3xl">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => handleOpen()}>
              <Plus size={16} /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background">
            <DialogHeader>
              <DialogTitle className="font-heading">{editId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="font-body text-sm">
              <TabsList className="w-full">
                <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
                <TabsTrigger value="stock" className="flex-1">Stock</TabsTrigger>
                <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="grid grid-cols-2 gap-4 pt-4">
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Slug *</label>
                  <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="e.g. teal-silk-kurti" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                  <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Price *</label>
                  <Input type="number" value={form.price} onChange={(e) => updateField("price", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Original Price</label>
                  <Input type="number" value={form.original_price || ""} onChange={(e) => updateField("original_price", e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fabric</label>
                  <Input value={form.fabric} onChange={(e) => updateField("fabric", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fit</label>
                  <Input value={form.fit} onChange={(e) => updateField("fit", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Occasion</label>
                  <Input value={form.occasion} onChange={(e) => updateField("occasion", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Sizes (comma-separated)</label>
                  <Input value={form.sizes.join(", ")} onChange={(e) => updateField("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Colors (comma-separated)</label>
                  <Input value={form.colors.join(", ")} onChange={(e) => updateField("colors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Care Instructions</label>
                  <Input value={form.care_instructions} onChange={(e) => updateField("care_instructions", e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_new} onCheckedChange={(v) => updateField("is_new", v)} />
                  <span>New Arrival</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_best_seller} onCheckedChange={(v) => updateField("is_best_seller", v)} />
                  <span>Best Seller</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.in_stock} onCheckedChange={(v) => updateField("in_stock", v)} />
                  <span>In Stock (master toggle)</span>
                </div>
              </TabsContent>

              <TabsContent value="images" className="pt-4">
                <ProductImageGallery
                  images={form.images}
                  defaultIndex={form.default_image_index}
                  onChange={(images, defaultIndex) => setForm((p) => ({ ...p, images, default_image_index: defaultIndex }))}
                />
              </TabsContent>

              <TabsContent value="stock" className="pt-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Total Stock Quantity (fallback if no per-variant stock set)</label>
                  <Input type="number" value={form.stock_quantity} onChange={(e) => updateField("stock_quantity", Number(e.target.value))} className="max-w-xs" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Per-Variant Stock — overrides total when populated</p>
                  <VariantStockEditor
                    sizes={form.sizes}
                    colors={form.colors}
                    variantStock={form.variant_stock}
                    onChange={(v) => updateField("variant_stock", v)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="pt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">SEO Title (max 60 chars)</label>
                  <Input value={form.seo_title} maxLength={60} onChange={(e) => updateField("seo_title", e.target.value)} placeholder={`${form.name} | The Women`} />
                  <span className="text-[10px] text-muted-foreground">{form.seo_title.length}/60</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">SEO Description (max 160 chars)</label>
                  <Textarea value={form.seo_description} maxLength={160} onChange={(e) => updateField("seo_description", e.target.value)} rows={3} placeholder="Short, search-friendly description shown on Google" />
                  <span className="text-[10px] text-muted-foreground">{form.seo_description.length}/160</span>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="hero" onClick={handleSubmit}>{editId ? "Update" : "Add"} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-body">
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-2">Product</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Stock</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[(p as any).default_image_index || 0] || p.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{p.category}</td>
                  <td className="py-3 px-2">₹{Number(p.price).toLocaleString()}</td>
                  <td className="py-3 px-2">{p.stock_quantity}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded ${p.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {p.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpen(p)} className="text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
