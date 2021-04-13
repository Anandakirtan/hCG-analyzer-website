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
    let conception_date;
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

    return conception_date;
}

function calculate() {
    conception_date = get_conception_date();
    let hcg1 = document.getElementById("hcg_1").value;
    let hcg2 = document.getElementById("hcg_2").value;
    let hcg3 = document.getElementById("hcg_3").value;
    let date_1 = new Date(document.getElementById("analyz_date_1").value);
    let date_2 = new Date(document.getElementById("analyz_date_2").value);
    let date_3 = new Date(document.getElementById("analyz_date_3").value);
    
    let diff1 = Math.round((date_1 - conception_date)/(1000*60*60*24));
    let diff2 = Math.round((date_2 - conception_date)/(1000*60*60*24));
    let diff3 = Math.round((date_3 - conception_date)/(1000*60*60*24));

    let norm_coef1 = median_hcg_by_day.get(diff2) / median_hcg_by_day.get(diff1);
    let norm_coef2 = median_hcg_by_day.get(diff3) / median_hcg_by_day.get(diff2);
    let rel_dev1 = (hcg2 - hcg1 * norm_coef1) / (hcg1 * norm_coef1) * 100;
    let rel_dev2 = (hcg3 - hcg2 * norm_coef2) / (hcg2 * norm_coef2) * 100;

    let anoutp1 = document.getElementById("anoutp_1");
    let anoutp2 = document.getElementById("anoutp_2");
    let anoutp3 = document.getElementById("anoutp_3");
    //let app_outp = document.getElementById("approximation_output");

    if (hcg1 >= lower_hcg_by_day.get(diff1) && hcg1 <= upper_hcg_by_day.get(diff1)) {
        anoutp1.innerText = `В норме. (${lower_hcg_by_day.get(diff1)} - ${upper_hcg_by_day.get(diff1)}, медиана ${median_hcg_by_day.get(diff1)})`;
    }
    else {
        if (hcg1 < lower_hcg_by_day.get(diff1)) {
            anoutp1.innerText = `Меньше нормы. (${lower_hcg_by_day.get(diff1)} - ${upper_hcg_by_day.get(diff1)}, медиана ${median_hcg_by_day.get(diff1)})`;
        }
        if (hcg1 > upper_hcg_by_day.get(diff1)) {
            anoutp1.innerText = `Больше нормы. (${lower_hcg_by_day.get(diff1)} - ${upper_hcg_by_day.get(diff1)}, медиана ${median_hcg_by_day.get(diff1)})`;
        }
    }
    if (!isNaN(hcg2)){
        if (hcg2 >= lower_hcg_by_day.get(diff2) && hcg2 <= upper_hcg_by_day.get(diff2)) {
            anoutp2.innerText = `В норме. (${lower_hcg_by_day.get(diff2)} - ${upper_hcg_by_day.get(diff2)}, медиана ${median_hcg_by_day.get(diff2)}). Должно быть ${Math.round(hcg1 * norm_coef1)}, отклонение ${Math.round(rel_dev1)}%`;
            console.log(1)
        }
        else {
            if (hcg2 < lower_hcg_by_day.get(diff2)) {
                anoutp2.innerText = `Меньше нормы. (${lower_hcg_by_day.get(diff2)} - ${upper_hcg_by_day.get(diff2)}, медиана ${median_hcg_by_day.get(diff2)}). Должно быть ${Math.round(hcg1 * norm_coef1)}, отклонение ${Math.round(rel_dev1)}%`;
            }
            if (hcg2 > upper_hcg_by_day.get(diff2)) {
                anoutp2.innerText = `Больше нормы. (${lower_hcg_by_day.get(diff2)} - ${upper_hcg_by_day.get(diff2)}, медиана ${median_hcg_by_day.get(diff2)}). Должно быть ${Math.round(hcg1 * norm_coef1)}, отклонение ${Math.round(rel_dev1)}%`;
            }
        }
    }
    if (!isNaN(hcg3)){
        if (hcg3 >= lower_hcg_by_day.get(diff3) && hcg3 <= upper_hcg_by_day.get(diff3)) {
            anoutp3.innerText = `В норме. (${lower_hcg_by_day.get(diff3)} - ${upper_hcg_by_day.get(diff3)}, медиана ${median_hcg_by_day.get(diff3)}). Должно быть ${Math.round(hcg2 * norm_coef2)}, отклонение ${Math.round(rel_dev2)}%`;
        }
        else {
            if (hcg3 < lower_hcg_by_day.get(diff3)) {
                anoutp3.innerText = `Меньше нормы. (${lower_hcg_by_day.get(diff3)} - ${upper_hcg_by_day.get(diff3)}, медиана ${median_hcg_by_day.get(diff3)}). Должно быть ${Math.round(hcg2 * norm_coef2)}, отклонение ${Math.round(rel_dev2)}%`;
            }
            if (hcg3 > upper_hcg_by_day.get(diff3)) {
                anoutp3.innerText = `Больше нормы. (${lower_hcg_by_day.get(diff3)} - ${upper_hcg_by_day.get(diff3)}, медиана ${median_hcg_by_day.get(diff3)}). Должно быть ${Math.round(hcg2 * norm_coef2)}, отклонение ${Math.round(rel_dev2)}%`;
            }
        }
    }
}

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