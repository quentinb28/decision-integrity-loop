import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from routes.identity import identity_routes

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure the database URI (update this for your DB setup)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///local.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Register Blueprints for routing
app.register_blueprint(identity_routes)

# Define the main route
@app.route('/')
def home():
    return "Welcome to the Decision Integrity Loop Prototype API!"

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

from flask import Flask, request, jsonify
import os
import openai

app = Flask(__name__)

def extract_values(anchor_text, openai_api_key):
    openai.api_key = openai_api_key
    prompt = (
        f"""Given the following identity anchor: '{anchor_text}', 
        which 5 values from the list 
        (Security, Belonging, Autonomy, Achievement, Status, 
        Integrity, Growth, Contribution, Pleasure, Meaning) 
        are most relevant?"""
    )
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    values = response['choices'][0]['message']['content'].strip().split(', ')
    return values

@app.route('/api/extract-values', methods=['POST'])
def get_values():
    data = request.json
    values = extract_values(data['anchor'], os.getenv('OPENAI_API_KEY'))  # Ensure the API key is set in your environment
    return jsonify({"values": values})

# Run the application
if __name__ == '__main__':
    app.run(debug=True)

