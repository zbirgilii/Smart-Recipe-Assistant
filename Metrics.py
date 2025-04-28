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
from keras.models import load_model
from keras.utils import custom_object_scope
from tensorflow.keras import mixed_precision
mixed_precision.set_global_policy('mixed_float32')
test_dir = "dataset/test"
from keras.utils import custom_object_scope
from keras.models import load_model
from keras.activations import softmax
from tensorflow.keras import layers

# Deine a custom Cast layer
from tensorflow.keras import layers
import tensorflow as tf


from tensorflow.keras imprt layers
import tensorflow as tf

class CastLayer(layers.Layer):
    def __init__(self, dtype, **kwargs):
        super(CastLayer, self).__init__(**kwargs)
        self.dtype = dtype  # Store dtype as an attribute

    def build(self, input_shape):
        # Ensure proper setup of any layer weights, though Cast layer doesn't need any
        super(CastLayer, self).build(input_shape)

    def call(self, inputs):
        return tf.cast(inputs, self.dtype)

    def get_config(self):
        config = super(CastLayer, self).get_config()
        config.update({'dtype': self.dtype})
        return config
o
# Load the model with the custom layer
model = tf.keras.models.load_model('model/NibbleAIVTest.keras', custom_objects={'Cast': CastLayer})

BATCH_SIZE = 16
IMG_SIZE = (160, 160)
test_dataset = tf.keras.utils.image_dataset_from_directory(test_dir,
                                                           shuffle=False,
                                                           batch_size=BATCH_SIZE,
                                                           image_size=IMG_SIZE)
  


IMG_SHAPE = IMG_SIZE + (3,)
import tensorflow_hub as hub


model.trainable = False

loss, accuracy = model.evaluate(test_dataset)
print('TensorFlow Model Evaluation Accuracy:', accuracy)

y_true = np.concatenate([y for x, y in test_dataset], axis=0)

y_pred = np.argmax(model.predict(test_dataset), axis=1)
print(y_pred)
con_mat = tf.math.confusion_matrix(labels=y_true, predictions=y_pred).numpy()

classes = ['egg', 'garlic', 'lettuce', 'mayonnaise', 'tomato']

con_mat_df = pd.DataFrame(con_mat,
                     index = classes,
                     columns = classes)

figure = plt.figure()
sns.heatmap(con_mat_df, annot=True, cmap=plt.cm.Blues)
plt.tight_layout()
plt.ylabel('True label')
plt.xlabel('Predicted label')
output_dir = "model_evaluation"
os.makedirs(output_dir, exist_ok=True)
conf_matrix_path = os.path.join(output_dir, "confusion_matrix2.png")
plt.savefig(conf_matrix_path)

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

kappa_metric = tfa.metrics.CohenKappa(num_classes=5, sparse_labels=True)

kappa_metric.update_state(y_true, y_pred)

kappa_score = kappa_metric.result()

print(kappa_score)
