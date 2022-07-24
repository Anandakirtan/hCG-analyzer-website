//import {lower_hcg_by_day, upper_hcg_by_day, median_hcg_by_day} from "./constants.js"

var lower_hcg_by_day = new Map([
    [7, 2],
    [8, 3],
    [9, 5],
    [10, 8],
    [11, 11],
    [12, 17],
    [13, 22],
    [14, 29],
    [15, 39],
    [16, 68],
    [17, 120],
    [18, 220],
    [19, 370],
    [20, 520],
    [21, 750],
    [22, 1050],
    [23, 1400],
    [24, 1830],
    [25, 2400],
    [26, 4200],
    [27, 5400],
    [28, 7100],
    [29, 8800],
    [30, 10500],
    [31, 11500],
    [32, 12800],
    [33, 14000],
    [34, 15500],
    [35, 17000],
    [36, 19000],
    [37, 20500],
    [38, 22000],
    [39, 23000],
    [40, 25000],
    [41, 26500],
    [42, 28000]
])

for (let i = 43; i < 49; ++i) {
    lower_hcg_by_day.set(i, 28000);
}

for (let i = 49; i <= 84; ++i) {
    lower_hcg_by_day.set(i, 20000);
}

var upper_hcg_by_day = new Map([
    [7, 10],
    [8, 18],
    [9, 21],
    [10, 26],
    [11, 45],
    [12, 65],
    [13, 105],
    [14, 170],
    [15, 270],
    [16, 400],
    [17, 580],
    [18, 840],
    [19, 1300],
    [20, 2000],
    [21, 3100],
    [22, 4900],
    [23, 6200],
    [24, 7800],
    [25, 9800],
    [26, 15600],
    [27, 19500],
    [28, 27300],
    [29, 33000],
    [30, 40000],
    [31, 60000],
    [32, 63000],
    [33, 68000],
    [34, 70000],
    [35, 74000],
    [36, 78000],
    [37, 83000],
    [38, 87000],
    [39, 93000],
    [40, 109000],
    [41, 117000],
    [42, 128000]
])

for (let i = 43; i < 56; ++i) {
    upper_hcg_by_day.set(i, 200000);
}

for (let i = 56; i < 63; ++i) {
    upper_hcg_by_day.set(i, 100000);
}

for (let i = 63; i < 77; ++i) {
    upper_hcg_by_day.set(i, 95000);
}

for (let i = 77; i <= 84; ++i) {
    upper_hcg_by_day.set(i, 90000);
}

var median_hcg_by_day = new Map([
    [7, 5],
    [8, 7],
    [9, 11],
    [10, 18],
    [11, 28],
    [12, 45],
    [13, 73],
    [14, 105],
    [15, 160],
    [16, 260],
    [17, 410],
    [18, 650],
    [19, 980],
    [20, 1380],
    [21, 1960],
    [22, 2680],
    [23, 3550],
    [24, 4650],
    [25, 6150],
    [26, 8160],
    [27, 10200],
    [28, 11300],
    [29, 13600],
    [30, 16500],
    [31, 19500],
    [32, 22600],
    [33, 24000],
    [34, 27200],
    [35, 31000],
    [36, 36000],
    [37, 39500],
    [38, 45000],
    [39, 51000],
    [40, 58000],
    [41, 62000],
    [42, 67000],
    [43, 73000],
    [44, 80000],
    [45, 90000],
    [46, 100000],
    [47, 90000],
    [48, 80000],
])

for (let i = 49; i < 56; ++i) {
    median_hcg_by_day.set(i, 70000);
}


for (let i = 56; i < 63; ++i) {
    median_hcg_by_day.set(i, 65000);
}


for (let i = 63; i < 70; ++i) {
    median_hcg_by_day.set(i, 60000);
}


for (let i = 70; i < 77; ++i) {
    median_hcg_by_day.set(i, 55000);
}


for (let i = 77; i <= 84; ++i) {
    median_hcg_by_day.set(i, 45000);
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function get_conception_date() {
    let pdpm_input = document.getElementById("pdpm_date").value;
    let conception_input = document.getElementById("conception_date").value;
    let cycle_length_input = document.getElementById("cycle_length").value;
    let today = new Date();
    let conception_diff_outp = document.getElementById("conception_diff");
    let menstr_diff_outp = document.getElementById("menstr_diff");

    if (cycle_length_input == null || cycle_length_input == "") {
        cycle_length_input = 28;
    }

    if (conception_input == null || conception_input == "") {
        if (pdpm_input == null || pdpm_input == "") {
            conception_diff_outp.innerText = `Недостаточно введенных данных`
            return -1;
        }
        else {
            let cycle = Number(cycle_length_input);
            let pdpm_date = new Date(pdpm_input);
            if (cycle > 28) {
                conception_date = pdpm_date.addDays(cycle - 14);
            }
            else {
                conception_date = pdpm_date.addDays(cycle / 2);
            }
        }
    }
    else {
        conception_date = new Date(conception_input);
    }

    let menstr_date = new Date(pdpm_input);
    conc_diff = Math.round((today-conception_date)/(1000*60*60*24));
    menstr_diff = Math.round((today-menstr_date)/(1000*60*60*24));
    conception_diff_outp.innerText = `Со дня зачатия прошло ${conc_diff - 1} дней`;
    if (!isNaN(menstr_diff)) {
        menstr_diff_outp.innerText = `Со дня последней менструации прошло ${menstr_diff - 1} дней`;
    }
    conception_date.setHours(0,0,0,0)
    return conception_date;
}

var data_fields = []
var conception_date

class DataField {
    value;
    date;
    constructor(id) {
      this.id = id
      this.value = 0;
      this.date = new Date();
    }

    get_data(){
        this.value = document.getElementById(`hcg_${this.id}`).value;
        this.date = new Date(document.getElementById(`analyz_date_${this.id}`).value);
        this.gest_age = Math.round((this.date - conception_date)/(1000*60*60*24));
    }

    output_gest_age(){            
        let gest_age_output = document.getElementById(`gest_age_outp_${this.id}`); 
        gest_age_output.innerText = `${this.gest_age}`;
    }

    output_is_norm() {
        let is_norm_output = document.getElementById(`is_normal_outp_${this.id}`);
        if (this.value >= lower_hcg_by_day.get(this.gest_age) && this.value <= upper_hcg_by_day.get(this.gest_age)) {
            is_norm_output.innerText = `Да`;
        }
        else {
            if (this.value < lower_hcg_by_day.get(this.gest_age)) {
                is_norm_output.innerText = `Меньше`; 
            }
            if (this.value > upper_hcg_by_day.get(this.gest_age)) {
                is_norm_output.innerText = `Больше`; 
            }
        }
    }

    output_norm(){
        let norm_output = document.getElementById(`norm_outp_${this.id}`);
        if (!isNaN(this.gest_age) && !median_hcg_by_day.has(this.gest_age)){
            norm_output.innerText `Нет табличных данных (со дня зачатия прошло ${gest_age} дней)`;
        }
        else{
            norm_output.innerText = `${lower_hcg_by_day.get(this.gest_age)} - ${upper_hcg_by_day.get(this.gest_age)} (${median_hcg_by_day.get(this.gest_age)})`;
        }
    }

    output_prediction(prev_date, prev_value){
        let prediction_output = document.getElementById(`prediction_outp_${this.id}`);
        let prev_gest_age = Math.round((prev_date - conception_date)/(1000*60*60*24));
        let pred_coef = Math.round(median_hcg_by_day.get(this.gest_age) / median_hcg_by_day.get(prev_gest_age));
        let prediction = prev_value * pred_coef;
        let rel_diff = Math.round((this.value - prediction) / (prediction) * 100);
        prediction_output.innerText = (!isNaN(rel_diff) ? ` ${prediction} (${rel_diff}%)` : ``);
    }

    output(prev_date, prev_value) {
        this.get_data();

        console.log(this.date, conception_date, (this.date - conception_date), (this.date - conception_date)/(1000*60*60*24), Math.round((this.date - conception_date)/(1000*60*60*24)))
        if (!isNaN(this.value) && !isNaN(this.gest_age)){
            this.output_gest_age()
            this.output_is_norm()
            this.output_norm()
            this.output_prediction(prev_date, prev_value)
        }
    }
  }

function calculate() {
    conception_date = get_conception_date();
    data_fields[0].output(NaN, NaN);
    for (let i = 1; i < data_fields.length; i++){
        data_fields[i].output(data_fields[i - 1].date, data_fields[i - 1].value);
    }
}

function get_new_data_field_html(id) {
    // create new DataField to the analizy_wrapper
    return (`<div class="analyze_bar">\n` + 
        `<input type="value" class="analizy_values" id="hcg_${id}" placeholder="ХГЧ ${id}">\n` + 
        `<input type="date" class="analizy" id="analyz_date_${id}" placeholder="Дата анализа ${id}">\n` +
        `<div class="analiz_output">\n` +
            `<p class="column_cell gest_age_cell" id="gest_age_outp_${id}"></p>\n` +
            `<p class="column_cell is_normal_cell" id="is_normal_outp_${id}"></p>\n` +
            `<p class="column_cell norm_cell" id="norm_outp_${id}"></p>\n` +
            `<p class="column_cell prediction_cell" id="prediction_outp_${id}"></p>\n` +
        `</div>\n` +
        `<input type="button" class="delete_button" onclick=delete_data_field() value="х">` + 
    `</div>\n`);
}
  
function add_data_field() {
    const wrapper = document.getElementById('actual_analizy_wrapper');
    const data_field_wrapper = document.createElement('div');
    data_field_wrapper.classList.add('data_field_wrapper');
    const id = wrapper.childElementCount;
    data_field_wrapper.id = `data_field_wrapper_${id}`;
    const data_field_html = get_new_data_field_html(id);
    data_field_wrapper.innerHTML = data_field_html;
    wrapper.appendChild(data_field_wrapper);
    data_fields.push(new DataField(id))
}

function delete_data_field(){
    const wrapper = document.getElementById('actual_analizy_wrapper');
    const to_delete_data_field = document.getElementById(`data_field_wrapper_${data_fields[data_fields.length - 1].id}`);
    wrapper.removeChild(to_delete_data_field);
    data_fields.pop();
}

add_data_field()
add_data_field()

// Get the input field
var input = document.getElementById("wrapper");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("send").click();
  }
});
