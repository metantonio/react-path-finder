import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import circleFun from "./utils/circleForCanvas";
import lineFun from "./utils/lineForCanvas";
import arrowFun from "./utils/arrowForCanvas";
import dijkstraAlgo from "./utils/algorithms/DijkstraAlgo";
import imageMap from "../../images/hardrock-map.jpeg"

const useStyle = makeStyles({
	canvasStyle: ({ arrowName }) => ({
		marginTop: "10px",
		cursor: arrowName ? "crosshair" : "default", // Cambiar cursor al seleccionar flecha
	}),
});

const CanvasExample = ({ reload, setArr }) => {
	const canvasRef = useRef(null);
	const [resultArr, setResultArr] = useState([]);
	const [element, elementArr] = useState([]);
	const [arrows, setArrows] = useState([]);
	const [start, setStart] = useState({ x: 10, y: 14.5 });
	const [end, setEnd] = useState({ x: 40, y: 14.5 });
	const [selectedArrow, setSelectedArrow] = useState(null);
	const [startLoctionForDijkstra, setStartLocation] = useState(null);
	const [finishLoctionForDijkstra, setFinishLoaction] = useState(null);
	const [dragDeatils, setDragDetails] = useState({
		arrowName: undefined,
	});
	//const { canvasStyle } = useStyle(dragDeatils);
	const { canvasStyle } = useStyle({ arrowName: selectedArrow });
	const circleColor = "#000000";
	const imgRef = useRef(null);
	const imgSrc = imageMap;
	const [imgLoaded, setImgLoaded] = useState(false);
	const [imgScale, setImgScale] = useState({ width: 0, height: 0, x: 0, y: 0 });
	//add the coordinates of the vertex of the image in pixels
	const mapData = {
		points:
			[
				{ coordinates: { x: 0, y: 0 }, color: circleColor, label: "0" },
				{ coordinates: { x: 1305, y: 0 }, color: circleColor, label: "1" },
				{ coordinates: { x: 1305, y: 649 }, color: circleColor, label: "2" },
				{ coordinates: { x: 0, y: 649 }, color: circleColor, label: "3" },
				{ coordinates: { x: 350, y: 514 }, color: circleColor, label: "c" },
				{ coordinates: { x: 369, y: 440 }, color: circleColor, label: "star" },
				{ coordinates: { x: 365, y: 408 }, color: circleColor, label: "star1" },
				{ coordinates: { x: 387, y: 325 }, color: circleColor, label: "hall1" },
				{ coordinates: { x: 405, y: 294 }, color: circleColor, label: "hall1a" },
				{ coordinates: { x: 440, y: 427 }, color: circleColor, label: "hall2" },
				{ coordinates: { x: 439, y: 325 }, color: circleColor, label: "halla" },
				{ coordinates: { x: 464, y: 323 }, color: circleColor, label: "halla1" },
				{ coordinates: { x: 485, y: 312 }, color: circleColor, label: "halla2" },
				{ coordinates: { x: 429, y: 300 }, color: circleColor, label: "halla3" },
				{ coordinates: { x: 454, y: 281 }, color: circleColor, label: "halla4" },
				{ coordinates: { x: 479, y: 281 }, color: circleColor, label: "halla5" },
				{ coordinates: { x: 498, y: 298 }, color: circleColor, label: "hall4" },
				{ coordinates: { x: 440, y: 361 }, color: circleColor, label: "hall3" },
				{ coordinates: { x: 503, y: 361 }, color: circleColor, label: "hallb" },
				{ coordinates: { x: 503, y: 380 }, color: circleColor, label: "hallb1" },
				{ coordinates: { x: 533, y: 380 }, color: circleColor, label: "hallc" },
				{ coordinates: { x: 533, y: 314 }, color: circleColor, label: "halld" },
				{ coordinates: { x: 520, y: 300 }, color: circleColor, label: "halld1" },
				{ coordinates: { x: 520, y: 256 }, color: circleColor, label: "halle" },
				{ coordinates: { x: 520, y: 128 }, color: circleColor, label: "hardrock" },
				{ coordinates: { x: 614, y: 314 }, color: circleColor, label: "hallf" },
				{ coordinates: { x: 614, y: 256 }, color: circleColor, label: "hallf1" },
				{ coordinates: { x: 612, y: 380 }, color: circleColor, label: "hallg" },
				{ coordinates: { x: 244, y: 420 }, color: circleColor, label: "hallh" },
				{ coordinates: { x: 215, y: 462 }, color: circleColor, label: "star2" },
				{ coordinates: { x: 245, y: 343 }, color: circleColor, label: "halli" },
				{ coordinates: { x: 307, y: 325 }, color: circleColor, label: "halli1" },
				{ coordinates: { x: 401, y: 256 }, color: circleColor, label: "hallj" },
				{ coordinates: { x: 401, y: 238 }, color: circleColor, label: "hallj1" },
				{ coordinates: { x: 313, y: 238 }, color: circleColor, label: "hallj2" },
				{ coordinates: { x: 313, y: 284 }, color: circleColor, label: "hallj3" },
				{ coordinates: { x: 245, y: 323 }, color: circleColor, label: "hallj4" },
				{ coordinates: { x: 700, y: 317 }, color: circleColor, label: "oculus" },
				{ coordinates: { x: 219, y: 274 }, color: circleColor, label: "hallk" },
				{ coordinates: { x: 313, y: 200 }, color: circleColor, label: "security" },
				{ coordinates: { x: 368, y: 290 }, color: circleColor, label: "highlimittables1" },
				{ coordinates: { x: 401, y: 210 }, color: circleColor, label: "highlimittables2" },
				{ coordinates: { x: 468, y: 400 }, color: circleColor, label: "nonsmokingslots" },
				{ coordinates: { x: 537, y: 420 }, color: circleColor, label: "highlimitslots" },
			],
		edges: [
			{ start: "c", end: "star" },
			{ start: "star", end: "star1" },
			{ start: "star1", end: "hall1" },
			{ start: "star", end: "hall2" },
			{ start: "star1", end: "hall2" },
			{ start: "hall3", end: "hall2" },
			{ start: "hall3", end: "halla" },
			{ start: "halla", end: "hall1" },
			{ start: "halla", end: "halla3" },
			{ start: "halla4", end: "halla3" },
			{ start: "halla4", end: "halla5" },
			{ start: "hall4", end: "halla5" },
			{ start: "halla", end: "halla1" },
			{ start: "halla1", end: "halla2" },
			{ start: "halla2", end: "hall4" },
			{ start: "hall3", end: "hallb" },
			{ start: "hallb1", end: "hallb" },
			{ start: "hallc", end: "hallb1" },
			{ start: "hallc", end: "halld" },			
			{ start: "hall4", end: "halld1" },
			{ start: "halld1", end: "halld" },
			{ start: "halld1", end: "halle" },
			{ start: "hardrock", end: "halle" },
			{ start: "halld", end: "hallf" },
			{ start: "hallf", end: "hallf1" },
			{ start: "halle", end: "hallf1" },
			{ start: "hallc", end: "hallg" },
			{ start: "hallf", end: "hallg" },
			{ start: "hallh", end: "star" },
			{ start: "hallh", end: "star2" },
			{ start: "hallh", end: "halli" },
			{ start: "hall1", end: "halli1" },
			{ start: "halli1", end: "halli" },
			{ start: "hall1", end: "hall1a" },
			{ start: "hall1a", end: "hallj" },
			{ start: "halle", end: "hallj" },
			{ start: "oculus", end: "hallf" },
			{ start: "hallj4", end: "halli" },
			{ start: "star1", end: "hallh" },
			{ start: "hall2", end: "hallh" },
			{ start: "hallj", end: "hallj1" },
			{ start: "hallj2", end: "hallj1" },
			{ start: "hallj2", end: "hallj3" },
			{ start: "hallj4", end: "hallj3" },
			{ start: "hallj4", end: "hallk" },
			{ start: "hallj2", end: "security" },
			{ start: "hallj1", end: "highlimittables2" },
			{ start: "hall3", end: "nonsmokingslots" },
			{ start: "hallb1", end: "nonsmokingslots" },
			{ start: "hallc", end: "highlimitslots" },
		]

	}

	const yminLimit = 50
	const ymaxLimit = window.innerHeight / 2.3 - 10
	const xminLimit = 10
	const xmaxLimit = window.innerWidth / 2.3 - 10

	let maxX = Math.max(...mapData.points.map(point => point.coordinates.x));
	let maxY = Math.max(...mapData.points.map(point => point.coordinates.y));

	const transY = ymaxLimit / maxY
	const transX = xmaxLimit / maxX

	useEffect(() => {
		const img = new Image();
		img.src = imgSrc;
		img.onload = () => {
			imgRef.current = img;
			setImgLoaded(true);
		};
	}, [imgSrc]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const canvasWidth = window.innerWidth;
		const offsetY = 1.4
		const canvasHeight = window.innerHeight / offsetY;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasHeight}px`;
		canvas.style.background = "#32567a";
		const ctx = canvas.getContext("2d");

		if (imgLoaded) {
			const canvasAspectRatio = canvasWidth / canvasHeight;
			const imgAspectRatio = imgRef.current.width / imgRef.current.height;

			let imgWidth, imgHeight;

			if (imgAspectRatio > canvasAspectRatio) {
				// Imagen más ancha que el canvas, ajusta el ancho
				imgWidth = canvasWidth;
				imgHeight = canvasWidth / imgAspectRatio;
			} else {
				// Imagen más alta que el canvas, ajusta la altura
				imgWidth = canvasHeight * imgAspectRatio;
				imgHeight = canvasHeight;
			}

			// Calcular el offset para centrar la imagen en el canvas
			const imgX = (canvasWidth - imgWidth) / 2;
			const imgY = (canvasHeight - imgHeight) / 2;
			//const imgX = 0;
			//const imgY = 0;
			console.log("ImgX, ImgY: ", imgX, imgY)

			setImgScale({ width: imgWidth, height: imgHeight, x: imgX, y: imgY });

			// Dibujar la imagen
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.globalAlpha = 0.5; // Transparencia de la imagen
			ctx.drawImage(imgRef.current, imgX, imgY, imgWidth, imgHeight);
			ctx.globalAlpha = 1.0; // Restaurar opacidad para otros elementos

			// Obtener el máximo X e Y de los puntos
			const originalMaxX = Math.max(...mapData.points.map(point => point.coordinates.x));
			const originalMaxY = Math.max(...mapData.points.map(point => point.coordinates.y));

			// Calcular la escala en el canvas
			const scaleX = imgWidth / originalMaxX;
			const scaleY = imgHeight / originalMaxY;

			// Ajustar maxX y maxY según la escala real del canvas
			const adjustedMaxX = imgWidth / (imgWidth / originalMaxX);
			const adjustedMaxY = imgHeight / (imgHeight / originalMaxY);

			// Ajustar maxX y maxY según la escala
			//const maxX = canvasWidth / scaleX;
			//const maxY = canvasHeight / scaleY;
			const maxX = (imgWidth) / originalMaxX;
			const maxY = (imgHeight / offsetY) / originalMaxY;

			// Extraer los datos de `mapData`
			const points = mapData.points.map((point, index) => {
				// Convertir las coordenadas del punto a escala de imagen
				console.log("ratioX", imgWidth / originalMaxX)
				const scaledX = point.coordinates.x * scaleX + imgX;
				const scaledY = point.coordinates.y * scaleY + imgY;

				// Convertir las coordenadas a la posición en el canvas				
				const canvasX = scaledX;
				const canvasY = scaledY;


				return {
					...point,
					coordinates: {
						x: canvasX,
						y: canvasY
					}
				};
			});
			const edges = mapData.edges;
			const Circle = circleFun(ctx);
			const Line = lineFun(ctx);
			const Arrow = arrowFun(ctx);
			let yminLimit = 50
			let ymaxLimit = window.innerHeight / 2.3 - 10
			let xminLimit = 10
			let xmaxLimit = window.innerWidth / 2.3 - 10
			let circleColor = "#000000";


			// Transformation
			let transY = ymaxLimit / maxY
			let transX = xmaxLimit / maxX



			// Crear un array de líneas
			let linesArray = edges.map(edge => {
				// Encontrar el punto de inicio y el punto final en el array de puntos
				const startPoint = points.find(point => point.label === edge.start).coordinates;
				const endPoint = points.find(point => point.label === edge.end).coordinates;

				// Crear una nueva instancia de Line con los puntos encontrados
				return new Line({ x: startPoint.x, y: startPoint.y }, { x: endPoint.x, y: endPoint.y });
			});

			console.log(linesArray);

			//------------------------------------------------------------------

			const lines = [
				...linesArray
			];

			//Circle drawing
			let circleArray = points.map((point, index) => {

				// Crear una nueva instancia de Line con los puntos encontrados
				return new Circle(point.coordinates.x, point.coordinates.y, point.color || circleColor, point.label.toLowerCase(), imgWidth, imgWidth);
			});


			//------------------------------------------------------------------------

			const circles = [...circleArray];

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



			const Graph = dijkstraAlgo();
			const graph = new Graph();

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
		}

	}, [reload, start, end, startLoctionForDijkstra, finishLoctionForDijkstra, imgLoaded]);

	//passing the result arr in parent
	setArr(resultArr);

	//Mouse Down

	const canvasMouseDown = (e, transX, transY) => {
		if (!selectedArrow) return; // Si no hay flecha seleccionada, no hacer nada
		const rect = canvasRef.current.getBoundingClientRect();
		console.log("rect:", rect)
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		console.log("mouse data: \n", "e.clientX:", e.clientX, "\n", "e.clientY:", e.clientY, "\n", "mouseX, mouseY: ", mouseX, mouseY)

		//Cheaking ... is 'Click' events occurs upon arrows or not?
		/* arrows.forEach((x) => {
			if (x.click(mouseX, mouseY)) {
				setDragDetails({ arrowName: x.name });
			}
		}); */

		const adjustedMouseX = (mouseX - imgScale.x) / ( imgScale.width);
		const adjustedMouseY = (mouseY - imgScale.y) / (imgScale.height);

		if (selectedArrow === "startArrow") {
			setStart({ x: mouseX, y: mouseY });
		} else if (selectedArrow === "endArrow") {
			setEnd({ x: mouseX, y: mouseY });
		}
		setSelectedArrow(null);
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
		//setDragDetails({ arrowName: undefined });
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
			<div>
				<button onClick={() => setSelectedArrow("startArrow")}>
					Select start point
				</button>
				<button onClick={() => setSelectedArrow("endArrow")}>
					Select finish point
				</button>
			</div>
			<canvas
				ref={canvasRef}
				className={canvasStyle}
				onMouseDown={(e) => canvasMouseDown(e, transX, transY)}
				onMouseUp={canvasMouseUp}
			//onMouseMove={canvasMouseMove}
			/>
		</>
	);
};

export default CanvasExample;
