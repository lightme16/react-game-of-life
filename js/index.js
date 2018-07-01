var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Display = function (_React$Component) {
  _inherits(Display, _React$Component);

  function Display(props) {
    _classCallCheck(this, Display);

    var _this = _possibleConstructorReturn(this, (Display.__proto__ || Object.getPrototypeOf(Display)).call(this, props));

    _this.render = function () {
      return React.createElement(
        'div',
        { className: 'display' },
        'This is ',
        _this.props.genN,
        ' generation'
      );
    };

    return _this;
  }

  return Display;
}(React.Component);

var Board = function (_React$Component2) {
  _inherits(Board, _React$Component2);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this2 = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

    _this2.generateCells = function () {
      var cells = [];
      for (var i = 0; i < _this2.nCell; i++) {
        var row = [];
        for (var j = 0; j < _this2.nCell; j++) {
          var startX = i * _this2.cellSize;
          var startY = j * _this2.cellSize;
          row.push({
            x1: startX,
            y1: startY,
            x2: startX + _this2.cellSize,
            y2: startY + _this2.cellSize,
            alive: Math.random() > _this2.cellRation ? true : false
          });
        }
        cells.push(row);
      }
      console.log(cells);
      return cells;
    };

    _this2.drawCells = function (ctx, cells) {
      console.log('draw cells');
      cells.forEach(function (row) {
        return row.forEach(function (cell) {
          // draw border;
          ctx.fillStyle = "black";
          ctx.fillRect(cell.x1, cell.y1, cell.x2, cell.y2);
          // draw cell
          ctx.fillStyle = cell.alive ? "white" : 'red';
          ctx.fillRect(cell.x1 + _this2.borderSize, cell.y1 + _this2.borderSize, cell.x2 - _this2.borderSize, cell.y2 - _this2.borderSize);
        });
      });
    };

    _this2.nextGen = function (cells) {
      for (var i = 0; i < _this2.nCell; i++) {
        for (var j = 0; j < _this2.nCell; j++) {
          var neighbours = [];
          for (var iCell = Math.max(i - 1, 0); iCell < i + 2 && iCell < _this2.nCell; iCell++) {
            for (var jCell = Math.max(j - 1, 0); jCell < j + 2 && jCell < _this2.nCell; jCell++) {
              if (iCell == i && jCell == j) continue;
              var cell = cells[iCell][jCell];
              neighbours.push(cell);
            }
          }
          var nNeighbours = neighbours.filter(function (cell) {
            return cell.alive;
          }).length;
          console.log(neighbours);
          console.log('has ' + nNeighbours + '! neighbours');
          if (nNeighbours == 3) cells[i][j].alive = true;else if (nNeighbours < 2 || nNeighbours > 3) cells[i][j].alive = false;
        }
      }
      return cells;
    };

    _this2.initCanvas = function () {
      var ctx = _this2.refs.canvas.getContext("2d");
      ctx.fillRect(0, 0, _this2.props.size, _this2.props.size);
    };

    _this2.updateCanvas = function () {
      var ctx = _this2.refs.canvas.getContext("2d");
      _this2.drawCells(ctx, _this2.state.cells);
    };

    _this2.nextGenHandler = function (ev) {
      console.log('button clicked!');
      _this2.props.newGenCallback();
      ev.preventDefault();
      var cells = _this2.nextGen(_this2.state.cells);
      console.log('next cells');
      console.log(cells);
      _this2.setState({
        cells: cells
      });
    };

    _this2.randomGenHandler = function (ev) {
      ev.preventDefault();
      var cells = _this2.generateCells();
      _this2.setState({
        cells: cells
      });
    };

    _this2.render = function () {
      console.log(_this2.state);
      return React.createElement(
        'div',
        { className: 'board' },
        React.createElement('canvas', { ref: 'canvas', width: _this2.props.size, height: _this2.props.size }),
        React.createElement(
          'div',
          { className: 'controls' },
          React.createElement(
            'button',
            { onClick: _this2.nextGenHandler },
            'Next Generation'
          ),
          React.createElement(
            'button',
            { onClick: _this2.randomGenHandler },
            'Random'
          )
        )
      );
    };

    _this2.cellSize = 100;
    _this2.borderSize = Math.round(_this2.cellSize * 0.05);
    _this2.cellRation = 0.2;
    _this2.nCell = _this2.props.size / _this2.cellSize;
    _this2.state = {
      cells: []
    };
    return _this2;
  }

  _createClass(Board, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('mount!');
      this.initCanvas();
      var cells = this.generateCells();
      this.setState({ cells: cells });
      console.log('inited state');
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      console.log('update!');
      this.updateCanvas();
    }
  }]);

  return Board;
}(React.Component);

var Game = function (_React$Component3) {
  _inherits(Game, _React$Component3);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this3 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

    _this3.updateGenNumber = function () {
      _this3.setState({ genN: _this3.state.genN + 1 });
    };

    _this3.render = function () {
      return React.createElement(
        'div',
        { className: 'game' },
        React.createElement(
          'h1',
          null,
          'Game of Life'
        ),
        React.createElement(Board, { size: 700, newGenCallback: _this3.updateGenNumber }),
        React.createElement(Display, { genN: _this3.state.genN })
      );
    };

    _this3.state = {
      genN: 1
    };
    return _this3;
  }

  return Game;
}(React.Component);

ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(Game, null)
), document.getElementById("root"));