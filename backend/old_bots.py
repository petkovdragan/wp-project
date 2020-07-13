from simpletransformers.question_answering import QuestionAnsweringModel

context = "Liverpool Football Club is a professional football club in Liverpool, England, that competes in the Premier League,\
          the top tier of English football. The club has won six European Cups, more than any other English club,\
          three UEFA Cups, four UEFA Super Cups (both also English records), one FIFA Club World Cup, eighteen League titles,\
          seven FA Cups, a record eight League Cups and fifteen FA Community Shields."


class QACustomized(QuestionAnsweringModel):

    def get_answer(self, question):
        tmp = self.predict([
            {
                'context': context,
                'qas': [
                    {'id': '0', 'question': question},
                ]
            }
        ], n_best_size=1)

        answer = tmp[0]['answer']

        return answer
