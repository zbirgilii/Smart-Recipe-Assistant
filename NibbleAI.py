import tensorflow as tf
from tensorflow.keras import layers, Model
import matplotlib.pyplot as plt
import numpy as np
import os
import splitfolders
import shutil

from tensorflow.keras import backend as K
K.clear_session()

input_folder = "input"
output = "dataset"
shutil.rmtree("dataset")
splitfolders.ratio(input_folder, output=output, ratio=(.8, .1, .1))

train_dir = "dataset/train"
validation_dir = "dataset/val"
test_dir = "dataset/test"

BATCH_SIZE = 32
IMG_SIZE = (320, 320)

train_dataset = tf.keras.utils.image_dataset_from_directory(train_dir,
                                                            shuffle=True,
                                                            batch_size=BATCH_SIZE,
                                                            image_size=IMG_SIZE)

validation_dataset = tf.keras.utils.image_dataset_from_directory(validation_dir,
                                                                 shuffle=True,
                                                                 batch_size=BATCH_SIZE,
                                                                 image_size=IMG_SIZE)

test_dataset = tf.keras.utils.image_dataset_from_directory(test_dir,
                                                           shuffle=True,
                                                           batch_size=BATCH_SIZE,
                                                           image_size=IMG_SIZE)

AUTOTUNE = tf.data.AUTOTUNE

train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)
test_dataset = test_dataset.prefetch(buffer_size=AUTOTUNE)

data_augmentation = tf.keras.Sequential([
  tf.keras.layers.RandomFlip('horizontal'),
  tf.keras.layers.RandomRotation(0.2),
])

for image, _ in train_dataset.take(1):
  plt.figure(figsize=(10, 10))
  first_image = image[0]
  for i in range(9):
    ax = plt.subplot(3, 3, i + 1)
    augmented_image = data_augmentation(tf.expand_dims(first_image, 0))
    plt.imshow(augmented_image[0] / 255)
    plt.axis('off')

preprocess_input = tf.keras.applications.resnet_v2.preprocess_input
IMG_SHAPE = IMG_SIZE + (3,)
IMG_SHAPE = IMG_SIZE + (3,)
base_model = tf.keras.applications.Densenet.DenseNet161(input_shape=IMG_SHAPE,
                                                         include_top=False,
                                                         weights='imagenet')
image_batch, label_batch = next(iter(train_dataset))
feature_batch = base_model(image_batch)
print(feature_batch.shape)

base_model.trainable = False
base_model.summary()



global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
feature_batch_average = global_average_layer(feature_batch)
print(feature_batch_average.shape)

prediction_layer = tf.keras.layers.Dense(59, activation=tf.nn.softmax)
prediction_batch = prediction_layer(feature_batch_average)
print(prediction_batch.shape)
import copy
inputs = tf.keras.Input(shape=(320, 320, 3))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
"""x = tf.keras.layers.concatenate([x, x1])"""


# This method is used to add residual blocks to my model
def add_residual_layer(input_x, filter_number1, filter_number2):
    x1 = tf.keras.layers.Conv2D(filter_number1, 5, padding="same")(input_x)
    x1 = tf.keras.layers.BatchNormalization(axis=3)(x1)
    x1 = tf.keras.layers.Activation("relu")(x1)
    x1 = tf.keras.layers.Conv2D(filter_number2, 5, padding="same")(x1)
    x1 = tf.keras.layers.BatchNormalization(axis=3)(x1)
    x1 = tf.keras.layers.Activation("relu")(x1)
    input_x = tf.keras.layers.Add()([x1, input_x])
    input_x = tf.keras.layers.Activation("relu")(input_x)
    return input_x


"""x = tf.keras.layers.concatenate([x1, x2])"""

x = global_average_layer(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = prediction_layer(x)
model = tf.keras.Model(inputs, outputs)

base_learning_rate = 0.001
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=base_learning_rate),
              loss="sparse_categorical_crossentropy",
              metrics=['accuracy'])

initial_epochs = 400

loss0, accuracy0 = model.evaluate(validation_dataset)

print("initial loss: {:.2f}".format(loss0))
print("initial accuracy: {:.2f}".format(accuracy0))
callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        filepath='best_model152-2.h5',
        save_best_only=True,
        monitor='val_loss',
        verbose=1
    ),
    tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=20,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=8,  # Reduce LR if no improvement for 6 epochs
        verbose=1,
        min_lr=1e-6
    )
]

history = model.fit(train_dataset,
                    epochs=initial_epochs,
                    validation_data=validation_dataset,
                    callbacks=callbacks)

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

model.save("model/NibbleAI_Before_fine152.keras")

loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(8, 8))
plt.subplot(2, 1, 1)
plt.plot(acc, label='Training Accuracy')
plt.plot(val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.ylabel('Accuracy')
plt.ylim([min(plt.ylim()),1])
plt.title('Training and Validation Accuracy')

plt.subplot(2, 1, 2)
plt.plot(loss, label='Training Loss')
plt.plot(val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.ylabel('Cross Entropy')
plt.ylim([0,1.0])
plt.title('Training and Validation Loss')
plt.xlabel('epoch')
plt.show()

base_model.trainable = True

print("Number of layers in the base model: ", len(base_model.layers))

fine_tune_at = 450

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False
current_lr = model.optimizer.learning_rate.numpy()
model.compile(loss="sparse_categorical_crossentropy",
              optimizer=tf.keras.optimizers.RMSprop(learning_rate=current_lr/10),
              metrics=['accuracy'])

fine_tune_epochs = 400
total_epochs =  initial_epochs + fine_tune_epochs

history_fine = model.fit(train_dataset,
                         epochs=total_epochs,
                         initial_epoch=history.epoch[-1],
                         validation_data=validation_dataset,
                         callbacks=callbacks)

acc += history_fine.history['accuracy']
val_acc += history_fine.history['val_accuracy']

loss += history_fine.history['loss']
val_loss += history_fine.history['val_loss']

plt.figure(figsize=(8, 8))
plt.subplot(2, 1, 1)
plt.plot(acc, label='Training Accuracy')
plt.plot(val_acc, label='Validation Accuracy')
plt.ylim([0.8, 1])
plt.plot([initial_epochs-1,initial_epochs-1],
          plt.ylim(), label='Start Fine Tuning')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(2, 1, 2)
plt.plot(loss, label='Training Loss')
plt.plot(val_loss, label='Validation Loss')
plt.ylim([0, 1.0])
plt.plot([initial_epochs-1,initial_epochs-1],
         plt.ylim(), label='Start Fine Tuning')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.xlabel('epoch')
plt.show()

loss, accuracy = model.evaluate(test_dataset)
print('Test accuracy :', accuracy)

image_batch, label_batch = test_dataset.as_numpy_iterator().next()
predictions = model.predict_on_batch(image_batch).flatten()

print('Predictions:\n', predictions)
print('Labels:\n', label_batch)

model.save("model/NibbleAIV5.keras")





