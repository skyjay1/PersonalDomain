/* Milliseconds between simulation updates (tied to render updates) */
const INTERVAL = 40
/* Point color */
const COLOR = 'white'
/* Ratio of empty pixels to Points */
const COUNT_RATIO = 27000
/* Minimum number of Points */
const MIN_COUNT = 10
/* Maximum number of Points */
const MAX_COUNT = 200
/* Current number of Points */
let count = MIN_COUNT
/* True to run simulation */
let animated = true
/* List of Points */
let points = []

/* Point that contains position, velocity, and draw functionality */
class Point {
    radius = 3
    mindistsq = Math.pow(125, 2)

    constructor(x, y, dx, dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
    }

    move(width, height) {
        // wall collisions
        if(this.x < 0 || this.x > width) {
            this.dx *= -1
        }
        if(this.y < 0 || this.y > height) {
            this.dy *= -1
        }
        // movement
        this.x += this.dx
        this.y += this.dy
    }

    draw(cvs, ctx) {
        ctx.fillStyle = COLOR;
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    }

    connect(cvs, ctx, points, count) {
        let px = this.x
        let py = this.y
        let distsq = 0
        let a = 0
        for(let i = 0; i < count; i++) {
            px = points[i].x
            py = points[i].y
            distsq = Math.pow(this.x - px, 2) + Math.pow(this.y - py, 2)
            if(distsq < this.mindistsq) {
                // draw a line connecting the points
                a = 1.0 - distsq / this.mindistsq
                ctx.strokeStyle = 'rgba(255,255,255,' + a + ')';
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                ctx.lineTo(px, py)
                ctx.stroke()
            }
        }
    }
}

let initBackground = function(cvs, ctx) {
    points = []
    count = Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.floor((cvs.width * cvs.height) / COUNT_RATIO)))  
    for(let i = 0; i < count; i++) {
        let px = Math.floor(Math.random() * (cvs.width - 1))
        let py = Math.floor(Math.random() * (cvs.height - 1))
        let pdx = 2 - Math.random() * 4
        let pdy = 2 - Math.random() * 4
        points.push(new Point(px, py, pdx, pdy))
    }
    updateBackground(cvs, ctx)
}

let updateBackground = function (cvs, ctx) {
    for(let i = 0; i < count; i++) {
        points[i].move(cvs.width, cvs.height)
        points[i].draw(cvs, ctx)
        points[i].connect(cvs, ctx, points, count)
    }
}

let updateCanvasSize = function (cvs) {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight - cvs.offsetTop;
}

// stop the current interval
let resetInterval = function () {
    clearInterval(intervalVar)
    ctx.restore()
}

let toggleAnimation = function() {
    animated = !animated
}

let loadCanvas = function () {
    // attempt to load a screensaver
    let cvs = document.querySelector('canvas#bg')
    if (cvs != null) {
        console.log('Loading animated canvas')
        console.log('Animation enabled: ' + animated)
        updateCanvasSize(cvs)
        // if this screen has a painter, load and register interval
        if (cvs.getContext('2d')) {
            let ctx = cvs.getContext('2d')
            ctx.save()
            // initialize background
            initBackground(cvs, ctx);
            // schedule update to the painter every 40 ms
            intervalVar = window.setInterval(function () { 
                if(animated) {
                    // clear canvas
                    ctx.clearRect(0, 0, cvs.width, cvs.height)
                    // update canvas
                    updateBackground(cvs, ctx)
                }
            }, INTERVAL);
            // listen for window resizing
            document.body.onresize = function () {
                updateCanvasSize(cvs)
                initBackground(cvs, ctx)
            }
        }
    } else {
        console.warn('No canvas element found, animated background is disabled')
    }
}

window.addEventListener('load', loadCanvas, false);

