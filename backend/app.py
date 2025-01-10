from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from config import API_KEY
import csv

"""
This app is designed for low user count as it retrieves the income statements 
every time a company is called and it also does not hold more than one 
company income statement at a time. 

This is because our dashboard currently only showcases one company.

To scale up possible options include exploring bulk income statements 
to reduce total API calls, or adding to an array as each income statement 
is fetched to create a temporary database for simple comparative analysis.

Filters and sorting are individual methods for future maintainability and testing.
"""

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

BASE_URL = "https://financialmodelingprep.com"

bulk_profiles = []
current_income = []  # Stores the currently selected company's income statement

@app.before_request
def load_company_profiles():
    """Load company profiles on the first request."""
    if not bulk_profiles:
        # Fetch and cache the profiles if not in cache
        fetch_profiles()

def fetch_profiles():
    """Fetch bulk company profiles and store them."""
    global bulk_profiles
    try:
        profile_url = f"{BASE_URL}/stable/profile-bulk?part=0&apikey={API_KEY}"
        response = requests.get(profile_url)

        if response.status_code == 200:
            # Parse the CSV content
            csv_data = response.text.splitlines()
            reader = csv.DictReader(csv_data)
            bulk_profiles = [row for row in reader]  # Convert to list of dictionaries
            print(f"Fetched {len(bulk_profiles)} company profiles.")
            return bulk_profiles
        else:
            print("Failed to fetch company profiles.")
            return []
    except Exception as e:
        print(f"Error fetching company profiles: {e}")
        return []

@app.route('/fetch-data', methods=['GET'])
def fetch_data():
    """Fetch company data by symbol."""
    symbol = request.args.get('query')  # The company symbol

    if not bulk_profiles:
        fetch_profiles()

    # Find the company by symbol from the pre-loaded profiles
    company = next((profile for profile in bulk_profiles if profile['symbol'].strip() == symbol.strip()), None)
    if company:
        print(f"Fetched {company} profile.")
        return jsonify(company), 200
    else:
        return jsonify({"error": "Company not found"}), 404
    
@app.route('/fetch-income', methods=['GET'])
def fetch_income():
    """Fetch income statement for a specific company."""
    global current_income
    symbol = request.args.get('query')  # The company symbol
    
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400

    try:
        income_statement_url = f"{BASE_URL}/api/v3/income-statement/{symbol}?period=annual&apikey={API_KEY}"
        response = requests.get(income_statement_url)
        
        if response.status_code == 200:
            current_income = response.json()
            print(f"Income statement for {symbol} successfully loaded.")
            return jsonify(current_income), 200
        else:
            print(f"Failed to fetch income statement for {symbol}.")
            return jsonify({"error": "Failed to fetch income statement"}), 404
    except Exception as e:
        print(f"Error fetching income statement: {e}")
        return jsonify({"error": "Internal server error"}), 500

def filter_by_date_range(data, start_year, end_year):
    """
    Filter income statement data by date range.
    
    Args:
        data (list): List of income statements (dicts).
        start_year (int): Start year for the filter.
        end_year (int): End year for the filter.
    
    Returns:
        list: Filtered list of income statements.
    """
    filtered_data = [row for row in current_income if start_year <= int(row['date'][:4]) <= end_year]
    return filtered_data


def filter_by_revenue(data, min_revenue, max_revenue):
    """
    Filter income statement data by revenue range.
    
    Args:
        data (list): List of income statements (dicts).
        min_revenue (float): Minimum revenue for the filter.
        max_revenue (float): Maximum revenue for the filter.
    
    Returns:
        list: Filtered list of income statements.
    """
    filtered_data = [row for row in current_income if min_revenue <= row['revenue'] <= max_revenue]
    return filtered_data


def filter_by_net_income(data, min_income, max_income):
    """
    Filter income statement data by net income range.
    
    Args:
        data (list): List of income statements (dicts).
        min_income (float): Minimum net income for the filter.
        max_income (float): Maximum net income for the filter.
    
    Returns:
        list: Filtered list of income statements.
    """
    filtered_data = [row for row in current_income if min_income <= row['netIncome'] <= max_income]
    return filtered_data

def sort_income(field, ascending=True):
    """
    Sort the income statement by the specified field.
    
    Args:
        field (str): The field to sort by ('date', 'revenue', 'netIncome').
        ascending (bool): Whether to sort in ascending order. Default is True.
    
    Returns:
        List[dict]: Sorted income statement.
    """
    valid_fields = {'date', 'revenue', 'netIncome'}
    if field not in valid_fields:
        raise ValueError(f"Invalid field. Choose from {valid_fields}")

    return sorted(
        current_income,
        key=lambda x: x[field] if field != 'date' else int(x['date'][:4]),
        reverse=not ascending
    )

@app.route('/filter-sort-income', methods=['GET'])
def filter_sort_income():
    """
    Endpoint to filter and sort income statements based on user input.
    
    Expects JSON payload with optional parameters:
        - start_year (int): Start of date range.
        - end_year (int): End of date range.
        - min_revenue (float): Minimum revenue filter.
        - max_revenue (float): Maximum revenue filter.
        - min_income (float): Minimum net income filter.
        - max_income (float): Maximum net income filter.
        - sort_field (str): Field to sort by ('date', 'revenue', 'netIncome').
        - ascending (bool): Sort order, default is ascending.
    
    Returns:
        JSON: Filtered and sorted income statements.
    """
    try:
        # Extract query parameters
        start_year = request.args.get('start_year', type=int)
        end_year = request.args.get('end_year', type=int)
        min_revenue = request.args.get('min_revenue', type=float)
        max_revenue = request.args.get('max_revenue', type=float)
        min_income = request.args.get('min_income', type=float)
        max_income = request.args.get('max_income', type=float)
        sort_field = request.args.get('sort_field', type=str)
        ascending = request.args.get('ascending', default='true').lower() == 'true'
        
        # Apply filters in sequence if parameters are provided
        filtered_data = current_income[:]  # Start with the full dataset
        
        if start_year is not None and end_year is not None:
            filtered_data = filter_by_date_range(filtered_data, start_year, end_year)
        
        if min_revenue is not None and max_revenue is not None:
            filtered_data = filter_by_revenue(filtered_data, min_revenue, max_revenue)
        
        if min_income is not None and max_income is not None:
            filtered_data = filter_by_net_income(filtered_data, min_income, max_income)
        
        # Apply sorting if a sort field is provided
        if sort_field:
            filtered_data = sort_income(filtered_data, sort_field, ascending)
        
        return jsonify({"status": "success", "data": filtered_data}), 200
    
    except Exception as e:
        print(f"Error in filter_sort_income: {e}")
        return jsonify({"status": "error", "message": str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)
