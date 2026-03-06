import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveIdentityAnchor } from "@/lib/store";

export default function IdentityAnchor() {
  const navigate = useNavigate();
  const [values, setValues] = useState(["", "", ""]);

  const updateValue = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    setValues(next);
  };

  const canSave = values.some(v => v.trim().length > 0);

  const handleSave = () => {
    const filtered = values.filter(v => v.trim().length > 0);
    if (filtered.length === 0) return;
    saveIdentityAnchor({ values: filtered, createdAt: new Date().toISOString() });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background px-5 pt-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground mb-8">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-semibold text-foreground mb-2">Identity Anchor</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Define your top 3 core values. These guide every decision you make.
      </p>

      <div className="space-y-4">
        {values.map((v, i) => (
          <div key={i}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Value {i + 1}
            </label>
            <Input
              value={v}
              onChange={e => updateValue(i, e.target.value)}
              placeholder={["e.g. Integrity", "e.g. Growth", "e.g. Family"][i]}
              maxLength={50}
            />
          </div>
        ))}
      </div>

      <Button className="w-full h-12 mt-8" disabled={!canSave} onClick={handleSave}>
        Save Identity Anchor
      </Button>
    </div>
  );
}
