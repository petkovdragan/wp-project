

class QAModel:

    def __init__(self):
        self.count = 0

    def get_answer(self, personality=None, question="", history=None):
        if personality is None:
            personality = []
        if history is None:
            history = []

        self.count = self.count + 1
        print("history in qa", history)
        return f'{question}: qa_answer{self.count}'


class ConvModel:

    def __init__(self):
        self.count = 0

    def get_answer(self, personality=None, question="", history=None):
        if personality is None:
            personality = []
        if history is None:
            history = []

        self.count = self.count + 1
        print("history in conv", history)
        return f'{question}: conv_answer{self.count}'
