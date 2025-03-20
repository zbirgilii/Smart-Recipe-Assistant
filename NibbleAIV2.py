import matplotlib.pyplot as plt
import numpy as np
import os
import tensorflow as tf
import splitfolders
import shutil

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
    tf.keras.layers.RandomFlip('horizontal'),   # Flip left-right
    tf.keras.layers.RandomRotation(0.2),       # Rotate up to 20%
    tf.keras.layers.RandomZoom(0.2),           # Zoom in/out up to 20%
    tf.keras.layers.RandomTranslation(0.1, 0.1),  # Shift image up to 10%
    tf.keras.layers.RandomContrast(0.2),       # Adjust contrast
    tf.keras.layers.RandomBrightness(0.2),     # Adjust brightness
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
base_model = tf.keras.applications.resnet_v2.ResNet152V2(input_shape=IMG_SHAPE,
                                                         include_top=False,
                                                         weights='imagenet')
image_batch, label_batch = next(iter(train_dataset))
feature_batch = base_model(image_batch)
print(feature_batch.shape)

base_model.summary()

base_model.trainable = True

for layer in base_model.layers[:100]:
    layer.trainable = False
for layer in base_model.layers[-100:]:
    layer.trainable = True

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
x = base_model(x, training=True)
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

base_learning_rate = 0.01
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=base_learning_rate),
              loss="sparse_categorical_crossentropy",
              metrics=['accuracy'])

initial_epochs = 400

loss0, accuracy0 = model.evaluate(validation_dataset)

print("initial loss: {:.2f}".format(loss0))
print("initial accuracy: {:.2f}".format(accuracy0))

callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        filepath='best_model50-2.h5',
        save_best_only=True,
        monitor='val_loss',
        verbose=1
    ),
    tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=18,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=12,  # Reduce LR if no improvement for 6 epochs
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

model.save("model/BrainNet_Before_fine101.h5")

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

print("Number of layers in the base model: ", len(base_model.layers))


loss, accuracy = model.evaluate(test_dataset)
print('Test accuracy :', accuracy)

image_batch, label_batch = test_dataset.as_numpy_iterator().next()
predictions = model.predict_on_batch(image_batch).flatten()

print('Predictions:\n', predictions)
print('Labels:\n', label_batch)

model.save("model/NibbleAIV3.keras")
