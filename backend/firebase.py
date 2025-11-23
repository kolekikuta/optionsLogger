import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("optionslogger-a2981-firebase-adminsdk-fbsvc-17a44ab510.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://optionslogger-"
})

ref = db.reference()
