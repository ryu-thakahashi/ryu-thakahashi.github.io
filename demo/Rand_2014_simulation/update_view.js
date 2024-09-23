const range_N_input = document.getElementById("range_N");
const range_N_value = document.getElementById("range_N_value");
const range_bc_input = document.getElementById("range_bc");
const range_bc_value = document.getElementById("range_bc_value");
const range_initC_input = document.getElementById("range_initC");
const range_initC_value = document.getElementById("range_initC_value");

let param_N;
let param_bc;
let param_initC;

range_N_input.addEventListener("input", function () {
    param_N = range_N_input.value;
    range_N_value.textContent = range_N_input.value;
});
range_bc_input.addEventListener("input", function () {
    param_bc = range_bc_input.value;
    range_bc_value.textContent = range_bc_input.value;
});
range_initC_input.addEventListener("input", function () {
    param_initC = range_initC_input.value;
    range_initC_value.textContent = range_initC_input.value;
});

let imitation_value = null;
const imitation_radio_buttons = document.getElementsByName("imitationRadio");
function returnImitationValue() {
    for (let i = 0; i < imitation_radio_buttons.length; i++) {
        if (imitation_radio_buttons[i].checked) {
            let return_value = imitation_radio_buttons[i].id;
            if (return_value.includes("saticficer")) {
                imitation_value = "saticficer";
            } else if (return_value.includes("maximizer")) {
                imitation_value = "maximizer";
            }
            // console.log(return_value, imitation_value);
            return imitation_value;
        }
    }
}
// returnImitationValue();

window.onload = function () {
    range_N_value.textContent = range_N_input.value;
    range_bc_value.textContent = range_bc_input.value;
    range_initC_value.textContent = range_initC_input.value;
};
