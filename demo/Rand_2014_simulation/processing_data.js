function processingData(current_node_data, current_link_data) {
    function clac_fractionOfCooperators() {
        let cooperators = 0;
        for (let i = 0; i < current_node_data.length; i++) {
            if (current_node_data[i].strategy === "coop") {
                cooperators += 1;
            }
        }
        let frac_cooperators = cooperators / current_node_data.length;
        return frac_cooperators;
    }

    function calc_assortment() {
        let C_num = 0;
        let D_num = 0;
        let sum_CtoC = 0;
        let sum_DtoC = 0;
        for (let node_id = 0; node_id < current_node_data.length; node_id++) {
            let log_data = [];

            let target_node = current_node_data[node_id];
            let target_node_strategy = target_node.strategy;
            let target_node_neighbors = getNeighborIds(
                node_id,
                current_link_data
            );

            log_data.push({
                target_node: target_node,
                target_node_strategy: target_node_strategy,
                target_node_neighbors: target_node_neighbors,
                neighbor_strategies: getNeighborStrategies(
                    target_node_neighbors,
                    current_node_data
                ),
            });

            let target_coop;
            if (target_node_strategy === "coop") {
                C_num += 1;
                target_coop = true;
            } else if (target_node_strategy === "defect") {
                D_num += 1;
                target_coop = false;
            }

            let CtoC_num = 0;
            let DtoC_num = 0;
            for (
                let neighbor_id = 0;
                neighbor_id < target_node_neighbors.length;
                neighbor_id++
            ) {
                let current_neighbor_id = target_node_neighbors[neighbor_id];
                let current_neighbor_node =
                    current_node_data[current_neighbor_id];
                let current_neighbor_strategy = current_neighbor_node.strategy;
                if (
                    target_node_strategy === "coop" &&
                    current_neighbor_strategy === "coop"
                ) {
                    CtoC_num += 1;
                } else if (
                    target_node_strategy === "defect" &&
                    current_neighbor_strategy === "coop"
                ) {
                    DtoC_num += 1;
                }
            }

            if (target_coop) {
                sum_CtoC += CtoC_num / 4;
                C_num += 1;
            } else {
                sum_DtoC += DtoC_num / 4;
                D_num += 1;
            }
            // console.log(log_data);
            console.log(
                "target_coop:",
                target_coop,
                ", sum_CtoC:",
                sum_CtoC,
                ", sum_DtoC:",
                sum_DtoC,
                ", CtoC_num:",
                CtoC_num,
                ", DtoC_num:",
                DtoC_num
            );
        }

        let C_assortment;
        if (C_num === 0) {
            C_assortment = 0;
        } else {
            C_assortment = sum_CtoC / C_num;
        }

        let D_assortment;
        if (D_num === 0) {
            D_assortment = 0;
        } else {
            D_assortment = sum_DtoC / D_num;
        }

        let assortment = C_assortment - D_assortment;
        return assortment;
    }

    const current_round = data.length;
    const frac_C = clac_fractionOfCooperators();
    const assortment = calc_assortment();
    console.log(
        "current_round",
        current_round,
        ", frac_C",
        frac_C,
        ", assortment",
        assortment
    );
    data.push({
        time: current_round,
        frac_C: frac_C,
        assortment: assortment,
    });
}
