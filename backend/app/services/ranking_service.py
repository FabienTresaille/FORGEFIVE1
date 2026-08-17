# Placeholder for ranking_service logic, calculate estimated 1RM
def calculate_1rm(weight: float, reps: int) -> float:
    return weight * (1 + (reps / 30))

def get_rank_tier(ratio: float) -> str:
    if ratio < 0.40:
        return "bronze"
    elif ratio < 0.55:
        return "argent"
    elif ratio < 0.70:
        return "or"
    elif ratio < 0.85:
        return "platine"
    return "diamant"
