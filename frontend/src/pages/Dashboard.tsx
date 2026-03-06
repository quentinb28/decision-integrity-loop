import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { getIdentityAnchor, getCommitments, getFollowThroughRate, type Commitment } from "@/lib/store";
import logo from "@/assets/logo.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(getIdentityAnchor());
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    setIdentity(getIdentityAnchor());
    setCommitments(getCommitments());
    setRate(getFollowThroughRate());
  }, []);

  const activeCommitments = commitments.filter(c => !c.completedAt).slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-6 px-6">
        <img src={logo} alt="The Decision Muscle" className="w-16 h-16 rounded-2xl object-cover mb-3" />
        <h1 className="text-xl font-semibold text-foreground">The Decision Muscle</h1>
      </div>

      {/* Cards */}
      <div className="flex-1 px-5 space-y-4">
        {/* Identity Anchor Card */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Identity Anchor</p>
          {identity ? (
            <div className="space-y-1.5">
              {identity.values.slice(0, 3).map((v, i) => (
                <p key={i} className="text-sm font-medium text-foreground">{v}</p>
              ))}
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-1"
              onClick={() => navigate("/identity")}
            >
              Create Identity Anchor
            </Button>
          )}
        </div>

        {/* Active Commitments Card */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Active Commitments</p>
          {activeCommitments.length > 0 ? (
            <div className="space-y-3">
              {activeCommitments.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate mr-3">{c.title}</span>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active commitments yet.</p>
          )}
        </div>

        {/* Follow-through Rate Card */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Follow-through Rate</p>
          <p className="text-4xl font-bold text-foreground">{rate}%</p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-5 py-6 flex gap-3">
        <Button
          className="flex-1 h-12 text-sm font-medium"
          onClick={() => navigate("/decision/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Decision
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12 text-sm font-medium"
          onClick={() => navigate("/commitment/new")}
        >
          <Target className="w-4 h-4 mr-2" />
          New Commitment
        </Button>
      </div>
    </div>
  );
}
