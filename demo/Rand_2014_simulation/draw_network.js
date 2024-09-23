const net_svg_content = d3.select("#networkPlot").node();
const net_width = net_svg_content.getBoundingClientRect().width;
const net_height = net_svg_content.getBoundingClientRect().height;

const network_svg = d3.select("#networkPlot");
const radius = Math.min(net_width, net_height) / 3;
const centerX = net_width / 2;
const centerY = net_height / 2;

console.log(
    "width",
    net_width,
    "height",
    net_height,
    "radius",
    radius,
    "centerX",
    centerX,
    "centerY",
    centerY
);

const blue_color_code = "#208DC3";
const vermilion_color_code = "#E46C3C";
const green_color_code = "#37ADA5";
const pink_color_code = "#DC6B80";

const node_color_dict = {
    coop: blue_color_code,
    defect: vermilion_color_code,
};
const strategy_num_dict = {
    coop: 1,
    defect: 0,
};

const createButton = document.getElementById("createButton");
const goButton = document.getElementById("goButton");
const stopButton = document.getElementById("stopButton");

function getNeighborIds(node_id, links) {
    let neighbor_ids = [];
    for (let link_id = 0; link_id < links.length; link_id++) {
        let link = links[link_id];
        if (link.source == node_id) {
            neighbor_ids.push(link.target);
        } else if (link.target == node_id) {
            neighbor_ids.push(link.source);
        }
    }
    return neighbor_ids;
}

function getNeighborStrategies(nei_ids, nodes) {
    let neighbor_strategies = [];
    for (let neighbor_id = 0; neighbor_id < nei_ids.length; neighbor_id++) {
        let neighbor_node = nodes[nei_ids[neighbor_id]];
        neighbor_strategies.push(neighbor_node.strategy);
    }
    return neighbor_strategies;
}

function generateNetwork() {
    let nodes = [];
    let links = [];

    const strategies = ["coop", "defect"];
    for (let i = 0; i < param_N; i++) {
        // add node
        const node_strategy_index = Math.random() < param_initC ? 0 : 1;
        const node_strategy = strategies[node_strategy_index];
        nodes.push({
            id: i,
            strategy: node_strategy,
            payoff: 0,
            color: node_color_dict[node_strategy],
        });

        // add link
        for (let j = 1; j < 3; j++) {
            let target = i + j;
            if (target >= param_N) {
                target -= param_N;
            }
            links.push({ source: i, target: target });
        }
    }

    return { nodes: nodes, links: links };
}

function drawNetwork(nodes, links) {
    function addNodePosInfor() {
        let angle = 0;
        let add_angle = (2 * Math.PI) / nodes.length;
        for (let node_id = 0; node_id < nodes.length; node_id++) {
            angle += add_angle;

            let node = nodes[node_id];
            node.pos_x = centerX + radius * Math.cos(angle);
            node.pos_y = centerY + radius * Math.sin(angle);
            // console.log("node_x", node.pos_x, "node_y", node.pos_y);
        }
    }

    function drawLink() {
        for (let link_id = 0; link_id < links.length; link_id++) {
            let link = links[link_id];
            let source_node = nodes[link.source];
            let target_node = nodes[link.target];
            network_svg
                .append("line")
                .attr("x1", source_node.pos_x)
                .attr("y1", source_node.pos_y)
                .attr("x2", target_node.pos_x)
                .attr("y2", target_node.pos_y)
                .attr("stroke", "gray")
                .attr("stroke-width", 2);
        }
    }

    function drawNode() {
        for (let node_id = 0; node_id < nodes.length; node_id++) {
            let node = nodes[node_id];
            network_svg
                .append("circle")
                .attr("cx", node.pos_x)
                .attr("cy", node.pos_y)
                .attr("r", 20)
                .attr("fill", node.color);
        }
    }

    function drawNodePayoff() {
        for (let node_id = 0; node_id < nodes.length; node_id++) {
            let node = nodes[node_id];
            network_svg
                .append("text")
                .attr("x", node.pos_x)
                .attr("y", node.pos_y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", 20)
                .attr("fill", "white")
                .text(node.payoff);
        }
    }

    addNodePosInfor();
    drawLink();
    drawNode();
    drawNodePayoff();
}

function calcPayoff(nodes, links) {
    let payoffs = [];
    for (let node_id = 0; node_id < nodes.length; node_id++) {
        let node = nodes[node_id];

        // add neighbor node id
        let neighbor_ids = getNeighborIds(node_id, links);

        // get neighbor strategies
        let neighbor_strategies = getNeighborStrategies(neighbor_ids, nodes);

        // calc payoff
        let coop_num = neighbor_strategies.filter(
            (strategy) => strategy == "coop"
        ).length;
        let link_num = neighbor_strategies.length;
        let my_strategy_num = strategy_num_dict[node.strategy];
        node.payoff = coop_num * param_bc - link_num * my_strategy_num;
        payoffs.push(node.payoff);
    }
    // console.log("payoffs", payoffs);
}

function updateNodeStrategy(nodes, links, imit_style) {
    function updateNodeStrategy_Maximizer() {
        // console.log("updateNodeStrategy_Maximizer called");
        function getSuccesserStrategy(nei_ids, nodes) {
            let maxPayoff = -100;
            let successerStrategy;
            for (
                let neighbor_id = 0;
                neighbor_id < nei_ids.length;
                neighbor_id++
            ) {
                let neighbor_node = nodes[nei_ids[neighbor_id]];
                if (neighbor_node.payoff > maxPayoff) {
                    maxPayoff = neighbor_node.payoff;
                    successerStrategy = neighbor_node.strategy;
                }
            }
            return successerStrategy;
        }

        let successor_strategies = [];
        for (let node_id = 0; node_id < nodes.length; node_id++) {
            let node = nodes[node_id];

            // add neighbor node id
            let neighbor_ids = getNeighborIds(node_id, links);
            neighbor_ids.push(node_id);

            // get successor strategy
            let successor_strategy = getSuccesserStrategy(neighbor_ids, nodes);
            successor_strategies.push(successor_strategy);
        }
        // console.log("successor_strategies", successor_strategies);

        for (let node_id = 0; node_id < nodes.length; node_id++) {
            let node = nodes[node_id];
            node.strategy = successor_strategies[node_id];
            node.color = node_color_dict[successor_strategies[node_id]];
        }
    }

    function updateNodeStrategy_Saticficer() {
        // console.log("updateNodeStrategy_Saticficer called");
        for (let node_id = 0; node_id < nodes.length; node_id++) {
            let node = nodes[node_id];
            if (node.payoff < 0) {
                node.strategy = "defect";
                node.color = node_color_dict["defect"];
            }
        }
    }

    if (imit_style == "maximizer") {
        updateNodeStrategy_Maximizer();
    } else if (imit_style == "saticficer") {
        updateNodeStrategy_Saticficer();
    }
}

createButton.addEventListener("click", function () {
    network_svg.selectAll("*").remove();

    param_N = range_N_input.value;
    param_bc = range_bc_input.value;
    param_initC = range_initC_input.value;
    imitation_style = returnImitationValue();

    console.log("createButton clicked");
    network_dict = generateNetwork();
    nodes = network_dict.nodes;
    links = network_dict.links;
    calcPayoff(nodes, links);
    drawNetwork(nodes, links);

    init_fracCPlots();
    init_assortmentPlots();
    processingData(nodes, links);
    update_fracC_plot();
    update_assortment_plot();
});

goButton.addEventListener("click", function () {
    console.log("goButton clicked");
    imitation_style = returnImitationValue();
    updateNodeStrategy(nodes, links, imitation_style);
    calcPayoff(nodes, links);
    drawNetwork(nodes, links);

    processingData(nodes, links);
    update_fracC_plot();
    update_assortment_plot();
});
