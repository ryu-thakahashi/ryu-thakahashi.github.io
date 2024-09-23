const go_btn = document.getElementById("goButton");
go_btn.addEventListener("click", () => {
    network_obj.disconnect_a_neighbor_and_connect_cooporators();
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
});
