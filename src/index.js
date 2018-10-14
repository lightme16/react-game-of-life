import './style.css';


function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {x, y}
}

class Display extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (<div className='display'>
            <h2>This is {this.props.genN} generation.
                {this.props.finished && ' Game is finished!'}</h2>
        </div>)
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.cellSize = 100;
        this.borderSize = Math.round(this.cellSize * 0.02);
        this.nCell = this.props.size / this.cellSize;
        this.totatSize = this.props.size + this.borderSize;
        this.cellRation = 0.2;
        this.state = {
            cells: [],
            nextGenInterval: 1000,
            autoNextEnabled: true,
            gameFinished: false
        };
        this.autoNextGenInterval;
    }

    componentDidMount = () => {
        this.initCanvas();
        let cells = this.generateCells();
        this.setState({cells: cells});
        this.autoNextGenInterval = setInterval(
            () => this.populateNextGen(),
            this.state.nextGenInterval
        );
    };

    componentDidUpdate() {
        console.log('update!');
        this.updateCanvas();
    }

    generateCells = (empty = false) => {
        let cells = [];
        for (let i = 0; i < this.nCell; i++) {
            let row = [];
            for (let j = 0; j < this.nCell; j++) {
                let startX = i * this.cellSize;
                let startY = j * this.cellSize;
                row.push({
                    x: startX,
                    y: startY,
                    alive: empty ? false : Math.random() < this.cellRation
                });
            }
            cells.push(row);
        }
        console.log(cells);
        return cells;
    };

    drawCells = (ctx, cells) => {
        console.log('draw cells');
        cells.forEach(row =>
            row.forEach(cell => {
                // draw border;
                ctx.fillStyle = "#212121";
                ctx.fillRect(
                    cell.x + this.borderSize * 0.5,
                    cell.y + this.borderSize * 0.5,
                    this.cellSize,
                    this.cellSize
                );
                // draw cell
                ctx.fillStyle = cell.alive ? "#27ae60" : '#ecf0f1';
                ctx.fillRect(
                    cell.x + this.borderSize,
                    cell.y + this.borderSize,
                    this.cellSize - this.borderSize,
                    this.cellSize - this.borderSize
                );
            })
        );
    };

    nextGen = cells => {
        let newCells = [];
        for (let i = 0; i < this.nCell; i++) {
            let rows = [];
            for (let j = 0; j < this.nCell; j++) {
                let neighbours = [];
                for (let iCell = Math.max(i - 1, 0); iCell < i + 2 && iCell < this.nCell; iCell++) {
                    for (let jCell = Math.max(j - 1, 0); jCell < j + 2 && jCell < this.nCell; jCell++) {
                        if (iCell == i && jCell == j)
                            continue;
                        let cell = cells[iCell][jCell];
                        neighbours.push(cell);
                    }
                }
                let nNeighbours = neighbours.filter(cell => cell.alive).length;
                console.log(`has ${nNeighbours}! neighbours`);

                let alive;
                if (nNeighbours === 3)
                    alive = true;
                else if (nNeighbours < 2 || nNeighbours > 3)
                    alive = false;
                else
                    alive = cells[i][j].alive;
                let newCell = {};
                Object.keys(cells[i][j]).forEach(key => newCell[key] = cells[i][j][key]);
                newCell.alive = alive;
                rows.push(newCell)

            }
            newCells.push(rows)
        }
        return newCells;
    };

    initCanvas = () => {
        let ctx = this.refs.canvas.getContext("2d");
        ctx.fillRect(0, 0, this.totatSize, this.totatSize);
    };

    updateCanvas = () => {
        let ctx = this.refs.canvas.getContext("2d");
        this.drawCells(ctx, this.state.cells);
    };

    populateNextGen = () => {
        let cells = this.nextGen(this.state.cells);
        let gameFinished = false;
        // no changes in the new generation, so assuming that game finished
        if (JSON.stringify(this.state.cells) === JSON.stringify(cells)) {
            gameFinished = true;
            this.setState({
                gameFinished: true,
                autoNextEnabled: false
            });
            clearInterval(this.autoNextGenInterval);
            this.autoNextGenInterval = null;
        }
        else {
            this.setState({
                cells: cells,
            });
        }
        this.props.newGenCallback({finished: gameFinished});
    };

    populateRandomGen = () => {
        let cells = this.generateCells();
        this.setState({
            cells: cells,
            gameFinished: false
        });
        this.props.newGenCallback({reset: true});
    };

    autoNextGenFunc = () => {
        if (this.autoNextGenInterval) {
            clearInterval(this.autoNextGenInterval);
            this.autoNextGenInterval = null;
            this.setState({autoNextEnabled: false});
        }
        else if (this.state.nextGenInterval > 0) {
            this.autoNextGenInterval = setInterval(
                () => this.populateNextGen(),
                this.state.nextGenInterval
            );
            this.setState({autoNextEnabled: true});
        }
    };

    clearCells = () => {
        let emptyCells = this.generateCells({empty: true});
        this.setState({
            cells: emptyCells,
            gameFinished: false
        })
    };

    canvasClick = (ev) => {
        const {x, y} = getCursorPosition(this.refs.canvas, ev);
        for (let i = 0; i < this.nCell; i++) {
            for (let j = 0; j < this.nCell; j++) {
                let cell = this.state.cells[i][j];
                if (x > cell.x && x < cell.x + this.cellSize &&
                    y > cell.y && y < cell.y + this.cellSize) {
                    cell.alive = !cell.alive;
                }
            }
        }
        this.setState({cells: this.state.cells});
    };

    render = () => {
        return (<div className='board'>
            <canvas ref="canvas" width={this.totatSize} height={this.totatSize} onClick={this.canvasClick}/>
            <div className='controls'>
                <div className='buttons'>
                    <button onClick={this.populateNextGen}>Next Generation</button>
                    <button onClick={this.populateRandomGen}>Random</button>
                    <button onClick={this.autoNextGenFunc}>{this.state.autoNextEnabled ? 'Disable' : 'Enable'} auto next
                        generation
                    </button>
                    <button onClick={this.clearCells}>Clear</button>
                </div>
            </div>
        </div>);
    };
}

class Game extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            genN: 1,
            finished: false
        }
    };

    updateGenNumber = ({reset = false, finished = false}={}) => {
        this.setState({
            genN: reset ? 1 : this.state.genN + 1,
            finished: finished
        });
    };

    render = () => {
        return (
            <div className='game'>
                <h1>Game of Life</h1>
                <Board size={700} newGenCallback={this.updateGenNumber}/>
                <Display genN={this.state.genN} finished={this.state.finished}/>
            </div>
        );
    };
}

ReactDOM.render(
    <div>
        <Game/>
    </div>,
    document.getElementById("root")
);
