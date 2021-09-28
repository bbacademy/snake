
function rand(n) {
	return Math.round(Math.random() * n)
}
function equal(a, b) {
	return a.x == b.x && a.y == b.y
}

class SnakeGame {

	state = []
	speed = 7
	food = { x: 0, y: 0 }
	move = { x: 1, y: 0 }
	rows = 20
	cols = 20
	grid = 20

	constructor(selector, options) {
		if (typeof selector === 'string') {
			this.el = document.querySelector(selector)
			if (!this.el) throw 'no element found'
		} else if (selector instanceof HTMLElement) {
			this.el = selector
		}
		Object.assign(this, options)
		this.canvas = document.createElement('canvas')
		this.el.appendChild(this.canvas)
		this.ctx = this.canvas.getContext('2d')
		this.reset()
		this.next()
		this.draw()
		addEventListener('keydown', this.handleKeypress)
	}
	handleKeypress = e => {
		const { move } = this
		switch (e.key) {
			case 'Escape': move.x = 0; move.y = 0; break
			case 'ArrowUp': if (move.y == 0) { move.x = 0; move.y = -1; } break
			case 'ArrowDown': if (move.y == 0) { move.x = 0; move.y = 1; } break
			case 'ArrowLeft': if (move.x == 0) { move.x = -1; move.y = 0; } break
			case 'ArrowRight': if (move.x == 0) { move.x = 1; move.y = 0; } break
			default:
				if (e.keyCode > 48 && e.keyCode < 58) {
					this.speed = e.keyCode - 48
				}
		}
		clearTimeout(this.timer)
		this.next()
	}
	moveFood() {
		const { rows, cols, state, food } = this
		do {
			food.x = rand(rows)
			food.y = rand(cols)
		} while (state.some(segment => equal(segment, food)))
	}
	reset() {
		const { cols, rows, grid, move, state, canvas } = this
		canvas.width = cols * grid + grid
		canvas.height = rows * grid + grid
		move.x = 0
		move.y = 0
		state.length = 0
		state.push({ x: rand(cols), y: rand(rows) })
		this.moveFood()
	}
	next = () => {
		const { state, food, move, rows, cols } = this
		const colision = n => state.some(i => equal(i, n))
		const head = state.pop()
		const next = { x: head.x + move.x, y: head.y + move.y }
		if (next.x > cols) next.x = 0
		if (next.y > rows) next.y = 0
		if (next.x < 0) next.x = cols
		if (next.y < 0) next.y = rows
		if (!colision(next)) {
			state.push(head)
			state.push(next)
			equal(next, food) ? this.moveFood() : state.shift()
		} else {
			// alert('game over')
			this.reset()
		}
		this.timer = setTimeout(this.next, 1000 / this.speed)
	}
	draw = () => {
		const { ctx, cols, rows, grid, state, food } = this
		const scale = n => n * grid + 1
		ctx.fillStyle = "#fff"
		ctx.fillRect(0, 0, cols * grid + grid, rows * grid + grid)
		ctx.fillStyle = "#f00"
		ctx.fillRect(scale(food.x), scale(food.y), grid-2, grid-2)
		ctx.fillStyle = "#000"
		state.forEach((segment, i) => {
			ctx.fillRect(scale(segment.x), scale(segment.y), grid-2, grid-2)
		})
		requestAnimationFrame(this.draw)
	}
}

const game = new SnakeGame('#root')
