from flask import Flask
from flask_restful import Resource, Api
from flask_restful import reqparse
from backend.bots import qa_model, conv_model, combined_model

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('question')
parser.add_argument('history', action='append')


class QA(Resource):

    def post(self):
        args = parser.parse_args()
        print('in qa request', args['question'], args['history'])
        answer = qa_model.get_answer(question=args['question'])
        return {"answer": answer}


class Conv(Resource):

    def post(self):
        args = parser.parse_args()
        print('in conv request', args['question'], args['history'])
        answer = conv_model.get_answer(question=args['question'])
        return {"answer": answer}


class Combined(Resource):
    def post(self):
        args = parser.parse_args()
        print('in comb request', args['question'], args['history'])
        answer = combined_model.get_answer(question=args['question'])
        return {"answer": answer}


api.add_resource(QA, '/qa')
api.add_resource(Conv, '/conv')
api.add_resource(Combined, '/comb')


if __name__ == "__main__":
    app.run(debug=True)