import os
from pathlib import Path
import sys
import uvicorn

# Ensure workspace root is in sys.path and PYTHONPATH for multiprocessing reloader
root_dir = str(Path(__file__).resolve().parent.parent)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

existing_pythonpath = os.environ.get("PYTHONPATH", "")
if root_dir not in existing_pythonpath:
    os.environ["PYTHONPATH"] = f"{root_dir}{os.pathsep}{existing_pythonpath}" if existing_pythonpath else root_dir

if __name__ == "__main__":
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        app_dir=root_dir
    )
