from flask import Flask, Response, jsonify, render_template, make_response, request
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data/<file_name>', methods=['POST', 'GET'])
def questions(file_name):

    with app.open_resource(f'data/{file_name}', 'rb') as file:
        data = file.read()

    return Response(data, mimetype='application/json', headers={'Content-Disposition':f'attachment;filename={file_name}'})

if __name__ == "__main__":
    app.run()
