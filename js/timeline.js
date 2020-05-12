// Time
var dataTime = [
new Date(2018, 01),
new Date(2018, 05),
new Date(2018, 09),
new Date(2019, 01),
new Date(2019, 05),
new Date(2019, 09),
new Date(2020, 01)
];


var sliderTime = d3
.sliderBottom()
.min(d3.min(dataTime))
.max(d3.max(dataTime))
.step(1000*60*60*24*122)
.width(screen.width*1/3)
.tickFormat(d3.timeFormat('%B %Y'))
.tickValues(dataTime)
.default(new Date(2018, 01))
.on('onchange', val => {
 d3.select('p#value-time').text(d3.timeFormat('%B %Y')(val));
});

var gTime = d3
.select('div#slider-time')
.append('svg')
.attr('width', screen.width*1/2)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(30,30)');

gTime.call(sliderTime);
d3.select('p#value-time').text(d3.timeFormat('%B %Y')(sliderTime.value()));
