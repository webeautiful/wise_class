class ChartCtrl {

  constructor($state, chartService) {
    this.chartService = chartService;
    this.init();
  }

  init() {
    this.chartService.initFinalScore();
  }
}

ChartCtrl.$inject = [
  '$state',
  'chartService'
]

export default ChartCtrl
