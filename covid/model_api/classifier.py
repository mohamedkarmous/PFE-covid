
import numpy as np
import pickle


class _Classifier:
    model = None
    _mapping = ["NORMAL", "COVID"]
    _instance = None

    def predict(self, list):

        p = self.model.predict_proba(list)
        print("prediction : ", p)
        result = [self._mapping[np.argmax(
            p)]+" "+str(round(max(p[0])*100))+"%"]
        return (result)


def Classifier():
    if _Classifier._instance is None:
        _Classifier._instance = _Classifier()
        with open('.\GradientBoostingClassifier.pkl', 'rb') as file:
            pickle_model = pickle.load(file)
        _Classifier.model = pickle_model
    return _Classifier._instance


if __name__ == "__main__":

    model = Classifier()
    print(model.predict([[1, 1, 1, 1, 1, 1]]))
