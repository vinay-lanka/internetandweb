var app = angular.module('dashboardApp', []);
app.controller('dashctrl', function($scope, $http) {
    $http.get("/userdetails")
    .then(function(response) {
        $scope.userdata = response.data;
    });
});
