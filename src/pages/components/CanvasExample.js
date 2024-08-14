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
		const transY = ymaxLimit / maxY
		const transX = xmaxLimit / maxX

		const circleColor = "#000000";

		const mapData = {
			points:
				[
					{ coordinates: { x: 100, y: 160 }, color: circleColor, label: "a" },
					{ coordinates: { x: 100, y: 140 }, color: circleColor, label: "b" },
					{ coordinates: { x: 100, y: 120 }, color: circleColor, label: "c" },
					{ coordinates: { x: 100, y: 60 }, color: circleColor, label: "d" },
					{ coordinates: { x: 100, y: 20 }, color: circleColor, label: "e" },
					{ coordinates: { x: 200, y: 160 }, color: circleColor, label: "f" },
					{ coordinates: { x: 200, y: 140 }, color: circleColor, label: "g" },
					{ coordinates: { x: 200, y: 60 }, color: circleColor, label: "h" },
					{ coordinates: { x: 200, y: 20 }, color: circleColor, label: "i" },
					{ coordinates: { x: 200, y: 0 }, color: circleColor, label: "j" },
					{ coordinates: { x: 300, y: 160 }, color: circleColor, label: "k" },
					{ coordinates: { x: 300, y: 140 }, color: circleColor, label: "l" },
					{ coordinates: { x: 300, y: 120 }, color: circleColor, label: "m" },
					{ coordinates: { x: 300, y: 60 }, color: circleColor, label: "n" },
					{ coordinates: { x: 300, y: 20 }, color: circleColor, label: "o" },
				],
			edges: [
				{ start: "a", end: "b" },
				{ start: "b", end: "c" },
				{ start: "b", end: "g" },
				{ start: "f", end: "g" },
				{ start: "k", end: "l" },
				{ start: "g", end: "l" },
				{ start: "l", end: "m" },
				{ start: "g", end: "h" },
				{ start: "d", end: "h" },
				{ start: "n", end: "h" },
				{ start: "i", end: "h" },
				{ start: "i", end: "o" },
				{ start: "i", end: "j" },
				{ start: "i", end: "e" },
			]

		}


		// Extraer los datos de `mapData`
		const points = mapData.points;
		const edges = mapData.edges;

		// Crear un array de líneas
		let linesArray = edges.map(edge => {
			// Encontrar el punto de inicio y el punto final en el array de puntos
			const startPoint = points.find(point => point.label === edge.start).coordinates;
			const endPoint = points.find(point => point.label === edge.end).coordinates;

			// Crear una nueva instancia de Line con los puntos encontrados
			return new Line({ x: startPoint.x * transX, y: startPoint.y * transY + yminLimit }, { x: endPoint.x * transX, y: endPoint.y * transY + yminLimit });
		});

		console.log(linesArray);

		//------------------------------------------------------------------

		const lines = [
			...linesArray
		];

		//Circle drawing



		const a = new Circle(100 * transX, 160 * transY + yminLimit, circleColor, "a");
		const b = new Circle(100 * transX, 140 * transY + yminLimit, circleColor, "b");
		const c = new Circle(100 * transX, 120 * transY + yminLimit, circleColor, "c");
		const d = new Circle(200 * transX, 160 * transY + yminLimit, circleColor, "f");
		const e = new Circle(200 * transX, 140 * transY + yminLimit, circleColor, "g");
		const f = new Circle(300 * transX, 160 * transY + yminLimit, circleColor, "k");
		const g = new Circle(300 * transX, 140 * transY + yminLimit, circleColor, "l");
		const h = new Circle(100 * transX, 60 * transY + yminLimit, circleColor, "d");
		const i = new Circle(300 * transX, 120 * transY + yminLimit, circleColor, "m");
		const j = new Circle(200 * transX, 60 * transY + yminLimit, circleColor, "h");
		const k = new Circle(300 * transX, 60 * transY + yminLimit, circleColor, "n");
		const l = new Circle(200 * transX, 20 * transY + yminLimit, circleColor, "i");
		const m = new Circle(300 * transX, 20 * transY + yminLimit, circleColor, "o");
		const n = new Circle(100 * transX, 20 * transY + yminLimit, circleColor, "e");
		const o = new Circle(200 * transX, 0 * transY + yminLimit, circleColor, "j");

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

		// add vertex to the graph
		points.forEach((point, index) => {
			graph.addVartex(point.label.toUpperCase());
		});
		
		// add each edge to the graph
		edges.forEach((edge, index) => {
			graph.addEdge(edge.start.toLocaleUpperCase(), edge.end.toLocaleUpperCase(), linesArray[index]);
		});

	
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
