from flask import Flask, render_template, request, send_from_directory
import os

app = Flask(__name__, static_url_path='/')

@app.route('/')
def send_index():
    return send_from_directory('../', 'index.html')
    
@app.route('/site/<path:path>')
def send_site(path):
    return send_from_directory('../site', path)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
