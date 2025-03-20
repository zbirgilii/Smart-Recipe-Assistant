import matplotlib.pyplot as plt
import os
import seaborn as sns
import numpy as np
import tensorflow as tf
import splitfolders
import shutil
from tensorflow.keras.models import Model
from tensorflow.keras.models import load_model
import pandas as pd

test_dir = "dataset/test"

BATCH_SIZE = 32
IMG_SIZE = (320, 320)
test_dataset = tf.keras.utils.image_dataset_from_directory(test_dir,
                                                           shuffle=False,
                                                           batch_size=BATCH_SIZE,
                                                           image_size=IMG_SIZE)
  


IMG_SHAPE = IMG_SIZE + (3,)

model = load_model("model/NibbleAIV2.h5")

model.trainable = False

loss, accuracy = model.evaluate(test_dataset)
print('TensorFlow Model Evaluation Accuracy:', accuracy)

y_true = np.concatenate([y for x, y in test_dataset], axis=0)

y_pred = np.argmax(model.predict(test_dataset), axis=1)
print(y_pred)
con_mat = tf.math.confusion_matrix(labels=y_true, predictions=y_pred).numpy()

classes = [i for i in range(59)]

con_mat_df = pd.DataFrame(con_mat,
                     index = classes,
                     columns = classes)

figure = plt.figure()
sns.heatmap(con_mat_df, annot=True, cmap=plt.cm.Blues)
plt.tight_layout()
plt.ylabel('True label')
plt.xlabel('Predicted label')
plt.show()

for i in range(len(con_mat)):
    sum = 0
    precision = con_mat[i][i]
    for j in range(len(con_mat[i])):
        sum += con_mat[i][j]
    precision /= sum

    print("The precision of BrainNet for class " + str(classes[i]) + " is " + str(precision))

for i in range(len(con_mat)):
    sum = 0
    recall = con_mat[i][i]
    for j in range(len(con_mat[i])):
        sum += con_mat[j][i]
    recall /= sum

    print("The recall of BrainNet for class " + str(classes[i]) + " is " + str(recall))

loss, accuracy = model.evaluate(test_dataset)
print('Test accuracy :', accuracy)

import tensorflow_addons as tfa

kappa_metric = tfa.metrics.CohenKappa(num_classes=59, sparse_labels=True)

kappa_metric.update_state(y_true, y_pred)

kappa_score = kappa_metric.result()

print(kappa_score)
