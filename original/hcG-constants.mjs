// hCG reference ranges by day of pregnancy
// Values are in mIU/mL

// Helper function to create a range of days with the same value
const createDayRange = (start, end, value) => {
    const range = new Map();
    for (let day = start; day <= end; day++) {
        range.set(day, value);
    }
    return range;
};

// Lower reference ranges
const lower_hcg_by_day = new Map([
    [7, 2],    [8, 3],    [9, 5],    [10, 8],   [11, 11],
    [12, 17],  [13, 22],  [14, 29],  [15, 39],  [16, 68],
    [17, 120], [18, 220], [19, 370], [20, 520], [21, 750],
    [22, 1050], [23, 1400], [24, 1830], [25, 2400], [26, 4200],
    [27, 5400], [28, 7100], [29, 8800], [30, 10500], [31, 11500],
    [32, 12800], [33, 14000], [34, 15500], [35, 17000], [36, 19000],
    [37, 20500], [38, 22000], [39, 23000], [40, 25000], [41, 26500],
    [42, 28000]
]);

// Add ranges for days 43-48 (constant at 28000)
Object.assign(lower_hcg_by_day, createDayRange(43, 48, 28000));

// Add ranges for days 49-84 (constant at 20000)
Object.assign(lower_hcg_by_day, createDayRange(49, 84, 20000));

// Upper reference ranges
const upper_hcg_by_day = new Map([
    [7, 10],    [8, 18],    [9, 21],    [10, 26],   [11, 45],
    [12, 65],   [13, 105],  [14, 170],  [15, 270],  [16, 400],
    [17, 580],  [18, 840],  [19, 1300], [20, 2000], [21, 3100],
    [22, 4900], [23, 6200], [24, 7800], [25, 9800], [26, 15600],
    [27, 19500], [28, 27300], [29, 33000], [30, 40000], [31, 60000],
    [32, 63000], [33, 68000], [34, 70000], [35, 74000], [36, 78000],
    [37, 83000], [38, 87000], [39, 93000], [40, 109000], [41, 117000],
    [42, 128000]
]);

// Add ranges for days 43-55 (constant at 200000)
Object.assign(upper_hcg_by_day, createDayRange(43, 55, 200000));

// Add ranges for days 56-62 (constant at 100000)
Object.assign(upper_hcg_by_day, createDayRange(56, 62, 100000));

// Add ranges for days 63-76 (constant at 95000)
Object.assign(upper_hcg_by_day, createDayRange(63, 76, 95000));

// Add ranges for days 77-84 (constant at 90000)
Object.assign(upper_hcg_by_day, createDayRange(77, 84, 90000));

// Median reference ranges
const median_hcg_by_day = new Map([
    [7, 5],     [8, 7],     [9, 11],    [10, 18],   [11, 28],
    [12, 45],   [13, 73],   [14, 105],  [15, 160],  [16, 260],
    [17, 410],  [18, 650],  [19, 980],  [20, 1380], [21, 1960],
    [22, 2680], [23, 3550], [24, 4650], [25, 6150], [26, 8160],
    [27, 10200], [28, 11300], [29, 13600], [30, 16500], [31, 19500],
    [32, 22600], [33, 24000], [34, 27200], [35, 31000], [36, 36000],
    [37, 39500], [38, 45000], [39, 51000], [40, 58000], [41, 62000],
    [42, 67000], [43, 73000], [44, 80000], [45, 90000], [46, 100000],
    [47, 90000], [48, 80000]
]);

// Add ranges for days 49-55 (constant at 70000)
Object.assign(median_hcg_by_day, createDayRange(49, 55, 70000));

// Add ranges for days 56-62 (constant at 65000)
Object.assign(median_hcg_by_day, createDayRange(56, 62, 65000));

// Add ranges for days 63-69 (constant at 60000)
Object.assign(median_hcg_by_day, createDayRange(63, 69, 60000));

// Add ranges for days 70-76 (constant at 55000)
Object.assign(median_hcg_by_day, createDayRange(70, 76, 55000));

// Add ranges for days 77-84 (constant at 45000)
Object.assign(median_hcg_by_day, createDayRange(77, 84, 45000));

export { lower_hcg_by_day, upper_hcg_by_day, median_hcg_by_day };