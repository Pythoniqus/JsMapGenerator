let currentGenerationType = 'prims'; // Initial generation type

function generateMaze(rows, cols, type = 'prims') {
    if (type === 'prims') {
        return generateMazeWithPrims(rows, cols);
    } else {
        return generateMazeWithRooms(rows, cols);
    }
}

function generateMazeWithPrims(rows, cols) {
    const maze = createEmptyMaze(rows + 2, cols + 2);
    const walls = [];
    const startRow = Math.floor(Math.random() * rows) + 1;
    const startCol = Math.floor(Math.random() * cols) + 1;

    maze[startRow][startCol] = 'tiled';
    walls.push(...getAdjacentWalls(maze, startRow, startCol));

    while (walls.length > 0) {
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [row, col] = walls.splice(randomIndex, 1)[0];
        const neighbors = getAdjacentCells(maze, row, col);

        if (neighbors.filter(([r, c]) => maze[r][c] === 'tiled' || maze[r][c] === 'tiled player').length === 1) {
            maze[row][col] = 'tiled';
            walls.push(...getAdjacentWalls(maze, row, col));
        }
    }

    placePlayer(maze);
    convertWallsToInvisible(maze);

    return maze;
}

function generateMazeWithRooms(rows, cols, roomCount = 10, minRoomSize = 3, maxRoomSize = 7) {
    const maze = createEmptyMaze(rows, cols);
    const rooms = [];

    // Place the first room in the center
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const firstRoom = placeRoom(maze, centerRow, centerCol, minRoomSize, maxRoomSize);
    rooms.push(firstRoom);

    // Place additional rooms and connect them
    for (let i = 1; i < roomCount; i++) {
        const newRoom = placeRandomRoom(maze, minRoomSize, maxRoomSize);
        if (newRoom) {
            rooms.push(newRoom);
            connectRooms(maze, newRoom, rooms);
        }
    }

    placePlayer(maze);
    convertWallsToInvisible(maze);
    return maze;
}

function createEmptyMaze(rows, cols) {
    const maze = [];
    for (let i = 0; i < rows; i++) {
        maze.push([]);
        for (let j = 0; j < cols; j++) {
            maze[i].push('solid wall');
        }
    }
    return maze;
}

function getAdjacentWalls(maze, row, col) {
    const walls = [];
    if (row > 1 && maze[row - 1][col] === 'solid wall') walls.push([row - 1, col]);
    if (row < maze.length - 2 && maze[row + 1][col] === 'solid wall') walls.push([row + 1, col]);
    if (col > 1 && maze[row][col - 1] === 'solid wall') walls.push([row, col - 1]);
    if (col < maze[0].length - 2 && maze[row][col + 1] === 'solid wall') walls.push([row, col + 1]);
    return walls;
}

function getAdjacentCells(maze, row, col) {
    const neighbors = [];
    if (row > 0) neighbors.push([row - 1, col]);
    if (row < maze.length - 1) neighbors.push([row + 1, col]);
    if (col > 0) neighbors.push([row, col - 1]);
    if (col < maze[0].length - 1) neighbors.push([row, col + 1]);
    return neighbors;
}

function placePlayer(maze) {
    const tiledPositions = [];
    for (let row = 1; row < maze.length - 1; row++) {
        for (let col = 1; col < maze[0].length - 1; col++) {
            if (maze[row][col] === 'tiled') {
                tiledPositions.push([row, col]);
            }
        }
    }

    if (tiledPositions.length > 0) {
        const [playerRow, playerCol] = tiledPositions[Math.floor(Math.random() * tiledPositions.length)];
        maze[playerRow][playerCol] = 'tiled player';
    }
}

function convertWallsToInvisible(maze) {
    for (let row = 1; row < maze.length - 1; row++) {
        for (let col = 1; col < maze[0].length - 1; col++) {
            if (maze[row][col] === 'solid wall' && !hasAdjacentTiled(maze, row, col)) {
                maze[row][col] = 'invisible solid';
            }
        }
    }
}

function hasAdjacentTiled(maze, row, col) {
    const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];
    return directions.some(([dx, dy]) => maze[row + dx] && maze[row + dx][col + dy] === 'tiled');
}

function placeRoom(maze, row, col, minSize, maxSize) {
    const roomWidth = getRandomInt(minSize, maxSize);
    const roomHeight = getRandomInt(minSize, maxSize);
    const startRow = Math.max(1, row - Math.floor(roomHeight / 2));
    const startCol = Math.max(1, col - Math.floor(roomWidth / 2));
    const endRow = Math.min(maze.length - 2, startRow + roomHeight);
    const endCol = Math.min(maze[0].length - 2, startCol + roomWidth);

    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            maze[r][c] = 'tiled';
        }
    }

    return { startRow, startCol, endRow, endCol };
}

function placeRandomRoom(maze, minSize, maxSize) {
    const rows = maze.length;
    const cols = maze[0].length;
    let attempts = 0;

    while (attempts < 100) {
        const row = Math.floor(Math.random() * (rows - 2)) + 1;
        const col = Math.floor(Math.random() * (cols - 2)) + 1;
        const roomWidth = getRandomInt(minSize, maxSize);
        const roomHeight = getRandomInt(minSize, maxSize);

        if (canPlaceRoom(maze, row, col, roomWidth, roomHeight)) {
            return placeRoom(maze, row, col, roomWidth, roomHeight);
        }

        attempts++;
    }

    return null;
}

function canPlaceRoom(maze, row, col, width, height) {
    const startRow = row;
    const startCol = col;
    const endRow = Math.min(maze.length - 2, startRow + height);
    const endCol = Math.min(maze[0].length - 2, startCol + width);

    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            if (maze[r][c] !== 'solid wall') {
                return false;
            }
        }
    }

    return true;
}

function connectRooms(maze, newRoom, rooms) {
    const targetRoom = rooms[Math.floor(Math.random() * rooms.length)];

    const newCenterRow = Math.floor((newRoom.startRow + newRoom.endRow) / 2);
    const newCenterCol = Math.floor((newRoom.startCol + newRoom.endCol) / 2);
    const targetCenterRow = Math.floor((targetRoom.startRow + targetRoom.endRow) / 2);
    const targetCenterCol = Math.floor((targetRoom.startCol + targetRoom.endCol) / 2);

    if (Math.random() < 0.5) {
        carveHorizontalCorridor(maze, newCenterCol, targetCenterCol, newCenterRow);
        carveVerticalCorridor(maze, newCenterRow, targetCenterRow, targetCenterCol);
    } else {
        carveVerticalCorridor(maze, newCenterRow, targetCenterRow, newCenterCol);
        carveHorizontalCorridor(maze, newCenterCol, targetCenterCol, targetCenterRow);
    }
}

function carveHorizontalCorridor(maze, col1, col2, row) {
    for (let c = Math.min(col1, col2); c <= Math.max(col1, col2); c++) {
        if (maze[row][c] === 'solid wall') {
            maze[row][c] = 'tiled';
        }
    }
}

function carveVerticalCorridor(maze, row1, row2, col) {
    for (let r = Math.min(row1, row2); r <= Math.max(row1, row2); r++) {
        if (maze[r][col] === 'solid wall') {
            maze[r][col] = 'tiled';
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertMazeToJson(maze, id) {
    const jsonMap = {
        id: id || 'generatedMaze',
        size: {
            rows: maze.length,
            cols: maze[0].length
        },
        zoom: 100,
        cssClass: 'cusMap01',
        _default: {
            cssClass: 'tiled',
            name: 'Default Room',
            desc: 'A default room description.'
        }
    };

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const cellKey = `r${row}c${col}`;
            jsonMap[cellKey] = { cssClass: maze[row][col] };
        }
    }

    return jsonMap;
}

function switchGenerationType() {
    currentGenerationType = currentGenerationType === 'prims' ? 'rooms' : 'prims';
    generateAndDisplayMaze();
}

function generateAndDisplayMaze() {
    const rows = 50;
    const cols = 50;
    const maze = generateMaze(rows, cols, currentGenerationType);
    const mazeJson = convertMazeToJson(maze, 'testMaze');
    window._bm.gotoMap(mazeJson);
}


// Include the existing helper functions for drawing and interacting with the map
(function() {
    var _bm = {};
    _bm.version = "v1.0.1";

    _bm.drawMap = function(mapObj, load = true) {
        if (!mapObj) return "";
        if (typeof mapObj === "string") mapObj = JSON.parse(mapObj);
        if (load) window.curMap = mapObj;
        var rows = mapObj.size.rows;
        var cols = mapObj.size.cols;
        var ret = "";
        ret += "<div id=\"map\" class=\"" + (mapObj.cssClass ? mapObj.cssClass : "") + "\">";

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var cell = "r" + r + "c" + c;

                var _o = Object.assign({}, mapObj._default, mapObj[cell]);

                var css = _o.css ? _o.css : "";
                var cssClass = _o.cssClass ? _o.cssClass : "";
                var content = _o.content ? _o.content : "";
                ret += "<span id=\"" + cell + "\" class=\"map-cell " + cssClass + "\" style=\"" + css + "\" onclick=\"_bm.runActs('" + cell + "')\"><span class=\"content\">" + content + "</span></span>";
                if (c === cols - 1) ret += "<br>";
            }
        }

        ret += "</div>";
        ret = ret.replace(/[\r\n\s]+/g, " ");
        return ret;
    };

    _bm.runActs = function(cellId) {
        var cell = window.curMap[cellId];
        if (cell && cell.acts) {
            try {
                eval(cell.acts);
            } catch (error) {
                console.error('Error executing acts:', error);
            }
        }
    };

    _bm.cameraFollow = function(target = "#r0c0") {
        var _t = document.querySelector("#map-container #map " + target);
        if (!_t) _t = document.querySelector("#map-container #map #r0c0");

        if (_t) {
            var _pos = _t.id.replace(/r([0-9]+)?c([0-9]+)?/, "$1_$2").split("_").map(function(el) {
                return Number(el);
            });

            var _map = document.querySelector("#map-container #map");
            var _padding = window.getComputedStyle(_map).padding;
            var _margin = window.getComputedStyle(_t).margin;
            var _w = window.getComputedStyle(_t).width;
            var _h = window.getComputedStyle(_t).height;
            var _o = window.getComputedStyle(document.querySelector("#map-container")).transformOrigin.split(" ");
            var size = window.curMap.size;

            _map.style.top = `calc(${_o[1]} - (${_pos[0]} * ${_h}) - (${_h}/2) - (${_pos[0]} * ${_margin} * 2) - (${_padding}*1.5))`;
            _map.style.left = `calc(${_o[0]} - (${_pos[1]} * ${_w}) - (${_w}/2) - (${_pos[1]} * ${_margin} * 2) - (${_padding}*1.5))`;
            _map.style.minWidth = `calc((${size.cols} * (${_w} + (${_margin} * 2)) + 1.5em)`;
            _map.style.minHeight = `calc((${size.rows} * (${_h} + (${_margin} * 2)) + 1.5em)`;
        }
    };

    window.zoomLevel = 100;

    _bm.mapZoom = function(level = 100) {
        var _t = document.querySelector("#map-container");
        if (!_t) return;

        _t.style.transform = `scale(${level / 100})`;

        var event = new Event(":map-zoomed");
        document.dispatchEvent(event);
    };

    _bm.pMoveCoords = function(coords, override = false) {
        var _p = document.querySelector("#map-container #map .player");
        if (!_p) return;
        var _t = _p;

        switch (typeof coords) {
            case "string":
                _t = coords.trim() ? document.querySelector("#map-container #map #" + coords) : _p;
                break;
            case "object":
                if (Array.isArray(coords)) {
                    _t = document.querySelector("#map-container #map #r" + coords[0] + "c" + coords[1]);
                } else {
                    _t = document.querySelector("#map-container #map #r" + coords.row + "c" + coords.col);
                }
                break;
        }

        if (_t) {
            if (!_t.classList.contains("solid") || override) {
                _p.classList.remove("player");
                _t.classList.add("player");
            }
        }

        var event = new Event(":map-moved");
        document.dispatchEvent(event);
    };

    _bm.pMove = function(dir, dist = 1) {
        if (!document.querySelector("#map-container #map .player")) return;
        var rMove = 0;
        var cMove = 0;

        switch (dir) {
            case "up":
                rMove = -1;
                break;
            case "down":
                rMove = 1;
                break;
            case "left":
                cMove = -1;
                break;
            case "right":
                cMove = 1;
                break;
        }

        for (var d = 0; d < dist; d++) {
            var _p = document.querySelector("#map-container #map .player");
            var _cur = _p.id.replace(/r([0-9]+)?c([0-9]+)?/, "$1_$2").split("_").map(function(el) {
                return Number(el);
            });

            _bm.pMoveCoords([_cur[0] + rMove, _cur[1] + cMove]);
        }

        var event = new Event(":map-moved");
        document.dispatchEvent(event);
    };

    _bm.gotoMap = function(mapObj, coords = "") {
        if (typeof mapObj === "string") {
            mapObj = JSON.parse(mapObj);
        }

        window.curMap = mapObj;
        window.curPos = coords;
        document.querySelector("#map-container").innerHTML = _bm.drawMap(mapObj);
        _bm.pMoveCoords(coords, true);
        _bm.mapZoom(window.zoomLevel);
        document.querySelector("#loading-cover").classList.remove("closed");
    };

    window._bm = _bm;
})();

window.addEventListener("resize", function() {
    setTimeout(function() {
        var event = new Event(":map-moved");
        document.dispatchEvent(event);
    }, 200);
});

document.addEventListener(":map-moved", function() {
    window._bm.cameraFollow(".player");
    var _def = window.curMap._default;
    var _p = document.querySelector("#map-container #map .player");
    if (!_p) return;

    window.curPos = _p.id;
    document.querySelector("#cur-block-pos .content").innerHTML = _p.id;

    var _cur = window.curMap[_p.id];
    var _o = Object.assign({}, _def, _cur);

    document.querySelector("#cur-block-name .content").innerHTML = _o.name ? _o.name : "";
    document.querySelector("#cur-block-desc .content").innerHTML = _o.desc ? _o.desc : "";
    document.querySelector(".button-container .choice").innerHTML = _o.acts ? _o.acts.replace(/[\r\n]+/g, " ") : "";

    var imgSrc = _o.img ? _o.img : null;
    var imgLabel = _o.imgLabel ? _o.imgLabel : null;

    document.querySelector("#cur-block-image .content").innerHTML = '';
    document.querySelector("#imgName").innerHTML = '';

    if (window.curMap.img) {
        var globalImgElement = document.createElement('img');
        globalImgElement.src = window.curMap.img;
        globalImgElement.alt = window.curMap.imgLabel ? window.curMap.imgLabel : "Global Image";
        globalImgElement.id = "global-image";
        document.querySelector("#cur-block-image .content").appendChild(globalImgElement);
    }

    if (imgSrc) {
        var blockImgElement = document.createElement('img');
        blockImgElement.src = imgSrc;
        blockImgElement.alt = imgLabel ? imgLabel : "Image";
        blockImgElement.id = "block-image";
        document.querySelector("#cur-block-image .content").appendChild(blockImgElement);
    }

    var label = imgLabel ? imgLabel : window.curMap.imgLabel;
    document.querySelector("#imgName").innerHTML = label ? label : "";

    if (_o.trig) {
        eval(_o.trig);
    }
});

document.addEventListener("keydown", function(ev) {
    switch (ev.code) {
        case "KeyW":
        case "ArrowUp":
            window._bm.pMove("up");
            break;
        case "KeyS":
        case "ArrowDown":
            window._bm.pMove("down");
            break;
        case "KeyA":
        case "ArrowLeft":
            window._bm.pMove("left");
            break;
        case "KeyD":
        case "ArrowRight":
            window._bm.pMove("right");
            break;

        case "PageDown":
            window.zoomLevel -= 10;
            window.zoomLevel = Math.max(10, Math.min(250, window.zoomLevel));
            window._bm.mapZoom(window.zoomLevel);
            break;
        case "PageUp":
            window.zoomLevel += 10;
            window.zoomLevel = Math.max(10, Math.min(250, window.zoomLevel));
            window._bm.mapZoom(window.zoomLevel);
            break;
    }
});


window.addEventListener("DOMContentLoaded", function() {
    window._bm.gotoMap(mazeJson);
});

// Initial maze generation
generateAndDisplayMaze();