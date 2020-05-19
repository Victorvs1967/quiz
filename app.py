from flask import Flask, Response, jsonify, render_template, make_response, request
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', defaults={'u_path': 'data'})
@app.route('/<path:u_path>', methods=['POST', 'GET'])
def questions(u_path):

    with app.open_resource(u_path, 'rb') as file:
        data = file.read()

    return Response(data, mimetype='application/json', headers={'Content-Disposition':f'attachment;filename={u_path}'})


if __name__ == "__main__":
    app.run()
