
from fastapi import FastAPI

app = FastAPI(title="E-Voting System API")

@app.get("/api/health")
def health_check():
    return {"status": "Backend running successfully"}
