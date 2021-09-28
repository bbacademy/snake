
const cols = 20
const rows = 20
const grid = 10

const snake = []
const step = {
	x: 0,
	y: 0,
	speed: 7
}
const food = {
	x: 0,
	y: 0,
	move() {
		do {
			food.x = rand(rows)
			food.y = rand(cols)
		} while (snake.some(segment => equal(segment, food)))
	}
}

function rand(n) {
	return Math.round(Math.random() * n)
}

function scale(n) {
	return n * grid + (grid / 2)
}

function equal(a, b) {
	return a.x == b.x && a.y == b.y
}

function colision(next) {
	return snake.some(part => equal(part, next))
		|| next.x < 0
		|| next.y < 0
		|| next.x > cols
		|| next.y > rows
}

function reset() {
	food.move()
	snake.length = 0
	snake.push({ x: rand(cols), y: rand(rows) })
	step.x = 0
	step.y = 0
}

function move() {
	const head = snake.pop()
	const next = { x: head.x + step.x, y: head.y + step.y }
	if (!colision(next)) {
		snake.push(head)
		snake.push(next)
		equal(next, food) ? food.move() : snake.shift()
	} else {
		// alert('game over')
		reset()
	}
	draw()
	setTimeout(move, 1000 / step.speed)
}

function draw() {
	const ctx = container.getContext('2d')
	ctx.clearRect(0, 0, cols * grid + grid, rows * grid + grid)
	ctx.beginPath();
	ctx.fillStyle = "#0000ff"
	ctx.arc(scale(food.x), scale(food.y), grid / 2, 0, 2 * Math.PI)
	ctx.fill()
	snake.forEach((segment, i) => {
		if (i == 0) {
			ctx.beginPath();
			ctx.setLineDash([3, grid - 3])
			ctx.strokeStyle = '#000000'
			ctx.lineWidth = grid - 2
			ctx.lineCap = 'round'
			ctx.moveTo(scale(segment.x), scale(segment.y))
		} else {
			ctx.lineTo(scale(segment.x), scale(segment.y))
		}

		if (i == snake.length - 1) {
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = "#ff0000"
			ctx.arc(scale(segment.x), scale(segment.y), grid / 2, 0, 2 * Math.PI)
			ctx.fill()
		}
	})
}

addEventListener('keydown', e => {
	switch (e.key) {
		case 'ArrowUp': if (step.y == 0) { step.x = 0; step.y = -1; } break
		case 'ArrowDown': if (step.y == 0) { step.x = 0; step.y = 1; } break
		case 'ArrowLeft': if (step.x == 0) { step.x = -1; step.y = 0; } break
		case 'ArrowRight': if (step.x == 0) { step.x = 1; step.y = 0; } break
	}
})

addEventListener('load', e => {
	container.width = cols * grid + grid
	container.height = rows * grid + grid
	reset()
	move()
})

class SnakeGame {
	static defaultOptions = {
		cols: 20,
		rows: 20,
		grid: 20
	}
	
	state = []
	speed = 7
	food = { x: 0, y: 0 }
	move = { x: 0, y: 0 }

	get rows() { return this.options.rows }
	get cols() { return this.options.cols }
	get grid() { return this.options.grid }

	constructor(selector, options) {
		if (typeof selector === 'string') {
			this.el = document.querySelector(selector)
			if (!this.el) throw 'no element found'
		} if (selector instanceof HTMLElement) {
			this.el = selector
		}
		this.options = Object.assign({}, SnakeGame.defaultOptions, options)
		this.canvas = document.createElement('canvas')
		this.el.appendChild(this.canvas)
		this.ctx = this.canvas.getContext('2d')
		this.reset()
	}
	moveFood() {
		const { rows, cols, state, food } = this
		do {
			food.x = rand(rows)
			food.y = rand(cols)
		} while (state.some(segment => equal(segment, food)))
	}
	reset() {
		const { cols, rows, grid } = this
		this.canvas.width = cols * grid + grid
		this.canvas.height = rows * grid + grid
		this.move.x = 0
		this.move.y = 0
		this.state.length = 0
		this.moveFood()
	}
}

const game = new SnakeGame('body')
