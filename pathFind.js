// https://www.geeksforgeeks.org/a-search-algorithm/

let m_counter = 0;

class Grid {
    constructor(rowNum, colNum, w, h) {
        this.rows = rowNum;
        this.columns = colNum;
        this.width = w;
        this.height = h;

        this.cellWidth = this.width / this.rows;
        this.cellHeight = this.height / this.columns;

        this.blocks = new Array(Math.round(rowNum * colNum / 2));
        this.src = Array(2);
        this.dest = Array(2);

	this.path = [];
    }

    rowNum(){
	return this.rows;
    }

    columnNum() {
	return this.columns;
    }

    start() {
        return this.src;
    }

    end() {
        return this.dest;
    }

    addToPath( row, col, color ) {
	var coord = Array( 2 );
	coord[ 0 ] = row;
	coord[ 1 ] = col;
	coord[ 2 ] = color
	this.path.push( coord );
    }

    clearPath() {
	this.path = [];
    }
    
    setBlocks() {
        this.src[1] = Math.round(random(0, this.columns - 1));
        this.src[0] = Math.round(random(0, this.rows - 1));
        this.dest[1] = Math.round(random(0, this.columns - 1));
        this.dest[0] = Math.round(random(0, this.rows - 1));

        while (this.src === this.end) {
            this.dest[1] = Math.round(random(0, this.columns - 1));
            this.dest[0] = Math.round(random(0, this.rows - 1));
        }

        for (var i = 0; i < this.blocks.length;) {
	    let x = Math.round(random(0, this.columns));
	    let y = Math.round(random(0, this.rows));
	    if( x == this.src[ 0 ] && y == this.src[ 1 ] ) continue;
	    if( x == this.dest[ 0 ] && y == this.dest[ 1 ] ) continue;
	    
            var block = Array(2);
            block[1] = x;
            block[0] = y;
            this.blocks[i] = block;
	    i++;
        }

    }

    cellWidth() {
        return this.cellWidth;
    }

    cellHeight() {
        return this.cellHeight;
    }

    draw() {
        let y = 0;
        for (let i = 0; i < this.columns; i++) {
	    stroke( 150, 150, 150 );
            line(0, y, this.width, y)
            y += this.cellHeight;
        }

        let x = 0;
        for (let i = 0; i < this.rows; i++) {
            line(x, 0, x, this.height);
            x += this.cellWidth;
        }

        for (let i = 0; i < this.blocks.length; i++) {
            x = this.cellWidth * this.blocks[i][0];
            y = this.cellHeight * this.blocks[i][1];
            fill(80);
            rect(x, y, this.cellWidth, this.cellHeight);
        }

        fill(40, 100, 200);
        rect(this.src[0] * this.cellWidth, this.src[1] * this.cellHeight, this.cellWidth, this.cellHeight);
        fill(200, 40, 80);
        rect(this.dest[0] * this.cellWidth, this.dest[1] * this.cellHeight, this.cellWidth, this.cellHeight);

	for( let i = 0; i < this.path.length; i++ ) {
	    let p = this.path[ i ];
	    fill( p[ 2 ] );
	    rect( p[ 0 ] * this.cellWidth, p[ 1 ] * this.cellHeight, this.cellWidth, this.cellHeight);
	}
    }


}

///////////////////////////////////////////////////////////////////////////7
//////////////////////////////////////////////////////////////////////////
class Cell {

    constructor() {
        this.parent_i = 0;
        this.parent_j = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}


class AStarSearch {
    constructor(grid) {
        this.grid = grid;

	this.closedList = new Array(this.grid.rowNum());
        for (let i = 0; i < this.grid.rowNum(); i++) {
            this.closedList[i] = new Array(this.grid.columnNum()).fill(false);
        }

        // Declare a 2D array of structure to hold the details
        // of that cell
        this.cellDetails = new Array(this.grid.rowNum());
        for (let i = 0; i < this.grid.rowNum(); i++) {
            this.cellDetails[i] = new Array(this.grid.columnNum());
        }

        let i, j;

        for (i = 0; i < this.grid.rowNum(); i++) {
            for (j = 0; j < this.grid.columnNum(); j++) {
                this.cellDetails[i][j] = new Cell();
                this.cellDetails[i][j].f = 2147483647;
                this.cellDetails[i][j].g = 2147483647;
                this.cellDetails[i][j].h = 2147483647;
                this.cellDetails[i][j].parent_i = -1;
                this.cellDetails[i][j].parent_j = -1;
            }
        }

        // Initialising the parameters of the starting node
        i = this.grid.start()[0]
	j = this.grid.start()[1];
        this.cellDetails[i][j].f = 0;
        this.cellDetails[i][j].g = 0;
        this.cellDetails[i][j].h = 0;
        this.cellDetails[i][j].parent_i = i;
        this.cellDetails[i][j].parent_j = j;

	
	this.openList = new Map();
        this.openList.set(0, [ this.grid.start()[0], this.grid.start()[ 1 ] ]);
    }

    isValid(row, col) {
        // Returns true if row number and column number
        // is in range
        return (row >= 0) && (row < this.grid.rowNum()) && (col >= 0) && (col < this.grid.columnNum());
    }

    isUnBlocked(grid, row, col) {
        for (var i = 0; i < this.grid.blocks.length; i++) {
            if (this.grid.blocks[i][0] == row && this.grid.blocks[i][1] == col) {
                return false;
            }
        }
        return true;
    }

    isDestination(row, col) {
        if (row == this.grid.end()[0] && col == this.grid.end()[1])
            return (true);
        else
            return (false);
    }

    calculateHValue(row, col) {
        // Return using the distance formula

        return (Math.sqrt((row - this.grid.end()[0]) * (row - this.grid.end()[0]) + (col - this.grid.end()[1]) * (col - this.grid.end()[1])));
    }

    tracePath(cells) {
        let row = this.grid.end()[0];
        let col = this.grid.end()[1];

        let Path = [];
        while (!(cells[row][col].parent_i == row && cells[row][col].parent_j == col)) {
	    if(cells[row][col].parent_i == this.grid.start()[0] && cells[row][col].parent_j == this.grid.start()[1]) {
		return;
	    }
	    Path.push([row, col]);
            let temp_row = cells[row][col].parent_i;
            let temp_col = cells[row][col].parent_j;
            row = temp_row;
            col = temp_col;
	    this.grid.addToPath( row, col, color( 210, 90, 200, 250 ) );
        }
    }


    processCell( row, col, parentRow, parentCol, closedList, openList, cellDetails ) {
        if (this.isValid( row, col) == true) {


	    // If the destination cell is the same as the
            // current successor
            if( this.isDestination( row, col ) == true) {
                // Set the Parent of the destination cell
                cellDetails[ row ][ col ].parent_i = parentRow;
                cellDetails[ row ][ col ].parent_j = parentCol;
                console.log("The destination cell is found\n");
                this.tracePath(this.cellDetails);
                return true;
            }
            // If the successor is already on the closed
            // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[ row ][ col ] == false
		     && this.isUnBlocked(this.grid, row, col)
		     == true) {
                let gNew = cellDetails[parentRow][parentCol].g + 1;
                let hNew = this.calculateHValue( row, col);
                let fNew = gNew + hNew;

		this.grid.addToPath( row, col, color( 100, 100, 200, 100 ) );
		
                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[ row ][ col ].f == 2147483647
                    || cellDetails[ row ][ col ].f > fNew) {
                    openList.set(fNew, [ row , col ]);

                    // Update the details of this cell
                    cellDetails[ row ][ col ].f = fNew;
                    cellDetails[ row ][ col ].g = gNew;
                    cellDetails[ row ][ col ].h = hNew;
                    cellDetails[ row ][ col ].parent_i = parentRow;
                    cellDetails[ row ][ col ].parent_j = parentCol;
                }
            }
        }
	return false;
    }
    
    search() {
        // If the source is out of range
        if (this.isValid(this.grid.start()[0], this.grid.start()[1]) == false) {
            console.log("Source is invalid\n");
            return false;
        }

        // If the destination is out of range
        if (this.isValid(this.grid.end()[0], this.grid.end()[1]) == false) {
            console.log("Destination is invalid\n");
            return false;
        }

        // If the destination cell is the same as source cell
        if (this.isDestination(this.grid.start()[0], this.grid.start()[1])
            == true) {
            console.log("We are already at the destination\n");
            return false;
        }

        let i, j;

        // while (this.openList.size > 0) {
	if( this.openList.size > 0 ) {
            let p = this.openList.entries().next().value

            // Remove this vertex from the open list
            this.openList.delete(p[0]);

            // Add this vertex to the closed list
            i = p[1][0];
            j = p[1][1];
	    // this.grid.addToPath( i, j );

	    this.closedList[i][j] = true;

            /*
              Generating all the 8 successor of this cell
	      
              N.W   N   N.E
              \   |   /
              \  |  /
              W----Cell----E
              / | \
              /   |  \
              S.W    S   S.E
	      
              Cell-->Popped Cell (i, j)
              N -->  North       (i-1, j)
              S -->  South       (i+1, j)
              E -->  East        (i, j+1)
              W -->  West           (i, j-1)
              N.E--> North-East  (i-1, j+1)
              N.W--> North-West  (i-1, j-1)
              S.E--> South-East  (i+1, j+1)
              S.W--> South-West  (i+1, j-1)*/

            // To store the 'g', 'h' and 'f' of the 8 successors
            let gNew, hNew, fNew;

	    if( this.processCell( i - 1, j, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
		return true;
	    } //up
	    if( this.processCell( i + 1, j, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
		return true;
	    } //down
	    if( this.processCell( i, j + 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
		return true;
	    }; //right
	    if( this.processCell( i, j - 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
		return true;
	    }; //left

	    // if( this.processCell( i - 1, j + 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
	    // 	return true;
	    // } //up
	    // if( this.processCell( i - 1, j - 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
	    // 	return true;
	    // } //up
	    // if( this.processCell( i + 1, j - 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
	    // 	return true;
	    // } //up
	    // if( this.processCell( i + 1, j - 1, i, j, this.closedList, this.openList, this.cellDetails ) == true ) {
	    // 	return true;
	    // } //up
        }

        return false;
    }

    hasNoSolution() {
	if( this.openList.size > 0 ) {
	    return false;
	}
	return true;
    }
}


///////////////////////////////////////////////////////////////////////////7
//////////////////////////////////////////////////////////////////////////

var grid;// = new Grid(50, 25, 900, 450);
var astar;
var lastTime = 0;
var found = false;
function setup() {
    let w = 900;
    w = min( w, windowWidth );
    createCanvas( w, w / 2 );
    grid = new Grid(50, 25, w, w / 2);
    
    background(200);
    grid.setBlocks();
    
    astar = new AStarSearch(grid)
    astar.search();
}

function draw() {

    background(200);
    grid.draw();

    if( found == false && millis() - lastTime > 20 ) {
	found = astar.search();
	
	if( astar.hasNoSolution() == true ) {
	    if( millis() - lastTime > 1000 ) {
		restart();
		lastTime = millis()
	    }
	} else {
	    lastTime = millis();
	}
    } else if( millis() - lastTime > 1000 ) {
	restart();
	lastTime = millis()
    }
    
    m_counter++;
}


function restart() {
    found = false;
    grid.setBlocks();
    grid.clearPath();
    astar = new AStarSearch(grid)
    astar.search();
}

function mouseClicked() {
    restart();
}

function keyPressed() {
    astar.search();
}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth );
    resizeCanvas( w, w / 2 );

    grid = new Grid(50, 25, w, w / 2);
    
    background(200);
    grid.setBlocks();
    
    astar = new AStarSearch(grid)
    astar.search();
}
