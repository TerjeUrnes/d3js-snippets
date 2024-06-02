import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

class InteractiveMaxMinBarChart {

    #graphElm;

    #dateElm;
    #maxValueElm;
    #minValueElm;

    #data;

    constructor() {

        this.GetDOMElements();

        fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.AddWeekends(data.measurements);
            this.MakeBarChart(data.measurements);
            this.#data = data.measurements;
        });
    }

    MakeBarChart(tempData) {

        const widthFrame = this.#graphElm.clientWidth;
        const heightFrame = this.#graphElm.clientHeight;
        const widthCanvas = widthFrame * 2;
        const heightCanvas = heightFrame * 2;

        const lowestMinValue = d3.min(tempData, d => d.min);
        const lowestGraphValue = lowestMinValue < 0 ? lowestMinValue - 1 : -1;

        const highestMaxValue = d3.max(tempData, d => d.max);
        const highestGraphValue = highestMaxValue + 3;

        console.log(lowestGraphValue + " " + lowestMinValue + " " + highestMaxValue + " " + highestGraphValue);

        const xAxesScale = d3.scaleBand() 
                    .domain(tempData.map(d => d.timestamp))
                    .range([0, widthCanvas]);

        const yAxesScale = d3.scaleLinear()
                    .domain([lowestGraphValue, highestGraphValue])
                    .range([0, heightCanvas]);

        // svg is the "canvas" that are drawing on.
        const svg = d3.create("svg")
                    .attr("viewBox", [0, 0, widthCanvas, heightCanvas])
                    .attr("width", widthFrame)
                    .attr("height", heightFrame);

        const size = widthCanvas / (tempData.length * 2)
        svg.append("defs").append("pattern")
                    .attr("id", "bg-img")
                    .attr("patternUnits", "userSpaceOnUse")
                    .attr("width", size)
                    .attr("height", size)
                    .append("image")
                        .attr("href", "../assets/images/stripes-white.png")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", size)
                        .attr("height", size);

        const dataElements = svg.append("g")
                    .selectAll("g")
                    .data(tempData);

        dataElements.join("rect")
                    .attr("x", d => xAxesScale(d.timestamp) - 0.5)
                    .attr("y", d => d.weekend ? 0 : heightCanvas)
                    .attr("width", xAxesScale.bandwidth() + 1)
                    .attr("height", d => d.weekend ? heightCanvas : 0)
                    .attr("style", "fill:#1c3063");

        dataElements.join("rect")
                    .attr("x", d => xAxesScale(d.timestamp) + 1)
                    .attr("y", d => heightCanvas - yAxesScale((d.min < 0 ? d.min : 0)))
                    .attr("width", xAxesScale.bandwidth() - 2)
                    .attr("height", d => d.min < 0 ? yAxesScale(d.min) : yAxesScale(0))
                    .attr("style", "fill:#0974aa;");

        dataElements.join("rect")
                    .attr("x", d => xAxesScale(d.timestamp) + 1)
                    .attr("y", d => heightCanvas - yAxesScale(0))
                    .attr("width", xAxesScale.bandwidth() - 2)
                    .attr("height", d => d.min < 0 ? yAxesScale(0) - yAxesScale(d.min) : 0)
                    .attr("style", "fill:#00aaff");

        dataElements.join("rect")
                    .attr("x", d => xAxesScale(d.timestamp) + 1)
                    .attr("y", d => heightCanvas - yAxesScale(d.max))
                    .attr("width", xAxesScale.bandwidth() - 2)
                    .attr("height", d => yAxesScale(d.max) - yAxesScale((d.min < 0 ? 0 : d.min)))
                    .attr("style", "fill:white");

        dataElements.join("rect")
                    .attr("x", d => xAxesScale(d.timestamp))
                    .attr("y", d => 0)
                    .attr("width", d => xAxesScale.bandwidth())
                    .attr("height", heightCanvas)
                    .attr("style", d => "fill:transparent;")
                    .on("click", e => {
                        console.log("click");
                        e.target.style = "fill:url(#bg-img);";
                    });

        this.#graphElm.append(svg.node());
    }

    AddWeekends(data) {
        for (let i = 0; i < data.length; i++) {
            const day = new Date(data[i].timestamp).getDay();
            data[i].weekend = day == 0 || day == 6 ? true : false;
        }
    }

    GetDOMElements() {
        this.#graphElm = document.getElementById("d3js-frame");
    }

    Resize() {
        this.#graphElm.innerHTML = "";
        this.MakeBarChart(this.#data);
    }
}

export { InteractiveMaxMinBarChart };