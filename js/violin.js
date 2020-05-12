var dataset; //declare global varible, initially empty
d3.csv("data.csv", function(d) {
    return {
        year: d.year,
        solicitation: d.solicitation,
        solicitation_date_gen: d.solicitation_date_gen,
        employees: parseFloat(d.employees),
        special: d.special,
        pitch: d.pitch,
        prev_award: d.prev_award,
        phase: d.phase,
        select: d.select,
        financing_status: d.financing_status,
        cost: parseFloat(d.cost)
        };
    }).then(function(data) {
        dataset = data;
    });
