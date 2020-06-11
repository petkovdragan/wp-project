from simpletransformers.conv_ai import ConvAIModel
from simpletransformers.question_answering import QuestionAnsweringModel
from simpletransformers.conv_ai.conv_ai_utils import get_dataset
import torch
import random
#import apex

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


class ConvAICustomized(ConvAIModel):

    def get_answer(self, question="", personality=[], history=[]):
        model = self.model
        args = self.args
        tokenizer = self.tokenizer
        process_count = self.args["process_count"]

        self._move_model_to_device()

        if personality == []:
            personality = ["i know about drugs .", "i like medicine .", "i'm a pharmacist ."]

        if not personality:
            dataset = get_dataset(
                tokenizer,
                None,
                args["cache_dir"],
                process_count=process_count,
                #proxies=self.__dict__.get("proxies", None),
                interact=True,
            )
            personalities = [dialog["personality"] for dataset in dataset.values() for dialog in dataset]
            personality = random.choice(personalities)
        else:
            personality = [tokenizer.encode(s.lower()) for s in personality]

        history.append(tokenizer.encode(question))
        with torch.no_grad():
            out_ids = self.sample_sequence(personality, history, tokenizer, model, args)
            history.append(out_ids)
        history = history[-(2 * args["max_history"] + 1):]
        out_text = tokenizer.decode(out_ids, skip_special_tokens=True)
        return out_text


class CombinedBots:

    def __init__(self, qa_model, conv_model):
        self.qa_model = qa_model
        self.conv_model = conv_model

    def get_answer(self, question):
        tmp = self.qa_model.predict([
            {
                'context': context,
                'qas': [
                    {'id': '0', 'question': question},
                ]
            }
        ])

        answer = tmp[0]['answer']

        if answer is None or len(answer) == 0:
            answer = self.conv_model.get_answer(question=question)

        return answer


conv_model = ConvAICustomized("gpt", "../models/conv_model", use_cuda=False)
qa_model = QACustomized('bert', "../models/qa-model", use_cuda=False)
combined_model = CombinedBots(qa_model, conv_model)

if __name__ == "__main__":
    print(conv_model.get_answer("what is the best medicine for headache?"))
    print(qa_model.get_answer("what has Liverpool FC won?"))
    print(combined_model.get_answer("What is Liverpool FC?"))
    print(combined_model.get_answer("how to treat heparin-induced thrombocytopenia?"))

