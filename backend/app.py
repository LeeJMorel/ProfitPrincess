from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from config import API_KEY

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests from React

BASE_URL = "https://financialmodelingprep.com/api/v3"

@app.route('/fetch-data', methods=['GET'])
def fetch_data():
    endpoint = request.args.get('endpoint')
    query = request.args.get('query', '')
    
    # Construct the URL depending on whether there is a query parameter
    if query:
        url = f"{BASE_URL}/{endpoint}?{query}&apikey={API_KEY}"
    else:
        url = f"{BASE_URL}/{endpoint}?apikey={API_KEY}"

    # Make the request to the external API
    response = requests.get(url)
    data = response.json()

    return jsonify(data)

@app.route('/filter-data', methods=['POST'])
def filter_data():
    data = request.json.get('data', [])

    # Apply filtering logic

    # Apply sorting logic

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
