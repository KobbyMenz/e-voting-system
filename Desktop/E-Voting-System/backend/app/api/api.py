from fastapi import APIRouter
from app.api.routes import auth
from app.api.routes import elections
from app.api.routes import voting
from app.api.routes import results


api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(voting.router)
api_router.include_router(results.router)
api_router.include_router(elections.router)