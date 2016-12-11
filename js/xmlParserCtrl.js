var app = angular.module('myApp', ['xml', 'angularUtils.directives.dirPagination'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('xmlHttpInterceptor');
    });
app.controller('xmlParserCtrl', function($scope, $http) {

    $scope.xmlData = [];
    $scope.tab = 1;
    var likePost = JSON.parse(localStorage.getItem('likePost')) || [];
    $scope.setTab = function(newTab, file) {
        $scope.tab = newTab;
        $scope.xmlData = [];
        getData('dumplist/' + file + '.xml');
    };

    $scope.isSet = function(tabNum) {
        return $scope.tab === tabNum;
    };

    var getData = function(url) {
        $http.get(url).success(function(data) {
            $scope.xmlData = data[Object.keys(data)[0]].row;
            if (Object.keys(data)[0] === 'posts') {
                for (var i = 0; i < $scope.xmlData.length; i++) {
                    $scope.xmlData[i]['_like'] = 0;
                }
                if (likePost.length > 0) {
                    for (var i = 0; i < likePost.length; i++) {
                        $scope.xmlData[likePost[i].id]._like = likePost[i].like;
                    }
                }

            }
        });
    };

    getData('dumplist/Badges.xml');

    $scope.like = function(id) {
        $scope.xmlData[id - 1]._like += 1;
        likePost.push({
            like: $scope.xmlData[id - 1]._like,
            id: id - 1
        });
        localStorage.setItem("likePost", JSON.stringify(likePost));
    }
    $scope.unLike = function(id) {
        $scope.xmlData[id - 1]._like -= 1;
        likePost.push({
            like: $scope.xmlData[id - 1]._like,
            id: id - 1
        });
        localStorage.setItem("likePost", JSON.stringify(likePost));
    }
});

app.filter('htmlToPlainText', function($sce) {
    return function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});
