from simpletransformers.conv_ai import ConvAIModel
from simpletransformers.conv_ai.conv_ai_utils import get_dataset
import torch
import random

from sentence_transformers import SentenceTransformer
import scipy.spatial
import json
import pickle


class ConvAICustomized(ConvAIModel):

    def get_answer(self, question="", personality=[], history=[]):
        model = self.model
        args = self.args
        tokenizer = self.tokenizer
        process_count = self.args["process_count"]

        self._move_model_to_device()

        if personality == []:
            personality = ["i like medicine .", "i'm a doctor ."]

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


class SimilarityCorpus:

    def __init__(self):
        with open('../data/final.json') as f:
            datastore = json.load(f)
            self.database = dict([(obj["q"], obj["a"]) for obj in datastore])
            self.questions = list(self.database.keys())

        self.embedder = SentenceTransformer('bert-base-nli-mean-tokens')

        self.corpus = self.questions
        #self.corpus_embeddings = self.embedder.encode(self.corpus)
        self.corpus_embeddings = self.load_embeddings("../models/corpus/corpus_embeddings.bin")

    def save_embeddings(self, filename):
        binary_file = open(filename, mode='wb')
        pickle.dump(self.corpus_embeddings, binary_file)

    def load_embeddings(self, filename):
        binary_file = open(filename, mode='rb')
        return pickle.load(binary_file)

    def get_answer(self, question):
        queries = [question]
        query_embeddings = self.embedder.encode(queries)

        distances = scipy.spatial.distance.cdist(query_embeddings, self.corpus_embeddings, "cosine")[0]

        results = zip(range(len(distances)), distances)
        results = min(results, key=lambda x: x[1])

        print(results)

        best_index = results[0]
        best_distance = results[1]

        best_distance = round(best_distance, 6)
        if 1.0 - best_distance >= 0.8:
            return self.database[self.corpus[best_index]]

        return "I can't answer that question"


class CombinedModels:

    def __init__(self, similarity, conversational):
        self.sim = similarity
        self.conv = conversational

    def get_answer(self, question):
        answer = "I can't answer that question"
        try:
            answer = self.sim.get_answer(question)
        finally:
            if answer == "I can't answer that question":
                answer = self.conv.get_answer(question=question)

        return answer


conv_model = ConvAICustomized("gpt", "../models/conv_model", use_cuda=False)
sim_model = SimilarityCorpus()
combined_model = CombinedModels(sim_model, conv_model)

if __name__ == "__main__":
    print(conv_model.get_answer("what is the best medicine for headache?"))
    print(combined_model.get_answer("how to treat heparin-induced thrombocytopenia?"))
    print(sim_model.get_answer("how to get monolids?"))

