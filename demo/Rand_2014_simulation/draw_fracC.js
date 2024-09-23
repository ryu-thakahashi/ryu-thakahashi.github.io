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
function init_fracCPlots() {
    console.log("init_fracCPlots");
    data = [];
    fracC_x_scale.domain([0, 1]); // 最初の 30 秒を表示
    fracC_y_scale.domain([0, 1]); // 値の範囲は 0 から 1

    fracC_xAxis.call(d3.axisBottom(fracC_x_scale).ticks(10));
    fracC_yAxis.call(d3.axisLeft(fracC_y_scale));

    // 初期線の設定

    // クラス名 'line' のすべての線分を選択し、削除する
    fracC_g.selectAll("circle").remove();
    fracC_g.selectAll(".line").remove();

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
function update_fracC_plot() {
    let frac_data = [];
    for (let data_id = 0; data_id < data.length; data_id++) {
        let current_data = data[data_id];
        frac_data.push({
            time: current_data.time,
            value: current_data.frac_C,
        });
    }

    const newTime = data.length > 0 ? data[data.length - 1].time + 1 : 0;
    fracC_x_scale.domain([0, newTime]); // 表示範囲を更新

    // ラインと軸の更新
    fracC_g.select(".line").attr("d", line(frac_data));

    // ポイントの更新
    const points = fracC_g.selectAll("circle").data(frac_data);
    points
        .enter()
        .append("circle")
        .attr("r", 3)
        .merge(points)
        .attr("cx", (d) => fracC_x_scale(d.time))
        .attr("cy", (d) => fracC_y_scale(d.value))
        .attr("fill", "steelblue");

    points.exit().remove();

    fracC_xAxis.call(d3.axisBottom(fracC_x_scale).ticks(10));
    fracC_yAxis.call(d3.axisLeft(fracC_y_scale));
}
