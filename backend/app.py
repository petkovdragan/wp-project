from flask import Flask
from flask_restful import Resource, Api
from flask_restful import reqparse
from flask_cors import CORS, cross_origin
from backend.bots import QAModel, ConvModel

app = Flask(__name__)
api = Api(app)

CORS(app, resources={r"/*": {"origins": "*"}})

parser = reqparse.RequestParser()
parser.add_argument('question')
parser.add_argument('history', action='append')

qa_model = QAModel()
conv_model = ConvModel()

class QA(Resource):

    def post(self):
        args = parser.parse_args()
        print('in qa request', args['question'], args['history'])
        answer = qa_model.get_answer(question=args['question'], history=args['history'])
        return {"answer": answer}

class Conv(Resource):

    def post(self):
        args = parser.parse_args()
        print('in qa request', args['question'], args['history'])
        answer = conv_model.get_answer(question=args['question'], history=args['history'])
        return {"answer": answer}


api.add_resource(QA, '/qa')
api.add_resource(Conv, '/conv')

if __name__ == "__main__":
    app.run(debug=True)