// SVGのサイズを取得
const network_plot_svg = document.getElementById("networkPlot");
const width = network_plot_svg.clientWidth;
const height = network_plot_svg.clientHeight;

const global_node_num = 100;
const global_mean_degree = 2.5;
class NetworkSimulation {
    constructor(init_C_ratio, bc_ratio, theta) {
        if (typeof init_C_ratio !== "number") {
            throw new Error("init_C_ratio must be a number");
        }
        if (init_C_ratio < 0 || init_C_ratio > 1) {
            throw new Error("init_C_ratio must be between 0 and 1");
        }
        if (typeof bc_ratio !== "number") {
            throw new Error("bc_ratio must be a number");
        }
        if (typeof theta !== "number") {
            throw new Error("theta must be a number");
        }
        if (theta < 0 || theta > 1) {
            throw new Error("theta must be between 0 and 1");
        }

        this.init_C_ratio = init_C_ratio;
        this.bc_ratio = bc_ratio;
        this.theta = theta;

        this.node_num = global_node_num;
        this.link_num = global_mean_degree * global_node_num;
        this.disconnected_count = 0;
    }

    check_parameters() {
        console.log(
            "**parameters**  ",
            "init_C_ratio: ",
            this.init_C_ratio,
            "bc_ratio: ",
            this.bc_ratio,
            "theta: ",
            this.theta
        );
    }

    check_strategies_state() {
        const cooperator_num = this.strategies_array.reduce(
            (acc, curr) => acc + curr
        );
        console.log(
            "init_C * total: ",
            this.init_C_ratio * this.node_num,
            ", cooperator_num: ",
            cooperator_num
        );
        console.log(this.strategies_array);
    }

    check_network_state() {
        const node_info = this.nodes;
        const link_info = this.links;
        console.log("node_info: ", node_info);
        console.log("link_info: ", link_info);
    }

    initialize_node_strategies() {
        let strategies_array = new Array(this.node_num).fill(0);
        for (let i = 0; i < this.node_num; i++) {
            const current_strategy = Math.random() < this.init_C_ratio ? 1 : 0;
            strategies_array[i] = current_strategy;
        }
        this.strategies_array = strategies_array;
    }

    generate_random_network() {
        this.initialize_node_strategies();

        const nodes = d3.range(this.node_num).map((d) => ({
            id: d,
            strategy: this.strategies_array[d],
            group: Math.floor(Math.random() * 2),
        }));
        const links = d3.range(this.link_num).map(() => ({
            source: Math.floor(Math.random() * this.node_num),
            target: Math.floor(Math.random() * this.node_num),
        }));

        this.nodes = nodes;
        this.links = links;

        return { nodes, links };
    }

    disconnect_a_neighbor_and_connect_cooporators() {
        this.disconnected_count++;
        const disconnect_link_id = Math.floor(Math.random() * this.link_num);
        const disconnect_link = this.links[disconnect_link_id];
        // console.log("disconnect_link: ", disconnect_link);

        const coop_num = this.strategies_array.reduce(
            (acc, curr) => acc + curr
        );
        if (coop_num === 0) {
            console.log("no cooperators");
            return;
        }

        let new_target_node_id = -1;
        while (new_target_node_id < 0) {
            const extracted_node_id = Math.floor(Math.random() * this.node_num);
            const extracted_node_strategy =
                this.strategies_array[extracted_node_id];
            if (extracted_node_strategy === 1) {
                new_target_node_id = extracted_node_id;
            }
        }
        // console.log(
        //     "new node id: ",
        //     new_target_node_id,
        //     "strategy: ",
        //     this.strategies_array[new_target_node_id]
        // );
        console.log("disconnected_count: ", this.disconnected_count);

        disconnect_link.target = new_target_node_id;

        return;
    }

    disconnect_a_def_neighbor_and_connect_someone() {
        this.disconnected_count++;
        const disconnect_link_id = Math.floor(Math.random() * this.link_num);
        const disconnect_link = this.links[disconnect_link_id];

        const coop_num = this.strategies_array.reduce(
            (acc, curr) => acc + curr
        );
        const def_num = this.node_num - coop_num;
        if (def_num === 0) {
            console.log("no defectors");
            return;
        }

        const target_node_id = disconnect_link.target;
        const target_node_strategy = this.strategies_array[target_node_id];
        if (target_node_strategy === 1) return;

        const new_target_node_id = Math.floor(Math.random() * this.node_num);
        disconnect_link.target = new_target_node_id;

        console.log("disconnected_count: ", this.disconnected_count);

        return;
    }
}

const init_C_ratio = 0.5;
const bc_ratio = 0.5;
const theta = 0.5;

const network_obj = new NetworkSimulation(init_C_ratio, bc_ratio, theta);
network_obj.check_parameters();
// network_obj.initialize_node_strategies();
// network_obj.check_strategies_state();

const { nodes, links } = network_obj.generate_random_network();
network_obj.check_strategies_state();
// network_obj.check_network_state();
network_obj.disconnect_a_neighbor_and_connect_cooporators();
