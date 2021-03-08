'''
Basic Flask Server.
'''
from flask import Flask, request
from flask_cors import CORS
from main import find
app = Flask(__name__)

CORS(app) # deal with those pesky CORS errors

@app.route('/')
def index():
    query = request.args.get("q")
    restrict = request.args.get("t")
    if not query:
        return {"res":"false","data":"no query"}
    print(query)
    return find(query,restrict)

app.run('0.0.0.0')