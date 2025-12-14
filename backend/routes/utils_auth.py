import requests
import jwt
from flask import request, abort

JWKS_URL = "https://bfmeoiqguvnuwttckklf.supabase.co/auth/v1/.well-known/jwks.json"

cached_jwks = None

def get_jwks():
    global cached_jwks
    if cached_jwks is None:
        cached_jwks = requests.get(JWKS_URL).json()
    return cached_jwks

def get_public_key(token):
    jwks = get_jwks()
    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]

    for key in jwks["keys"]:
        if key["kid"] == kid:
            return jwt.algorithms.ECAlgorithm.from_jwk(key)

    raise Exception("Key not found")

def get_user_id_from_request():

    if request.method == "OPTIONS":
        return None

    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        abort(401, "Missing Bearer token")

    token = auth.split(" ")[1]

    try:
        public_key = get_public_key(token)
        decoded = jwt.decode(token, public_key, algorithms=["ES256"], options={"verify_aud": False})
        return decoded["sub"]
    except Exception as e:
        print("JWT verification error:", e)
        abort(401, "Invalid token")
