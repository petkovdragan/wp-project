## Chatbot
### Web programming project (2019/20)

This repository consists of the code for a chatbot application which was developed as part of a project assignment for the course 'Web Programming' at FCSE - Skopje (2019/20).

The project consists of a chatbot model (`python`), RESTfull web service (`Flask`) and a very simple UI (`React`).

#### Chatbot model
The model combines two chatbots into one cohesive unit: one of type `Q&A` chatbot and the other of type `Conversational` chatbot. The `Q&A` chatbot can be specialized in a certain domain to answer certain types of questions. On the other hand, the `Conversational` chatbot serves as a "rollback" option for chit-chat with the user if the `Q&A` chatbot is not able to provide a satisfactory answer. We use a `Conversational` chatbot model from the [Simple Transformers](https://github.com/ThilinaRajapakse/simpletransformers) library which is pre-trained over the [Persona Chat Dataset](https://arxiv.org/abs/1801.07243).

##### Q&A chatbot
We develop a custom `Q&A` chatbot model which is built with the help of a [Sentence Transformers](https://github.com/UKPLab/sentence-transformers) model. We use a `Sentence Transformers` model to compute the similarity (cosine) value between the user question (query) and every question that exists in our dataset (`.json` file with Q&As). If there is a question in the dataset that satisfies the threshold for similarity with the user query, then we can deduce that those two sentences have similar meanings. The respective answer of the question from the dataset with the most similar meaning with the user query is returned.

##### Dataset
A simple `.json` file which consists of an array of objects each with exactly two fields: "q", "a", representing a question and it's answer. Actually, the main motive behind the development of our custom `Q&A` chatbot model was to make the format of the dataset as simple and as flexible as possible. The dataset used in this project (`data/final.json`) is a combination of [multiple datasets](https://github.com/LasseRegin/medical-question-answer-data) extracted from multiple medical forums.

#### Web service
The RESTFull web service is developed in the `python` framework `Flask` and exposes a HTTP endpoint for accessing the chatbot.

#### UI
Simple UI which allows the user to enter the query it wants to send to the chatbot.

#### Contributors
- Dejan Slamkov ([LinkedIn](https://www.linkedin.com/in/dejan-slamkov/), [GitHub](https://github.com/SlamkovDejan))
- Toshe Todorov ([LinkedIn](https://www.linkedin.com/in/toshe-todorov-713371170), [GitHub](https://github.com/ToseTodorov))
- Dragan Petkov ([LinkedIn](https://www.linkedin.com/in/dragan-petkov-b652b31a9), [GitHub](https://github.com/petkovdragan))
