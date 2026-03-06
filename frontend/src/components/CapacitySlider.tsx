import { Slider } from "@/components/ui/slider";

interface CapacitySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

export function CapacitySlider({ label, value, onChange, lowLabel = "Low", highLabel = "High" }: CapacitySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">{lowLabel}</span>
        <span className="text-xs text-muted-foreground">{highLabel}</span>
      </div>
    </div>
  );
}
