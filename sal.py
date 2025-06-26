"""SAL: The Initiation Protocol - Minimal MVP implementation."""

from __future__ import annotations

from typing import Dict, List, Optional
from dataclasses import dataclass, field


# 1. Task data structure
@dataclass
class Task:
    id: str
    title: str
    task_type: str  # e.g., 'info', 'real_world', 'social', 'creative'
    description: str
    traits: List[str]


# 2. User profile
@dataclass
class AgentProfile:
    user_id: str
    traits: Dict[str, float] = field(
        default_factory=lambda: {
            "empathy": 0.0,
            "leadership": 0.0,
            "exploration": 0.0,
            "attention": 0.0,
            "creativity": 0.0,
            "decision_quality": 0.0,
        }
    )

    def update_traits(self, trait_scores: Dict[str, float]) -> None:
        for trait, score in trait_scores.items():
            if trait in self.traits:
                self.traits[trait] += score


# 3. Task pool definition
TASK_POOL: Dict[str, Task] = {
    "s1-msg": Task(
        id="s1-msg",
        title="İlk Mesaj",
        task_type="info",
        description="QR koddan gelen ilk mektubu oku.",
        traits=["curiosity"],
    ),
    "s2-trace": Task(
        id="s2-trace",
        title="Kayıp Oda",
        task_type="real_world",
        description="Mekansal içindeki objeyi bul.",
        traits=["attention", "exploration"],
    ),
    "s3-connection": Task(
        id="s3-connection",
        title="Ortak Görev",
        task_type="social",
        description="Başka biriyle görev çöz.",
        traits=["empathy", "teamwork"],
    ),
    "s4-reflection": Task(
        id="s4-reflection",
        title="Yansıtma",
        task_type="creative",
        description="Bir içgörü üret ve paylaş.",
        traits=["creativity", "self-awareness"],
    ),
}


# 4. Signal handler with simple rules

def handle_signal(signal: Dict[str, str]) -> Optional[Task]:
    """Return a task based on the incoming signal."""
    hour = int(signal.get("hour", "12"))
    keyword = signal.get("keyword", "").lower()
    location = signal.get("location", "").lower()

    if "mekansal" in location and 9 <= hour <= 17:
        return TASK_POOL.get("s2-trace")
    if keyword == "ayna":
        return TASK_POOL.get("s4-reflection")
    if keyword == "qr" or signal.get("type") == "qr":
        return TASK_POOL.get("s1-msg")
    return None


# 5. Trait evaluation helper

def evaluate_task_completion(profile: AgentProfile, task: Task) -> None:
    """Update user profile when a task is completed."""
    # For now simply add 1.0 for each trait associated with the task
    trait_scores = {trait: 1.0 for trait in task.traits}
    profile.update_traits(trait_scores)


if __name__ == "__main__":
    # Example usage
    agent = AgentProfile(user_id="player1")
    signal_data = {"type": "qr", "hour": "14"}
    received_task = handle_signal(signal_data)

    if received_task:
        print(f"Görev: {received_task.title} - {received_task.description}")
        evaluate_task_completion(agent, received_task)
        print("Güncel özellikler:", agent.traits)
    else:
        print("Sinyal için uygun görev bulunamadı.")
