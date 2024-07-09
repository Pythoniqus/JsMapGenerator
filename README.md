# Maze Generator

This project is a maze generation tool using two different algorithms: Prim's Algorithm and Room-based Generation. The generated mazes can be visualized in a web interface.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Maze Generation Algorithms](#maze-generation-algorithms)
- [Functions Overview](#functions-overview)
- [Contributing](#contributing)
- [License](#license)

## Features
- Generate mazes using Prim's Algorithm or Room-based Generation.
- Display the generated mazes in a web interface.
- Switch between different maze generation types.
- Place a player at a random position within the maze.
- Convert unneeded walls to invisible walls for better visualization.

## Installation
To set up the project locally just download the latest release, extract the file contents and open index.html

## Usage
### Generating a Maze
To generate a maze, simply open the `index.html` file in a web browser. The initial maze generation type is set to Prim's Algorithm. You can switch between Prim's and Room-based generation using the provided button.

### Switch Maze Generation Type
Click the "Switch Generation Type" button to toggle between Prim's Algorithm and Room-based Generation.

## Maze Generation Algorithms
### Prim's Algorithm
This algorithm generates a maze by starting with a grid full of walls. It randomly selects a starting cell and marks it as a passage. It then selects walls at random and converts them to passages if they lead to new cells.

### Room-based Generation
This algorithm generates a maze by placing rooms at random positions in the grid. It then connects the rooms with corridors to form a complete maze.

## Functions Overview
- **generateMaze(rows, cols, type)**: Main function to generate a maze of given dimensions and type.
- **generateMazeWithPrims(rows, cols)**: Generates a maze using Prim's Algorithm.
- **generateMazeWithRooms(rows, cols, roomCount, minRoomSize, maxRoomSize)**: Generates a maze using Room-based Generation.
- **createEmptyMaze(rows, cols)**: Creates an empty maze filled with walls.
- **getAdjacentWalls(maze, row, col)**: Returns a list of adjacent wall cells.
- **getAdjacentCells(maze, row, col)**: Returns a list of adjacent cells.
- **placePlayer(maze)**: Places the player in a random tiled position in the maze.
- **convertWallsToInvisible(maze)**: Converts unnecessary walls to invisible walls.
- **hasAdjacentTiled(maze, row, col)**: Checks if a cell has adjacent tiled cells.
- **placeRoom(maze, row, col, minSize, maxSize)**: Places a room in the maze.
- **placeRandomRoom(maze, minSize, maxSize)**: Places a random room in the maze.
- **canPlaceRoom(maze, row, col, width, height)**: Checks if a room can be placed at a given position.
- **connectRooms(maze, newRoom, rooms)**: Connects rooms with corridors.
- **carveHorizontalCorridor(maze, col1, col2, row)**: Carves a horizontal corridor.
- **carveVerticalCorridor(maze, row1, row2, col)**: Carves a vertical corridor.
- **getRandomInt(min, max)**: Returns a random integer between min and max.
- **convertMazeToJson(maze, id)**: Converts the maze to a JSON format.
- **switchGenerationType()**: Switches the maze generation type.
- **generateAndDisplayMaze()**: Generates and displays the maze.

## Contributing
Contributions are welcome! If you have any ideas, suggestions, or bug fixes, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
