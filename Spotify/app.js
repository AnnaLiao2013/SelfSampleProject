        var infoApp = angular.module('infoApp', []);
        infoApp.controller('myController', ['$scope', 'userDataService', function (scope, userDataService) {

            scope.searchArtist = function () {
                userDataService.searchArtists(scope.artistName).then(function (artists) {
                    scope.artistsList = artists.data.results.artistmatches.artist;
                });
            };
            scope.nameChange = function () {
                scope.show = false;
                scope.albumsList = '';
                if (scope.artistName == '') {
                    scope.artistSuggestion = '';
                } else {
                    userDataService.searchArtists(scope.artistName).then(function (artists) {
                        scope.artistSuggestion = artists.data.results.artistmatches.artist;
                    });
                };
            };
            scope.getAlbums = function (name) {
                scope.show = false;
                scope.tempArtist = name;
                userDataService.searchAlbums(name).then(function (albums) {
                    scope.albumsList = albums.data.topalbums.album;
                });
            };
            scope.getAlbumInfo = function (album) {
                userDataService.getAlbumInfo(scope.tempArtist, album).then(function (albumDetail) {
                    scope.albumCover = albumDetail.data.album.image[3]["#text"];
                    scope.title = albumDetail.data.album.name;
                    scope.artist = albumDetail.data.album.artist;
                    scope.date = albumDetail.data.album.wiki.published;
                    scope.tracks = albumDetail.data.album.tracks.track;
                    scope.show = true;
                });
            };
        }]);

        infoApp.factory('userDataService', ['userHttpService', '$q', function (userHttpService, $q) {
            var service = {};

            service.searchArtists = function (name) {
                var defer = $q.defer();
                userHttpService.getArtists(name).then(function (response) {
                    defer.resolve(response);
                });
                return defer.promise;
            };
            service.searchAlbums = function (name) {
                var defer = $q.defer();
                userHttpService.getAlbums(name).then(function (response) {
                    defer.resolve(response);
                });
                return defer.promise;
            };
            service.getAlbumInfo = function (artist, album) {
                var defer = $q.defer();
                userHttpService.getAlbumInfo(artist, album).then(function (response) {
                    defer.resolve(response);
                })
                return defer.promise;
            }
            return service;

        }]);
        infoApp.factory('userHttpService', ['$http', function ($http) {
            var service = {};
            service.getArtists = function (name) {
                return $http.get('https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + name + '&api_key=7692762c11e5a62b774300f54072a485&format=json');
            };
            service.getAlbums = function (name) {
                return $http.get('https://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + name + '&api_key=7692762c11e5a62b774300f54072a485&format=json')
            }
            service.getAlbumInfo = function (artist, album) {
                return $http.get('https://ws.audioscrobbler.com/2.0/?method=album.getInfo&artist=' + artist + '&album=' + album + '&api_key=7692762c11e5a62b774300f54072a485&format=json')
            }
            return service;
        }]);