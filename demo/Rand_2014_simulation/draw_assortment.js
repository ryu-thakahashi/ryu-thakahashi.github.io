const assortment_svg = d3.select("#assortmentPlot");

const assortment_svg_width = assortment_svg
    .node()
    .getBoundingClientRect().width;
const assortment_svg_height = assortment_svg
    .node()
    .getBoundingClientRect().height;
const assortment_width = assortment_svg_width - margin.left - margin.right;
const assortment_height = assortment_svg_height - margin.top - margin.bottom;

const assortment_x_scale = d3.scaleLinear().range([0, assortment_width]);
const assortment_y_scale = d3.scaleLinear().range([assortment_height, 0]);

const assortment_g = assortment_svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const assortment_xAxis = assortment_g
    .append("g")
    .attr("transform", `translate(0, ${assortment_height})`);
const assortment_yAxis = assortment_g.append("g");

const assortment_line = d3
    .line()
    .x((d) => assortment_x_scale(d.time))
    .y((d) => assortment_y_scale(d.value))
    .curve(d3.curveLinear);

const assortment_zero_line = d3
    .line()
    .x((d) => assortment_x_scale(d.time))
    .y((d) => assortment_y_scale(d.value))
    .curve(d3.curveLinear);

// 初期化処理
function init_assortmentPlots() {
    console.log("init_assortmentPlots");
    data = [];
    assortment_x_scale.domain([0, 1]); // 最初の 30 秒を表示
    assortment_y_scale.domain([-0.2, 0.2]); // 値の範囲は 0 から 1

    assortment_xAxis.call(d3.axisBottom(assortment_x_scale).ticks(10));
    assortment_yAxis.call(d3.axisLeft(assortment_y_scale));

    // 初期線の設定

    // クラス名 'line' のすべての線分を選択し、削除する
    assortment_g.selectAll("circle").remove();
    assortment_g.selectAll(".line").remove();

    // 初期線の設定
    assortment_g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("class", "line");
}

// データの更新処理
function update_assortment_plot() {
    let assortment_data = [];
    for (let data_id = 0; data_id < data.length; data_id++) {
        let current_data = data[data_id];
        assortment_data.push({
            time: current_data.time,
            value: current_data.assortment,
        });
    }
    let zero_data = [];
    for (let data_id = 0; data_id < data.length; data_id++) {
        let current_data = data[data_id];
        zero_data.push({
            time: current_data.time,
            value: 0,
        });
    }

    const newTime = data.length > 0 ? data[data.length - 1].time + 1 : 0;
    assortment_x_scale.domain([0, newTime]); // 表示範囲を更新
    // console.log("assortment_data", assortment_data);

    // ラインと軸の更新
    assortment_g.select(".line").attr("d", assortment_line(assortment_data));
    // assortment_g
    //     .select(".line")
    //     .attr("d", assortment_zero_line(zero_data));

    // ポイントの更新
    const points = assortment_g.selectAll("circle").data(assortment_data);
    points
        .enter()
        .append("circle")
        .attr("r", 3)
        .merge(points)
        .attr("cx", (d) => assortment_x_scale(d.time))
        .attr("cy", (d) => assortment_y_scale(d.value))
        .attr("fill", "steelblue");

    points.exit().remove();

    assortment_xAxis.call(d3.axisBottom(assortment_x_scale).ticks(10));
    assortment_y_scale.domain([
        Math.min(...assortment_data.map((d) => d.value), -0.2),
        Math.max(...assortment_data.map((d) => d.value), 0.2),
    ]);
    assortment_yAxis.call(d3.axisLeft(assortment_y_scale));
}
