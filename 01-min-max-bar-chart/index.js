import { InteractiveMaxMinBarChart } from "./interactive-max-min-bar-chart.js";

var index;

document.addEventListener('readystatechange', function() {
    if (document.readyState === "complete") { 
        index = new Index();
   } 
});

window.addEventListener('resize', function() {
    index.Resize();
    window.setTimeout(function() {
        index.Resize();
    }, 600);
});

class Index {

    #interactiveBarChart

    constructor() {
        this.#interactiveBarChart = new InteractiveMaxMinBarChart();
    }

    Resize() {
        this.#interactiveBarChart.Resize();
    }
}