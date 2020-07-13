from flask import Flask
from flask_restful import Resource, Api
from flask_restful import reqparse
from backend.bots import conv_model, combined_model, sim_model
from flask_cors import CORS, cross_origin

app = Flask(__name__)
api = Api(app)

CORS(app, resources={r"/*": {"origins": "*"}})

parser = reqparse.RequestParser()
parser.add_argument('question')
parser.add_argument('history', action='append')


class Conv(Resource):

    def post(self):
        args = parser.parse_args()
        #print('in conv request', args['question'], args['history'])
        answer = conv_model.get_answer(question=args['question'])
        return {"answer": answer}


class Combined(Resource):
    def post(self):
        args = parser.parse_args()
        #print('in comb request', args['question'], args['history'])
        answer = combined_model.get_answer(question=args['question'])
        return {"answer": answer}


class Similarity(Resource):
    def post(self):
        args = parser.parse_args()
        #print('in sim request', args['question'], args['history'])
        answer = sim_model.get_answer(question=args['question'])
        return {"answer": answer}


api.add_resource(Conv, '/conv')
api.add_resource(Combined, '/comb')
api.add_resource(Similarity, '/sim')

if __name__ == "__main__":
    app.run(debug=True)