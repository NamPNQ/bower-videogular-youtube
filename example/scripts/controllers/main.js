'use strict';
angular.module('myApp').controller('MainCtrl',
	function ($scope, $sce) {
		$scope.currentTime = 0;
		$scope.totalTime = 0;
		$scope.state = null;
		$scope.volume = 1;
		$scope.isCompleted = false;
		$scope.API = null;

		$scope.onPlayerReady = function(API) {
			$scope.API = API;
		};

		$scope.onCompleteVideo = function() {
			$scope.isCompleted = true;
		};

		$scope.onUpdateState = function(state) {
			$scope.state = state;
		};

		$scope.onUpdateTime = function(currentTime, totalTime) {
			$scope.currentTime = currentTime;
			$scope.totalTime = totalTime;
		};

		$scope.onUpdateVolume = function(newVol) {
			$scope.volume = newVol;
		};

		$scope.onUpdateSize = function(width, height) {
			$scope.config.width = width;
			$scope.config.height = height;
		};

		$scope.stretchModes = [
			{label: "None", value: "none"},
			{label: "Fit", value: "fit"},
			{label: "Fill", value: "fill"}
		];

		$scope.config = {
			width: 740,
			height: 380,
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			responsive: false,
			stretch: $scope.stretchModes[1],
			sources: [
				{src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=DgzBz3ibnBA"), type: "video/youtube"},
				//{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
				//{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
			],
			transclude: true,
			theme: {
				url: "styles/themes/default/videogular.css"
			},
			plugins: {
				poster: {
					url: "assets/images/videogular.png"
				},
				memeAds: {
					vid:'P9EzRfvqOF'
				}
			}
		};

		$scope.changeSource = function() {
			$scope.config.sources = [
				{src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=XslueHBNJYU"), type: "video/youtube"},
				//{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
			];
		};
	}
);
