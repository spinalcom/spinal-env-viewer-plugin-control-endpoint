import vue from "vue";
import legendsHeatmap from "./heatmap-container.vue";

let legendsHeatmapComponent = vue.extend(legendsHeatmap);
let app = new legendsHeatmapComponent();

app.$mount();
document.getElementsByTagName("body")[0].appendChild(app.$el);