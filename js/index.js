class Display extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return <div className='display'>This is {this.props.genN} generation</div>;
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.cellSize = 100;
        this.borderSize = Math.round(this.cellSize * 0.05);
        this.cellRation = 0.2;
        this.nCell = this.props.size / this.cellSize;
        this.state = {
            cells: []
        };
    }

    componentDidMount() {
        console.log('mount!');
        this.initCanvas();
        let cells = this.generateCells();
        this.setState({cells: cells});
        console.log('inited state');
    }

    componentDidUpdate() {
        console.log('update!');
        this.updateCanvas();
    }

    generateCells = () => {
        let cells = [];
        for (let i = 0; i < this.nCell; i++) {
            let row = [];
            for (let j = 0; j < this.nCell; j++) {
                let startX = i * this.cellSize;
                let startY = j * this.cellSize;
                row.push({
                    x1: startX,
                    y1: startY,
                    x2: startX + this.cellSize,
                    y2: startY + this.cellSize,
                    alive: Math.random() > this.cellRation ? true : false
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
                ctx.fillStyle = "black";
                ctx.fillRect(cell.x1, cell.y1, cell.x2, cell.y2);
                // draw cell
                ctx.fillStyle = cell.alive ? "white" : 'red';
                ctx.fillRect(cell.x1 + this.borderSize,
                    cell.y1 + this.borderSize,
                    cell.x2 - this.borderSize,
                    cell.y2 - this.borderSize);
            })
        );
    };

    nextGen = cells => {
        for (let i = 0; i < this.nCell; i++) {
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
                console.log(neighbours);
                console.log(`has ${nNeighbours}! neighbours`);
                if (nNeighbours == 3) cells[i][j].alive = true;
                else if (nNeighbours < 2 || nNeighbours > 3)
                    cells[i][j].alive = false;
            }
        }
        return cells;
    };

    initCanvas = () => {
        let ctx = this.refs.canvas.getContext("2d");
        ctx.fillRect(0, 0, this.props.size, this.props.size);
    }

    updateCanvas = () => {
        let ctx = this.refs.canvas.getContext("2d");
        this.drawCells(ctx, this.state.cells);
    };

    nextGenHandler = ev => {
        console.log('button clicked!');
        this.props.newGenCallback()
        ev.preventDefault();
        let cells = this.nextGen(this.state.cells);
        console.log('next cells');
        console.log(cells);
        this.setState({
            cells: cells
        });
    }

    randomGenHandler = ev => {
        ev.preventDefault();
        let cells = this.generateCells();
        this.setState({
            cells: cells
        });
    }

    render = () => {
        console.log(this.state);
        return (<div className='board'>
            <canvas ref="canvas" width={this.props.size} height={this.props.size} />
            <div className='controls'>
                <button onClick={this.nextGenHandler}>Next Generation</button>
                <button onClick={this.randomGenHandler}>Random</button>
            </div>
        </div>);
    };
}

class Game extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            genN: 1
        }
    };

    updateGenNumber = () => {
        this.setState({genN: this.state.genN + 1});
    }

    render = () => {
        return (
            <div className='game'>
                <h1>Game of Life</h1>
                <Board size={700} newGenCallback={this.updateGenNumber}/>
                <Display genN={this.state.genN}/>
            </div>
        );
    };
}

ReactDOM.render(
    <div>
        <Game />
    </div>,
    document.getElementById("root")
);
