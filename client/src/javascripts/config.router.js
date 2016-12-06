function routing($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.otherwise('/school')

  $urlRouterProvider.when('', '/index')
  $stateProvider.state('index', {
    url: '/index',
    templateUrl: 'teacher-realtime.html',
    controller: 'TeacherRealtimeCtrl as trc'
  })
    .state('chart', {
      url: '/chart',
      templateUrl: 'chart.html',
      controller: 'ChartCtrl as cc'
    })
    .state('admin', {
      url: '/admin',
      abstract: true,
      templateUrl: 'admin.html',
      controller: 'AdminCtrl as ac'
    })
    .state('admin.member', {
      url: '/member',
      templateUrl: 'member-management.html',
      controller: 'AdminMemberCtrl as amc'
    })
    .state('user', {
      url: '/user/:userId',
      templateUrl: 'profile.html',
      controller: 'ProfileCtrl as pc'
    })
    .state('subject', {
      url: '/subject',
      abstract: true,
      template: '<ui-view></ui-view>'
    })
    .state('subject.detail', {
      url: '/detail/:subjectId',
      templateUrl: 'subject-detail.html',
      controller: 'SubjectDetailCtrl as sdc'
    })
    .state('subject.new', {
      url: '/new/:bookId',
      templateUrl: 'subject-new.html',
      controller: 'SubjectNewCtrl as snc'
    })
    .state('subject.edit', {
      url: '/edit/:subjectId',
      templateUrl: 'subject-new.html',
      controller: 'SubjectNewCtrl as snc'
    })
    .state('book', {
      url: '/book',
      abstract: true,
      template: '<ui-view></ui-view>'
    })
    .state('book.detail', {
      url: '/detail/:bookId',
      templateUrl: 'book-detail.html',
      controller: 'BookDetailCtrl as bdc'
    })
}

routing.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
]

export default routing
