from schemas.capacity_snapshot import CapacitySnapshotCreate

def compute_capacity_score(snapshot: CapacitySnapshotCreate) -> int:
    
    positive = (
        snapshot.sleep_quality +
        snapshot.energy_level +
        snapshot.emotional_state
    )

    negative = (
        6 - snapshot.stress_level +
        6 - snapshot.social_demand
    )

    total_score = positive + negative  # max = 25, min = 5

    capacity_score = int(((total_score - 5) / 20) * 100)

    return max(1, min(capacity_score, 100))
