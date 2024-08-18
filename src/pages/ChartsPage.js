import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChartsPage = () => {
    const [data, setData] = useState([]);
    const [brushedData, setBrushedData] = useState([]);
    const scatterRef = useRef(null);
    const lineRef = useRef(null);
    const pieRef = useRef(null);
    const barRef = useRef(null);
    const areaRef = useRef(null);

    useEffect(() => {
        // Generate dummy data
        const generateData = (count) => {
            return Array.from({ length: count }, (_, i) => ({
                name: `Point ${i + 1}`,
                value: Math.floor(Math.random() * 1000) + 1,
                category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                date: new Date(2023, 0, 1 + i)
            }));
        };
        setData(generateData(1000));
    }, []);

    useEffect(() => {
        if (data.length === 0) return;
        drawScatterPlot();
        drawLineChart();
        drawBarChart();
        drawStackedAreaChart();
    }, [data]);

    useEffect(() => {
        if (brushedData.length === 0) return;
        drawPieChart();
    }, [brushedData]);

    const drawScatterPlot = () => {
        const svg = d3.select(scatterRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        const dots = g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", d => x(d.value))
            .attr("cy", d => y(d.value))
            .style("fill", d => color(d.category));

        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("end", brushended);

        g.append("g")
            .attr("class", "brush")
            .call(brush);

        function brushended(event) {
            if (!event.selection) return;
            const [[x0, y0], [x1, y1]] = event.selection;
            const selected = data.filter(d =>
                x(d.value) >= x0 && x(d.value) <= x1 &&
                y(d.value) >= y0 && y(d.value) <= y1
            );
            setBrushedData(selected);
            dots.attr("opacity", 0.3);
            dots.filter(d =>
                x(d.value) >= x0 && x(d.value) <= x1 &&
                y(d.value) >= y0 && y(d.value) <= y1
            ).attr("opacity", 1);
        }
    };

    const drawLineChart = () => {
        const svg = d3.select(lineRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));
    };

    const drawPieChart = () => {
        const svg = d3.select(pieRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const arc = g.selectAll(".arc")
            .data(pie(brushedData))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", d => color(d.data.category));

        arc.append("text")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.data.category);
    };

    const drawBarChart = () => {
        const svg = d3.select(barRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Aggregate data by category
        const aggregatedData = d3.rollup(data,
            v => d3.sum(v, d => d.value),
            d => d.category
        );
        const barData = Array.from(aggregatedData, ([category, value]) => ({ category, value }));

        x.domain(barData.map(d => d.category));
        y.domain([0, d3.max(barData, d => d.value)]);

        g.selectAll(".bar")
            .data(barData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.category))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value))
            .attr("fill", "steelblue");

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));
    };

    const drawStackedAreaChart = () => {
        const svg = d3.select(areaRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const stack = d3.stack()
            .keys(['A', 'B', 'C', 'D'])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const area = d3.area()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        // Prepare data for stacked area chart
        const groupedData = d3.group(data, d => d.date);
        const stackData = Array.from(groupedData, ([date, values]) => {
            const obj = { date };
            ['A', 'B', 'C', 'D'].forEach(category => {
                obj[category] = d3.sum(values, d => d.category === category ? d.value : 0);
            });
            return obj;
        });

        x.domain(d3.extent(stackData, d => d.date));
        y.domain([0, d3.max(stackData, d => d.A + d.B + d.C + d.D)]);

        const layer = g.selectAll(".layer")
            .data(stack(stackData))
            .enter().append("g")
            .attr("class", "layer");

        layer.append("path")
            .attr("class", "area")
            .style("fill", d => color(d.key))
            .attr("d", area);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Advanced Interactive D3 Charts</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h2>Scatter Plot with Brush</h2>
                    <svg ref={scatterRef} width={600} height={400}></svg>
                </div>
                <div>
                    <h2>Line Chart</h2>
                    <svg ref={lineRef} width={600} height={400}></svg>
                </div>
                <div>
                    <h2>Pie Chart of Selected Data</h2>
                    <svg ref={pieRef} width={400} height={400}></svg>
                </div>
                <div>
                    <h2>Bar Chart</h2>
                    <svg ref={barRef} width={600} height={400}></svg>
                </div>
                <div>
                    <h2>Stacked Area Chart</h2>
                    <svg ref={areaRef} width={600} height={400}></svg>
                </div>
                <div>
                    <h2>Selected Data Info</h2>
                    <p>Number of selected points: {brushedData.length}</p>
                    <p>Categories: {[...new Set(brushedData.map(d => d.category))].join(', ')}</p>
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Data Table</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Value</th>
                        <th style={tableHeaderStyle}>Category</th>
                        <th style={tableHeaderStyle}>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.slice(0, 10).map((d, i) => (
                        <tr key={i}>
                            <td style={tableCellStyle}>{d.name}</td>
                            <td style={tableCellStyle}>{d.value}</td>
                            <td style={tableCellStyle}>{d.category}</td>
                            <td style={tableCellStyle}>{d.date.toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p>Showing first 10 rows of {data.length} total rows</p>
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
};

const tableCellStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd'
};

export default ChartsPage;