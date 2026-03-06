import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const recommendations = [
  "Commit fully — schedule it and protect the time",
  "Trial run — try it for 7 days before fully committing",
  "Delegate — find someone better suited and support them",
  "Defer — revisit in 2 weeks with fresh perspective",
  "Decline — say no clearly and move on",
];

export default function NewDecision() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [context, setContext] = useState({ title: "", description: "" });

  const canProceed = context.title.trim().length > 0;

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background px-5 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground mb-8">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-semibold text-foreground mb-2">New Decision</h1>
        <p className="text-sm text-muted-foreground mb-8">What's the decision you're facing?</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Decision Title
            </label>
            <Input
              value={context.title}
              onChange={e => setContext({ ...context, title: e.target.value })}
              placeholder="e.g. Should I take the new job offer?"
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Context
            </label>
            <Textarea
              value={context.description}
              onChange={e => setContext({ ...context, description: e.target.value })}
              placeholder="Describe the situation, stakes, and any constraints..."
              rows={4}
              maxLength={500}
            />
          </div>
        </div>

        <Button className="w-full h-12 mt-8" disabled={!canProceed} onClick={() => setStep(2)}>
          See Recommendations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-5 pt-4">
      <button onClick={() => setStep(1)} className="flex items-center text-muted-foreground mb-8">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-semibold text-foreground mb-2">Recommended Commitments</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Based on your decision: <span className="font-medium text-foreground">{context.title}</span>
      </p>

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <button
            key={i}
            onClick={() => navigate("/commitment/new", { state: { fromDecision: context.title, suggestion: rec } })}
            className="w-full text-left bg-card border border-border rounded-xl p-4 card-shadow hover:card-shadow-elevated transition-shadow"
          >
            <p className="text-sm font-medium text-foreground">{rec}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
