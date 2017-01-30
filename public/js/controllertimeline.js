
var app = angular.module('timeline', []);
app.controller('timeline_controller', function($scope,$http) {

$http.get('/profile_data2').
    success(function(data, status, headers, config) {
        $scope.profile = data;

        $scope.profile.image = "/uploads/profile_images/userPhoto-" + data.email + ".png";


        $.ajax({
            url: "/uploads/profile_images/userPhoto-" + data.email + ".png",
            type: "HEAD",
            error: function() {

                if (data.gender == "male") {
                    $scope.profile.image = "/uploads/profile_images/male.png";
                } else {
                    $scope.profile.image = "/uploads/profile_images/female.png";
                }

                $scope.$apply();

            }
        });


    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/followers').
    success(function(data, status, headers, config) {
        $scope.followers = data;

    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/projects').
    success(function(data, status, headers, config) {
        $scope.projects = data;

        if(data.length > 0){
        	$scope.projects = [{ "title": "No projects", "details": ""}];
        }

    }).
    error(function(data, status, headers, config) {

    });


    $http.get('/following').
    success(function(data, status, headers, config) {
        $scope.followings = data;
        
    }).
    error(function(data, status, headers, config) {

    });


 });
