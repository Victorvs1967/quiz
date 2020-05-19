from flask import Flask, Response, jsonify, render_template, make_response, request
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', defaults={'path': 'data'})
@app.route('/<path:path>', methods=['POST', 'GET'])
def questions(path):

    try:
        with app.open_resource(path, 'rb') as file:
            data = file.read()
    except Exception:
        return '<h1>File not found!</h1>'         

    return Response(data, mimetype='application/json', headers={'Content-Disposition':f'attachment;filename={path}'})


if __name__ == "__main__":
    app.run()
