// SVG要素を選択
const network_plot = d3.select("#networkPlot");

// 力学モデルを設定
const simulation = d3
    .forceSimulation(nodes)
    .force(
        "link",
        d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(50)
    )
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(8));

// リンクを描画
const link = network_plot
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");
// ノードを描画
const color = d3.scaleOrdinal().domain([0, 1]).range(["#E46C3C", "#208DC3"]);
const node = network_plot
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 8)
    .attr("fill", (d) => color(d.strategy))
    .call(
        d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

// ノードのラベルを追加
node.append("title").text((d) => d.id);

// シミュレーションの更新時にリンクとノードの位置を更新
simulation.on("tick", () => {
    link.attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});

// ドラッグ操作の関数
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

for (let i = 0; i < 10; i++) {
    // network_obj.disconnect_a_neighbor_and_connect_cooporators();
    network_obj.disconnect_a_def_neighbor_and_connect_someone();
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}
