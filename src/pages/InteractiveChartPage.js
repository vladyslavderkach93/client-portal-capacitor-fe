import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const InteractiveChartPage = () => {
    const canvasRef = useRef();
    const tooltipRef = useRef();
    const [numDataPoints, setNumDataPoints] = useState(5000);
    const [colorScheme, setColorScheme] = useState('steelblue');

    const generateDummyData = (numItems) => {
        return Array.from({ length: numItems }, () => ({
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            r: Math.random() * 5 + 3,
        }));
    };

    const data = generateDummyData(numDataPoints);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 1000]).range([height, 0]);

        context.clearRect(0, 0, width, height);

        data.forEach(d => {
            context.beginPath();
            context.arc(xScale(d.x), yScale(d.y), d.r, 0, 2 * Math.PI);
            context.fillStyle = colorScheme;
            context.fill();
            context.stroke();
        });

        // Handle zooming
        const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event) => {
            context.clearRect(0, 0, width, height);
            const transform = event.transform;

            data.forEach(d => {
                context.beginPath();
                context.arc(transform.applyX(xScale(d.x)), transform.applyY(yScale(d.y)), d.r, 0, 2 * Math.PI);
                context.fillStyle = colorScheme;
                context.fill();
                context.stroke();
            });
        });

        d3.select(canvas).call(zoom);

        return () => {
            d3.select(canvas).on('.zoom', null);
        };
    }, [data, colorScheme]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>
                    Number of Data Points:
                    <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="1000"
                        value={numDataPoints}
                        onChange={(e) => setNumDataPoints(+e.target.value)}
                    />
                    {numDataPoints}
                </label>
                <label>
                    Color Scheme:
                    <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
                        <option value="steelblue">Steel Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="purple">Purple</option>
                    </select>
                </label>
            </div>
            <canvas ref={canvasRef} width={1200} height={600} style={{ width: '100%', height: '80vh', backgroundColor: '#f0f0f0' }}></canvas>
            <div ref={tooltipRef}
                 style={{
                     position: 'absolute',
                     backgroundColor: '#fff',
                     border: '1px solid #000',
                     padding: '5px',
                     borderRadius: '5px',
                     pointerEvents: 'none',
                     opacity: 0
                 }}></div>
        </div>
    );
};

export default InteractiveChartPage;