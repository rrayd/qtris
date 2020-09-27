# Orthographic tetris experiment

`npm install`

`npm run start`

...and [happy hacking](https://github.com/pmndrs/react-three-fiber)

## Планируемая игровая механика

### Игровое поле

Трёхмерная матрица, от восьми ячеек по стороне и более.

### Процес

-   Фигуры падают сверху и могут вращаться с шагом в 90 градусов. Вопрос открытый на счёт свободных для вращения осей: если поворачивать только по вертикальной оси (в горизонтальной плоскости), это сильно упростит разработку, но вероятно не будет нести достаточной ценности в плане игровой механики и используемых алгоритмов.
-   Задачей игрока является закрыть как можно больше ячеек на всех слоях, но не совсем понятно как начислять очки (есть несколько предположений, но это нужно развивать).

## Разработка

Каждый может внести своё видение и использовать эти наработки в будущем, в значительной степени целью проекта является изучение [react-three-fiber](https://github.com/pmndrs/react-three-fiber) и [three.js](https://github.com/mrdoob/three.js/) в частности. Любые дополнения **To Do** и улучшение этого документа приветствуются.

### Абстрактно о сцене

`src\QBRICK\index.js`

#### \<QGround />

В данный момент выполняет минимальную декоративную функцию и позволяет сориентироваться в концепте игрового поля.

#### \<QActiveLabel />

Слой, который по задумке должен перемещаться сверху вниз с шагом в одну ячейку. Фигура вращается и перемещается в горизонтальной плоскости в рамках этого слоя. Фигура генерируется единомоментно при инициализации слоя и размещается случайным образом.

#### \<QStaticLabel />

Компонент, который по задумке должен аккумулировать состояние `<QActiveLabel />`, отображает прогресс игрока.

### Completed

-   Добавлена сетка для ориентации в пространстве.
-   Настроена ортографическая камера.
-   Описаны классические фигуры в виде матриц.
-   Намечено два концепта для отрисовки фигур: voxel vs spline.
-   Фигуры генерируются в случайном порядке при инициализации сцены.
-   Добавлен черновик HUD (лого и кнопка play/pause).
-   Фигура движется сверху до самого нижнего слоя.

### To Do

-   Описать центры вращения фигур [Tetris Rotations](https://tech.migge.io/2017/02/07/tetris-rotations/) в рамках функции `QFigureSource()`.
-   Определиться какой концепт отрисовки фигур лучше развить (в spline не будет проблем для определения bounding box, но голос разума подсказывает, что его можно высчитать исходя из размерности поля).
-   Вращение фигур.
-   Концепт композиции состояния (использовать context, store или иное).
-   Концепт `<QStaticLabel />`, компонента для отображения прогресса на игровом поле.
-   Концепт вызовов [react-spring](react-spring.io) (при движении и появлении фигуры и т.д).
-   Концепт управления с клавиатуры (полагаю, уже сейчас можно по нажатию пробела ускорять движение `<QActiveLabel />`).
-   [Переехать на TS](https://github.com/pmndrs/react-three-fiber/pull/59).
