const fracC_svg = d3.select("#fracCPlot");

const margin = { top: 30, right: 20, bottom: 30, left: 50 };
const fracC_svg_width = fracC_svg.node().getBoundingClientRect().width;
const fracC_svg_height = fracC_svg.node().getBoundingClientRect().height;
const fracC_width = fracC_svg_width - margin.left - margin.right;
const fracC_height = fracC_svg_height - margin.top - margin.bottom;

const fracC_x_scale = d3.scaleLinear().range([0, fracC_width]);
const fracC_y_scale = d3.scaleLinear().range([fracC_height, 0]);

const fracC_g = fracC_svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const fracC_xAxis = fracC_g
    .append("g")
    .attr("transform", `translate(0, ${fracC_height})`);
const fracC_yAxis = fracC_g.append("g");

const line = d3
    .line()
    .x((d) => fracC_x_scale(d.time))
    .y((d) => fracC_y_scale(d.value))
    .curve(d3.curveLinear);

let data = [];

// 初期化処理
function init() {
    fracC_x_scale.domain([0, 30]); // 最初の 30 秒を表示
    fracC_y_scale.domain([0, 1]); // 値の範囲は 0 から 1

    fracC_xAxis.call(d3.axisBottom(fracC_x_scale).ticks(10));
    fracC_yAxis.call(d3.axisLeft(fracC_y_scale));

    // 初期線の設定
    fracC_g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("class", "line");
}

// データの更新処理
function update() {
    // 新しいデータの追加
    const newTime = data.length > 0 ? data[data.length - 1].time + 1 : 0;
    const newValue = Math.random();
    data.push({ time: newTime, value: newValue });

    fracC_x_scale.domain([0, newTime]); // 表示範囲を更新

    // ラインと軸の更新
    fracC_g.select(".line").attr("d", line(data));

    fracC_xAxis.call(d3.axisBottom(fracC_x_scale).ticks(10));
    fracC_yAxis.call(d3.axisLeft(fracC_y_scale));
}

init(); // 初期化処理の実行
setInterval(update, 1000); // 1秒ごとにデータを更新
