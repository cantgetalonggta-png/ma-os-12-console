"""Vercel Python entry — re-export FastAPI app from parent server.py."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from server import app  # noqa: E402
