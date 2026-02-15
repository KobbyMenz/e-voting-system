import hashlib
import os

def generate_salt():
    return os.urandom(16).hex()

def hash_vote(voter_id: int, candidate_id: int, salt: str) -> str:
    raw = f"{voter_id}:{candidate_id}:{salt}"
    return hashlib.sha256(raw.encode()).hexdigest()
