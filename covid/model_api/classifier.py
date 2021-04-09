
import numpy as np
import pickle


class _Classifier:
    model = None
    _mapping = ["NORMAL", "COVID"]
    _instance = None

    def predict(self, list):

        p = self.model.predict(list)
        print("prediction : ", self._mapping[p[0]])
        result = [self._mapping[p[0]]]
        return (result)


def Classifier():
    if _Classifier._instance is None:
        _Classifier._instance = _Classifier()
        with open('.\VotingClassifier.pkl', 'rb') as file:
            pickle_model = pickle.load(file)
        _Classifier.model = pickle_model
    return _Classifier._instance


if __name__ == "__main__":

    model = Classifier()
    print(model.predict([[1, 1, 1, 1, 1, 1]]))
