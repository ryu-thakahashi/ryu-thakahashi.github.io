const blue_color_code = "#208DC3";
const vermilion_color_code = "#E46C3C";
const green_color_code = "#37ADA5";
const pink_color_code = "#DC6B80";

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    const zoom = d3
        .zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", (event) => container.attr("transform", event.transform));
    svg.call(zoom);

    const container = svg.append("g");

    let nodes = [{ id: 0, color: pink_color_code }]; // 初期ノード,
    links = [];

    const simulation = d3
        .forceSimulation(nodes)
        .force(
            "link",
            d3
                .forceLink(links)
                .id((d) => d.id)
                .distance(50)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked)
        .on("end", adjustZoom);

    const linkGroup = container.append("g").attr("class", "links"),
        nodeGroup = container.append("g").attr("class", "nodes");

    function ticked() {
        const link = linkGroup
            .selectAll("line")
            .data(links, (d) => `${d.source.id}-${d.target.id}`);
        link.enter()
            .append("line")
            .attr("stroke", "#999")
            .merge(link)
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);
        link.exit().remove();

        const node = nodeGroup.selectAll("circle").data(nodes, (d) => d.id);
        node.enter()
            .append("circle")
            .attr("r", 5)
            // .attr("fill", "#ffaa00")
            .attr("fill", (d) => d.color)
            .call(drag(simulation))
            .merge(node)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", getNodeRadius);
        node.exit().remove();
    }

    function adjustZoom() {
        const bounds = container.node().getBBox(),
            dx = bounds.width,
            dy = bounds.height,
            x = bounds.x + dx / 2,
            y = bounds.y + dy / 2,
            scale = Math.max(
                0.1,
                Math.min(8, 0.9 / Math.max(dx / width, dy / height))
            ),
            translate = [width / 2 - scale * x, height / 2 - scale * y];
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(translate[0], translate[1])
                    .scale(scale)
            );
    }

    function drag(simulation) {
        return d3
            .drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }

    function updateNodeSizes() {
        nodes.forEach((node) => {
            node.linkCount = links.reduce(
                (acc, l) =>
                    acc +
                    (l.source.id === node.id || l.target.id === node.id
                        ? 1
                        : 0),
                0
            );
        });
    }

    function getNodeRadius(d) {
        return Math.sqrt(d.linkCount) * 10; // ベースサイズにリンク数に基づく追加サイズを加える
    }

    function createNewNode() {
        const nodeId = nodes.length;
        const color =
            Math.random() < 0.5 ? blue_color_code : vermilion_color_code; // 50% の確率で色を割り当て
        return { id: nodeId, color: color };
    }

    function createNewLink() {
        const target = Math.floor(Math.random() * nodes.length);
        return target;
    }

    function createNewLink_scalefree() {
        const target_link_id = Math.floor(Math.random() * links.length);
        console.log("id", target_link_id, links[target_link_id]);

        if (links[target_link_id] === undefined) {
            const target = createNewLink();
            return target;
        }
        const target_nodes = [
            links[target_link_id].source,
            links[target_link_id].target,
        ];
        const target = target_nodes[Math.floor(Math.random() * 2)];
        return target;
    }

    function createNewLink_scalefree_sameColor(from_node_color) {
        const target_link_id = Math.floor(Math.random() * links.length);
        console.log("id", target_link_id, links[target_link_id]);

        if (links[target_link_id] === undefined) {
            const target = createNewLink();
            return target;
        }

        const target_nodes = links[target_link_id];
        console.log("target_nodes", target_nodes);
        const source_color = target_nodes.source.color;
        const target_color = target_nodes.target.color;
        console.log("source_color", source_color);
        console.log("target_color", target_color);
        if (from_node_color === source_color) {
            console.log("source!!! color:", source_color);
            var target = links[target_link_id].source;
        } else if (from_node_color === target_color) {
            console.log("target!!! color:", target_color);
            var target = links[target_link_id].target;
        } else {
            console.log("random!!! color:", source_color, target_color);
            if (Math.random() < 0.5) {
                var target = links[target_link_id].source;
            } else {
                var target = links[target_link_id].target;
            }
        }
        return target;
    }

    function createNewLink_sameColor(from_node_color) {
        const target = Math.floor(Math.random() * nodes.length);
        if (nodes[target].color === from_node_color) {
            return target;
        }
        return createNewLink_sameColor(from_node_color);
    }

    let time_interval = 10;
    let intervalId = setInterval(addNodeAndLink, time_interval);

    startButton.addEventListener("click", () => {
        if (!intervalId) {
            intervalId = setInterval(addNodeAndLink, time_interval);
        }
    });

    stopButton.addEventListener("click", () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });

    function addNodeAndLink() {
        const nodeId = nodes.length;
        const newNode = createNewNode();

        nodes.push(newNode);
        // links.push({ source: newNode.id, target: createNewLink_scalefree() });
        // links.push({ source: newNode.id, target: createNewLink_scalefree() });
        // links.push({
        //     source: newNode.id,
        //     target: createNewLink_scalefree_sameColor(newNode.color),
        // });
        // links.push({
        //     source: newNode.id,
        //     target: createNewLink_scalefree_sameColor(newNode.color),
        // });
        links.push({
            source: newNode.id,
            target: createNewLink_sameColor(newNode.color),
        });
        links.push({
            source: newNode.id,
            target: createNewLink_sameColor(newNode.color),
        });

        simulation.nodes(nodes);
        simulation.force("link").links(links);
        updateNodeSizes();
        simulation.alpha(0.3).restart();
    }
    // setInterval(() => {
    //     // const nodeId = nodes.length,
    //     //     target = Math.floor(Math.random() * nodes.length),
    //     //     newNode = { id: nodeId };
    //     const newNode = createNewNode();
    //     const target_1 = createNewLink_scalefree();
    //     const target_2 = createNewLink_scalefree();
    //     nodes.push(newNode);
    //     links.push({ source: newNode.id, target: target_1 });
    //     links.push({ source: newNode.id, target: target_2 });

    //     simulation.nodes(nodes);
    //     simulation.force("link").links(links);
    //     updateNodeSizes();
    //     simulation.alpha(0.3).restart();
    // }, 1000);
});
