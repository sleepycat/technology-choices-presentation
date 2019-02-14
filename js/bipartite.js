var data = [
  ['Observability', 'Kubernetes', 100, 100],
  ['Observability', 'Istio', 100, 100],
  ['Security', 'GraphQL', 100, 100],
  ['Security', 'Flux', 100, 100],
  ['Determinism', 'Flux', 100, 100],
  ['Determinism', 'Emotion', 100, 100],
  ['Determinism', 'React', 100, 100],
  ['Determinism', 'Kubernetes', 100, 100],
  ['Developer Velocity', 'Flux', 100, 100],
  ['Observability', 'Flux', 100, 100],
  ['Observability', 'Google Cloud', 100, 100],
  ['Security', 'Docker', 100, 100],
  ['Security', 'React', 100, 100],
  ['Security', 'Istio', 100, 100],
  ['Security', 'npm', 100, 100],
  ['Observability', 'GraphQL', 100, 100],
  ['Robustness', 'Kubernetes', 100, 100],
  ['Robustness', 'Istio', 100, 100],
  ['Robustness', 'Progressive Web App', 100, 100],
  ['Mobile friendly', 'Progressive Web App', 100, 100],
  ['Mobile friendly', 'GraphQL', 100, 100],
  ['Automation friendly', 'GraphQL', 100, 100],
  ['Automation friendly', 'Github', 100, 100],
  ['Automation friendly', 'Kubernetes', 100, 100],
  ['Scalability', 'Kubernetes', 100, 100],
  ['Scalability', 'Docker', 100, 100],
  ['Scalability', 'Microservices', 100, 100],
  ['Scalability', 'ArangoDB', 100, 100],
  ['Scalability', 'Google Cloud', 100, 100],
  ['Performance', 'Kubernetes', 100, 100],
  ['Performance', 'ArangoDB', 100, 100],
  ['Performance', 'Emotion', 100, 100],
  ['Performance', 'Google Cloud', 100, 100],
  ['Extensible', 'Kubernetes', 100, 100],
  ['Developer Velocity', 'React', 100, 100],
  ['Developer Velocity', 'GraphQL', 100, 100],
  ['Developer Velocity', 'ArangoDB', 100, 100],
  ['Developer Velocity', 'Github', 100, 100],
  ['Developer Velocity', 'Google Cloud', 100, 100],
  ['Developer Velocity', 'Javascript', 100, 100],
  ['Developer Velocity', 'Emotion', 100, 100],
  ['Developer Velocity', 'npm', 100, 100],
  ['Cloud Native', 'Microservices', 100, 100],
  ['Cloud Native', 'Docker', 100, 100],
  ['Cloud Native', 'Kubernetes', 100, 100],
  ['Composability', 'React', 100, 100],
  ['Composability', 'GraphQL', 100, 100],
  ['Composability', 'Docker', 100, 100],
  ['Composability', 'Microservices', 100, 100],
  ['Composability', 'Emotion', 100, 100],
  ['Security', 'Javascript', 100, 100],
  ['Security', 'Google Cloud', 100, 100],
  ['Maintainability', 'Docker', 100, 100],
  ['Maintainability', 'React', 100, 100],
  ['Maintainability', 'Microservices', 100, 100],
  ['Maintainability', 'Emotion', 100, 100],
  ['Accessibility', 'React', 100, 100],
  ['Accessibility', 'Reach Router', 100, 100],
  ['Testability', 'React', 100, 100],
  ['Testability', 'Jest', 100, 100],
  ['Testability', 'GraphQL', 100, 100],
  ['Reproducibility', 'Flux', 100, 100],
  ['Reproducibility', 'Github', 100, 100],
  ['Reproducibility', 'Docker', 100, 100],
  ['High Leverage', 'Javascript', 100, 100],
  ['High Leverage', 'ArangoDB', 100, 100],
  ['High Leverage', 'Kubernetes', 100, 100],
  ['High Leverage', 'Microservices', 100, 100],
  ['High Leverage', 'Emotion', 100, 100],
  ['High Leverage', 'Docker', 100, 100],
  ['High Leverage', 'GraphQL', 100, 100],
  ['High Leverage', 'React', 100, 100],
  ['High Leverage', 'Jest', 100, 100],
  ['Portability', 'Kubernetes', 100, 100],
  ['Portability', 'Docker', 100, 100],
]

var color = {
  Security: '#3366CC',
  Observability: '#DC3912',
  'Developer Velocity': '#FF9900',
  Robustness: '#109618',
  'Cloud Native': '#bbc8ca',
  Performance: '#8ab9b5',
  Composability: '#e76f51',
  Extensible: '#de639a',
  Flexibility: '#5b9279',
  Scalability: '#704e2e',
  Maintainability: '#931f1d',
  'High Leverage': '#273c2c',
  Reproducibility: '#531cb3',
  Accessibility: '#944bbb',
  Portability: '#cbaa49',
  Testability: '#a2999e',
  Determinism: '#0d3b66',
  'Mobile friendly': '#119da4',
  'Automation friendly': '#7fd1b9',
}

var svg = d3
  .select('#graph')
  .append('svg')
  .attr('width', 960)
  .attr('height', 800)
var g = svg.append('g').attr('transform', 'translate(200,50)')

var bp = viz
  .bP()
  .data(data)
  .min(12)
  .pad(4)
  .height(600)
  .width(500)
  .barSize(35)
  .fill(d => color[d.primary])

g.call(bp)

g.selectAll('.mainBars')
  .on('mouseover', mouseover)
  .on('mouseout', mouseout)

g.selectAll('.mainBars')
  .append('text')
  .attr('class', 'label')
  .attr('x', d => (d.part == 'primary' ? -30 : 30))
  .attr('y', d => +6)
  .text(d => d.key)
  .attr('text-anchor', d => (d.part == 'primary' ? 'end' : 'start'))


function mouseover(d) {
  bp.mouseover(d)
  g.selectAll('.mainBars')
    .select('.perc')
    .text(function(d) {
      return d3.format('0.0%')(d.percent)
    })
}
function mouseout(d) {
  bp.mouseout(d)
  g.selectAll('.mainBars')
    .select('.perc')
    .text(function(d) {
      return d3.format('0.0%')(d.percent)
    })
}
d3.select(self.frameElement).style('height', '800px')
