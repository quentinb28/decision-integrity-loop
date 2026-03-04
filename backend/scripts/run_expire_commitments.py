import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.jobs.expire_commitments import expire_commitments

if __name__ == "__main__":
    expire_commitments()
