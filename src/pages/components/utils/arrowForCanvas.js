function arrowFun(ctx) {
	class Arrow {
		x = this.scaleX(0);
		y = this.scaleY(0);
		radius = window.innerHeight / 90;

		constructor(size, color, name) {
			this.color = color;
			this.name = name;
			this.size = size;
		}

		downPointX = this.x;
		downPointY = this.y;

		updateDownPoint() {
			//this.downPointX = this.scaleX(this.size / 2) + this.x;
			//this.downPointY = this.scaleY(2 * this.size) + this.y;
			this.downPointX = this.x;
			this.downPointY =  this.y;
			//console.log("this.x, this.y: ", this.x, this.y)
		}

		draw() {
			ctx.beginPath(); // note usage below

			// triangle 1, at left
			ctx.fillStyle = this.color;

			//re-writed to start with the down vertice of triangle
			//ctx.moveTo(this.scaleX(this.x), this.scaleY(0));
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			//left
			/* ctx.lineTo(this.scaleX(this.size / 2) - this.x,
			this.scaleY(2 * this.size) - this.y); // start at top left corner of canvas

			//right
			ctx.lineTo(this.scaleX(this.size) + this.x,
			this.scaleY(2 * this.size) + this.y); */

			//right
			/* ctx.moveTo(this.scaleX(0) + this.x, this.scaleY(this.size) + this.y); // start at top left corner of canvas

			//left
			ctx.lineTo(
				this.scaleX(this.size) + this.x,
				this.scaleY(this.size) + this.y
			); // go 200px to right (x), straight line from 0 to 0

			//down
			ctx.lineTo(
				this.scaleX(this.size / 2) + this.x,
				this.scaleY(2 * this.size) + this.y
			); // go to horizontal 100 (x) and vertical 200 (y) */
			//console.log("down triangle: ", this.scaleX(this.size / 2) + this.x, this.scaleY(2 * this.size) + this.y)
			ctx.closePath();
			ctx.fill(); // connect and fill
			// ctx.stroke();

			// ctx.lineWidth = 0.5;
			// ctx.strokeSyle = "blue";
			// ctx.stroke();
		}

		scaleX(xVal) {
			//return xVal * (window.innerWidth / 1550);
			return xVal;
		}

		scaleY(yVal) {
			return yVal;
		}

		// This for moving triangle
		move(xPos, yPos) {
			this.x = this.scaleX(xPos);
			this.y = this.scaleY(yPos);
			//console.log("this.x, this.y: ", this.x, this.y)
			this.draw();
			this.updateDownPoint();
		}

		area(/* x1, y1, x2, y2, x3, y3 */) {
			//return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
			return Math.abs(Math.PI*this.radius*this.radius);
		}

		click(mouseX, mouseY) {
			mouseX = this.scaleX(mouseX);
  			mouseY = this.scaleY(mouseY);
			/* const rightPoint = {
				xPos: this.scaleX(0) + this.x,
				yPos: this.scaleY(this.size) + this.y,
			};
			const leftPoint = {
				xPos: this.scaleX(this.size) + this.x,
				yPos: this.scaleY(this.size) + this.y,
			};
			const downPoint = {
				xPos: this.scaleX(this.size / 2) + this.x,
				yPos: this.scaleY(2 * this.size) + this.y,
			}; */

			/* Calculate area of triangle ABC */
			let A = this.area(
				/* leftPoint.xPos,
				leftPoint.yPos,
				rightPoint.xPos,
				rightPoint.yPos,
				downPoint.xPos,
				downPoint.yPos */
			);

			/* Calculate area of triangle PBC */
			let A1 = this.area(
				/* mouseX,
				mouseY,
				rightPoint.xPos,
				rightPoint.yPos,
				downPoint.xPos,
				downPoint.yPos */
			);

			/* Calculate area of triangle PAC */
			let A2 = this.area(
				/* leftPoint.xPos,
				leftPoint.yPos,
				mouseX,
				mouseY,
				downPoint.xPos,
				downPoint.yPos */
			);

			/* Calculate area of triangle PAB */
			let A3 = this.area(
				/* leftPoint.xPos,
				leftPoint.yPos,
				rightPoint.xPos,
				rightPoint.yPos,
				mouseX,
				mouseY */
			);

			/* Check if sum of A1, A2 and A3 is same as A */
			//.toFixed -> it will take 2 numbers after '.' (eg: 8.25)
			return true;
		}
	}

	return Arrow;
}

export default arrowFun;
