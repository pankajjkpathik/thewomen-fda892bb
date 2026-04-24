import { Input } from "@/components/ui/input";

interface Props {
  sizes: string[];
  colors: string[];
  variantStock: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
}

export const variantKey = (size: string, color?: string) => (color ? `${size}|${color}` : size);

const VariantStockEditor = ({ sizes, colors, variantStock, onChange }: Props) => {
  if (sizes.length === 0) {
    return <p className="text-xs text-muted-foreground">Add sizes first to configure per-variant stock.</p>;
  }
  const update = (key: string, value: number) => onChange({ ...variantStock, [key]: Math.max(0, value || 0) });

  if (colors.length === 0) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {sizes.map((s) => (
          <div key={s}>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{s}</label>
            <Input
              type="number"
              min={0}
              value={variantStock[s] ?? 0}
              onChange={(e) => update(s, Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left p-1 text-muted-foreground">Color \ Size</th>
            {sizes.map((s) => <th key={s} className="p-1 text-center text-muted-foreground">{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {colors.map((c) => (
            <tr key={c}>
              <td className="p-1 font-medium">{c}</td>
              {sizes.map((s) => {
                const k = variantKey(s, c);
                return (
                  <td key={k} className="p-1">
                    <Input
                      type="number"
                      min={0}
                      value={variantStock[k] ?? 0}
                      onChange={(e) => update(k, Number(e.target.value))}
                      className="h-7 text-xs w-16"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantStockEditor;
