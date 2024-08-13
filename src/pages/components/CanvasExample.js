import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import circleFun from "./utils/circleForCanvas";
import lineFun from "./utils/lineForCanvas";
import arrowFun from "./utils/arrowForCanvas";
import dijkstraAlgo from "./utils/algorithms/DijkstraAlgo";

const useStyle = makeStyles({
	canvasStyle: ({ arrowName }) => ({
		marginTop: "10px",
		cursor: arrowName ? "grabbing" : "default",
	}),
});

const CanvasExample = ({ reload, setArr }) => {
	const canvasRef = useRef(null);
	const [resultArr, setResultArr] = useState([]);
	const [element, elementArr] = useState([]);
	const [arrows, setArrows] = useState([]);
	const [start, setStart] = useState({ x: 10, y: 14.5 });
	const [end, setEnd] = useState({ x: 40, y: 10 });
	const [startLoctionForDijkstra, setStartLocation] = useState(null);
	const [finishLoctionForDijkstra, setFinishLoaction] = useState(null);
	const [dragDeatils, setDragDetails] = useState({
		arrowName: undefined,
	});
	const { canvasStyle } = useStyle(dragDeatils);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight / 1.3;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight / 1.3}px`;
		canvas.style.background = "#32567a";
		const ctx = canvas.getContext("2d");
		const Circle = circleFun(ctx);
		const Line = lineFun(ctx);
		const Arrow = arrowFun(ctx);
		const yminLimit = 50
		const ymaxLimit = window.innerHeight / 2.3 - 10
		const xminLimit = 10
		const xmaxLimit = window.innerWidth / 2.3 - 10

		//User should set the higher values of X and Y coordinates
		const maxX = 300
		const maxY = 160

		// Transformation
		const transY = ymaxLimit/maxY
		const transX = xmaxLimit/maxX

		//Lines
		const drawLines = [
			new Line({ x: 100*transX, y: 160*transY+yminLimit }, { x: 100*transX, y: 140*transY+yminLimit }), //1 to 4
			new Line({ x: 100*transX, y: 140*transY+yminLimit }, { x: 100*transX, y: 120*transY+yminLimit }), //4 to 8
			new Line({ x: 100*transX, y: 140*transY+yminLimit }, { x: 200*transX, y: 140*transY+yminLimit }), //4 to 5
			new Line({ x: 200*transX, y: 160*transY+yminLimit }, { x: 200*transX, y: 140*transY+yminLimit }), //2 to 5
			new Line({ x: 300*transX, y: 160*transY+yminLimit }, { x: 300*transX, y: 140*transY+yminLimit }), //3 to 6
			new Line({ x: 200*transX, y: 140*transY+yminLimit }, { x: 300*transX, y: 140*transY+yminLimit }), //5 to 6
			new Line({ x: 300*transX, y: 120*transY+yminLimit }, { x: 300*transX, y: 140*transY+yminLimit }), //7 to 6
			new Line({ x: 200*transX, y: 140*transY+yminLimit }, { x: 200*transX, y: 60*transY+yminLimit }), //5 to 10
			new Line({ x: 100*transX, y: 60*transY+yminLimit }, { x: 200*transX, y: 60*transY+yminLimit }), //9 to 10
			new Line({ x: 300*transX, y: 60*transY+yminLimit }, { x: 200*transX, y: 60*transY+yminLimit }), //11 to 10
			new Line({ x: 200*transX, y: 20*transY+yminLimit }, { x: 200*transX, y: 60*transY+yminLimit }), //12 to 10
			new Line({ x: 200*transX, y: 20*transY+yminLimit }, { x: 300*transX, y: 20*transY+yminLimit }), //12 to 13
			new Line({ x: 200*transX, y: 20*transY+yminLimit }, { x: 200*transX, y: 0*transY+yminLimit }), //12 to 15
			new Line({ x: 200*transX, y: 20*transY+yminLimit }, { x: 100*transX, y: 20*transY+yminLimit }), //12 to 14
		]
		
		//------------------------------------------------------------------

		const lines = [
			...drawLines
		];

		//Circle drawing

		const circleColor = "#000000";

		const a = new Circle(100*transX, 160*transY+yminLimit, circleColor, "Severs");
		const b = new Circle(100*transX, 140*transY+yminLimit, circleColor, "b");
		const c = new Circle(100*transX, 120*transY+yminLimit, circleColor, "Printing Room");
		const d = new Circle(200*transX, 160*transY+yminLimit, circleColor, "Meeting Room");
		const e = new Circle(200*transX, 140*transY+yminLimit, circleColor, "g");
		const f = new Circle(300*transX, 160*transY+yminLimit, circleColor, "Clive's Office");
		const g = new Circle(300*transX, 140*transY+yminLimit, circleColor, "Nha's office");
		const h = new Circle(100*transX, 60*transY+yminLimit, circleColor, "Exit");
		const i = new Circle(300*transX, 120*transY+yminLimit, circleColor, "Arun's Office");
		const j = new Circle(200*transX, 60*transY+yminLimit, circleColor, "h");
		const k = new Circle(300*transX, 60*transY+yminLimit, circleColor, "QlX Lab");
		const l = new Circle(200*transX, 20*transY+yminLimit, circleColor, "i");
		const m = new Circle(300*transX, 20*transY+yminLimit, circleColor, "Ankit's office");
		const n = new Circle(100*transX, 20*transY+yminLimit, circleColor, "Kitchen");
		const o = new Circle(200*transX, 0*transY+yminLimit, circleColor, "Ashton's office");
		
		//------------------------------------------------------------------------

		const circles = [
			a,
			b,
			c,
			d,
			e,
			f,
			g,
			h,
			i,
			j,
			k,
			l,
			m,
			n,
			o,
		];

		//drawing Lines
		lines.forEach((x) => x.draw());
		//drawing the circle
		circles.forEach((x) => x.draw());

		//Creating Arrow Objects
		let fisrtArrow = new Arrow(16, "#16fb04", "startArrow");
		let lastArrow = new Arrow(20, "red", "endArrow");

		fisrtArrow.move(start.x, start.y);
		lastArrow.move(end.x, end.y);

		setArrows([fisrtArrow, lastArrow]);

		elementArr(circles);

		//lines.forEach((x) => console.log(x.weight()));

		const Graph = dijkstraAlgo();
		const graph = new Graph();

		//add Vertex

		graph.addVartex("A");
		graph.addVartex("B");
		graph.addVartex("C");
		graph.addVartex("D");
		graph.addVartex("E");
		graph.addVartex("F");
		graph.addVartex("G");
		graph.addVartex("H");
		graph.addVartex("I");
		graph.addVartex("J");
		graph.addVartex("K");
		graph.addVartex("L");
		graph.addVartex("M");
		graph.addVartex("N");
		graph.addVartex("O");

		// add Edge
		/* for(let i=0; i< drawLines.length; i++){
			graph.addEdge(`A${i}`, `B${i}`, drawLines[i]);
		} */
		

		graph.addEdge(`A`, `B`, drawLines[0]);
		graph.addEdge(`B`, `C`, drawLines[1]);
		graph.addEdge(`B`, `G`, drawLines[2]);
		graph.addEdge(`F`, `G`, drawLines[3]);
		graph.addEdge(`K`, `L`, drawLines[4]);
		graph.addEdge(`G`, `L`, drawLines[5]);
		graph.addEdge(`L`, `M`, drawLines[6]);
		graph.addEdge(`G`, `H`, drawLines[7]);
		graph.addEdge(`D`, `H`, drawLines[8]);
		graph.addEdge(`H`, `N`, drawLines[9]);
		graph.addEdge(`H`, `I`, drawLines[10]);
		graph.addEdge(`I`, `O`, drawLines[11]);
		graph.addEdge(`I`, `J`, drawLines[12]);
		graph.addEdge(`E`, `I`, drawLines[13]);
		

		const findArr = graph.dijkstra(
			startLoctionForDijkstra,
			finishLoctionForDijkstra
		);
		// Saving the result arr
		setResultArr(findArr);
	}, [reload, start, end, startLoctionForDijkstra, finishLoctionForDijkstra]);

	//passing the result arr in parent
	setArr(resultArr);

	//Mouse Down

	const canvasMouseDown = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		//Cheaking ... is 'Click' events occurs upon arrows or not?
		arrows.forEach((x) => {
			if (x.click(mouseX, mouseY)) {
				setDragDetails({ arrowName: x.name });
			}
		});
	};

	const canvasMouseMove = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		//Dragging Arrows Logic
		arrows.forEach((x) => {
			if (dragDeatils.arrowName === "startArrow") {
				setStart({ x: mouseX, y: mouseY });
			}
			if (dragDeatils.arrowName === "endArrow") {
				setEnd({ x: mouseX, y: mouseY });
			}
		});
	};

	const canvasMouseUp = (e) => {
		setDragDetails({ arrowName: undefined });
		setStartLocation(null);
		setFinishLoaction(null);

		element.forEach((x) => {
			arrows.forEach((arrow) => {
				x.click(
					arrow.downPointX,
					arrow.downPointY,
					arrow.name,
					setStartLocation,
					setFinishLoaction
				);
			});
		});
	};

	return (
		<>
			<canvas
				ref={canvasRef}
				className={canvasStyle}
				onMouseDown={canvasMouseDown}
				onMouseUp={canvasMouseUp}
				onMouseMove={canvasMouseMove}
			/>
		</>
	);
};

export default CanvasExample;
