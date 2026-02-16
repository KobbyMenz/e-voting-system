from fastapi import FastAPI, WebSocket
from app.api.api import api_router
from core.database import Base, engine
from app.api.ws.live import websocket_endpoint

app = FastAPI(title="E-Voting System API")

@app.websocket("/ws/live")
async def live_results(websocket: WebSocket):
    await websocket_endpoint(websocket)

Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix="/api")
