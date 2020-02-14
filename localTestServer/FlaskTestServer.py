from flask import Flask, render_template, request, send_from_directory
import os
import time
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__, static_url_path='/')

@app.route('/')
def send_index():
    return send_from_directory('../', 'index.html')
    
@app.route('/site/<path:path>')
def send_site(path):
    return send_from_directory('../site', path)


def iteration():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

def main():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=iteration, trigger="interval", seconds=5)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == '__main__':
    main()
