import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CapacitySlider } from "@/components/CapacitySlider";
import { StatusBadge } from "@/components/StatusBadge";
import { saveCommitment, type CapacitySnapshot } from "@/lib/store";

function evaluateCommitment(capacity: CapacitySnapshot): { status: 'keep' | 'kneel' | 'kill'; reasoning: string } {
  const avg = (capacity.sleep + (10 - capacity.stress) + capacity.energy + capacity.emotionalState + (10 - capacity.socialDemand)) / 5;

  if (avg >= 6.5) {
    return { status: 'keep', reasoning: "Your capacity is strong. You have the energy, clarity, and bandwidth to take this on fully. Commit with confidence." };
  }
  if (avg >= 4) {
    return { status: 'kneel', reasoning: "Your capacity is moderate. Consider scaling this down — reduce scope, extend the timeline, or find support before committing." };
  }
  return { status: 'kill', reasoning: "Your capacity is stretched thin. Taking this on risks burnout and poor execution. It's wiser to decline or defer until conditions improve." };
}

export default function NewCommitment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fromDecision?: string; suggestion?: string } | null;

  const [step, setStep] = useState(1);
  const [capacity, setCapacity] = useState<CapacitySnapshot>({
    sleep: 5, stress: 5, energy: 5, emotionalState: 5, socialDemand: 5,
  });
  const [title, setTitle] = useState(state?.suggestion || "");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<{ status: 'keep' | 'kneel' | 'kill'; reasoning: string } | null>(null);
  const [chosenStatus, setChosenStatus] = useState<'keep' | 'kneel' | 'kill' | null>(null);

  const handleEvaluate = () => {
    setResult(evaluateCommitment(capacity));
    setStep(3);
  };

  const handleConfirm = () => {
    const status = chosenStatus || result!.status;
    saveCommitment({
      id: crypto.randomUUID(),
      title,
      description,
      status,
      reasoning: result!.reasoning,
      createdAt: new Date().toISOString(),
    });
    navigate("/");
  };

  const goBack = () => {
    if (step === 1) navigate(-1);
    else setStep(step - 1);
  };

  // Step 1: Capacity Snapshot
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background px-5 pt-4 pb-8">
        <button onClick={goBack} className="flex items-center text-muted-foreground mb-8">
          <ArrowLeft className="w-5 h-5 mr-1" /><span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Capacity Check</h1>
        <p className="text-sm text-muted-foreground mb-8">How are you doing right now? Be honest.</p>
        <div className="space-y-6">
          <CapacitySlider label="Sleep Quality" value={capacity.sleep} onChange={v => setCapacity({ ...capacity, sleep: v })} lowLabel="Terrible" highLabel="Excellent" />
          <CapacitySlider label="Stress Level" value={capacity.stress} onChange={v => setCapacity({ ...capacity, stress: v })} lowLabel="Calm" highLabel="Overwhelmed" />
          <CapacitySlider label="Energy" value={capacity.energy} onChange={v => setCapacity({ ...capacity, energy: v })} lowLabel="Depleted" highLabel="Energized" />
          <CapacitySlider label="Emotional State" value={capacity.emotionalState} onChange={v => setCapacity({ ...capacity, emotionalState: v })} lowLabel="Struggling" highLabel="Thriving" />
          <CapacitySlider label="Social Demand" value={capacity.socialDemand} onChange={v => setCapacity({ ...capacity, socialDemand: v })} lowLabel="Light" highLabel="Heavy" />
        </div>
        <Button className="w-full h-12 mt-8" onClick={() => setStep(2)}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Step 2: Commitment Input
  if (step === 2) {
    return (
      <div className="min-h-screen bg-background px-5 pt-4 pb-8">
        <button onClick={goBack} className="flex items-center text-muted-foreground mb-8">
          <ArrowLeft className="w-5 h-5 mr-1" /><span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Your Commitment</h1>
        <p className="text-sm text-muted-foreground mb-8">What are you considering committing to?</p>
        {state?.fromDecision && (
          <p className="text-xs text-muted-foreground mb-4">From decision: <span className="font-medium text-foreground">{state.fromDecision}</span></p>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Commitment</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Run 3x per week for a month" maxLength={100} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Details (optional)</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Any additional context..." rows={3} maxLength={300} />
          </div>
        </div>
        <Button className="w-full h-12 mt-8" disabled={!title.trim()} onClick={handleEvaluate}>
          Evaluate <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Step 3: Keep/Kneel/Kill Result
  if (step === 3 && result) {
    return (
      <div className="min-h-screen bg-background px-5 pt-4 pb-8">
        <button onClick={goBack} className="flex items-center text-muted-foreground mb-8">
          <ArrowLeft className="w-5 h-5 mr-1" /><span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Recommendation</h1>
        <p className="text-sm text-muted-foreground mb-8">Based on your current capacity:</p>

        <div className="bg-card border border-border rounded-xl p-6 card-shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <StatusBadge status={result.status} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
        </div>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Your Choice</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(['keep', 'kneel', 'kill'] as const).map(s => (
            <button
              key={s}
              onClick={() => setChosenStatus(s)}
              className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                (chosenStatus || result.status) === s
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Button className="w-full h-12" onClick={() => setStep(4)}>
          Confirm Choice <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Step 4: Confirmation
  return (
    <div className="min-h-screen bg-background px-5 pt-4 pb-8 flex flex-col">
      <button onClick={goBack} className="flex items-center text-muted-foreground mb-8">
        <ArrowLeft className="w-5 h-5 mr-1" /><span className="text-sm">Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Confirm Commitment</h1>
        <p className="text-sm text-muted-foreground mb-4">You're choosing to <span className="font-medium text-foreground capitalize">{chosenStatus || result?.status}</span> this commitment:</p>
        <p className="text-base font-medium text-foreground mb-8">{title}</p>
        <StatusBadge status={(chosenStatus || result?.status) as 'keep' | 'kneel' | 'kill'} />
      </div>

      <Button className="w-full h-12" onClick={handleConfirm}>
        <Check className="w-4 h-4 mr-2" />
        Commit
      </Button>
    </div>
  );
}
