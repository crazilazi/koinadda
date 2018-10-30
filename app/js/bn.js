class bouncingball {

    static initBouncingBall() {
        var t = document.querySelector("canvas"),
            i = t.getContext("2d"),
            e = t.width = window.innerWidth,
            h = t.height = window.innerHeight - 50;

        function s(t, i) {
            return Math.floor(Math.random() * (i - t)) + t
        }

        function o(t, i, e, h, s, o) {
            this.x = t, this.y = i, this.velX = e, this.velY = h, this.color = s, this.size = o
        }
        o.prototype.draw = function () {
            i.beginPath(), i.fillStyle = this.color, i.arc(this.x, this.y, this.size, 0, 2 * Math.PI), i.fill()
        }, o.prototype.update = function () {
            this.x + this.size >= e && (this.velX = -this.velX), this.x - this.size <= 0 && (this.velX = -this.velX), this.y + this.size >= h && (this.velY = -this.velY), this.y - this.size <= 0 && (this.velY = -this.velY), this.x += this.velX, this.y += this.velY
        }, o.prototype.collisionDetect = function () {
            for (var t = 0; t < l.length; t++)
                if (this !== l[t]) {
                    var i = this.x - l[t].x,
                        e = this.y - l[t].y;
                    Math.sqrt(i * i + e * e) < this.size + l[t].size && (l[t].color = this.color = "rgb(" + s(0, 255) + "," + s(0, 255) + "," + s(0, 255) + ")")
                }
        };
        var l = [];
        ! function t() {
            for (i.fillStyle = "rgba(255,255,255,255)", i.fillRect(0, 0, e, h); l.length < 25;) {
                var n = s(10, 20),
                    r = new o(s(0 + n, e - n), s(0 + n, h - n), s(-7, 7), s(-7, 7), "rgb(" + s(0, 255) + "," + s(0, 255) + "," + s(0, 255) + ")", n);
                l.push(r)
            }
            for (var a = 0; a < l.length; a++) l[a].draw(), l[a].update(), l[a].collisionDetect();
            requestAnimationFrame(t)
        }()
    }
}