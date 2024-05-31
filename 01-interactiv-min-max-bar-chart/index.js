import { InteractiveMaxMinBarChart } from "./interactive-max-min-bar-chart";

var index;

document.addEventListener('readystatechange', function() {
    if (document.readyState === "complete") { 
        index = new Index();
   } 
});

class Index {

    #interactiveBarChart

    constructor() {
        this.#interactiveBarChart = new InteractiveMaxMinBarChart();
    }
}