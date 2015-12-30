"use strict";
angular.module("info.vietnamcode.nampnq.videogular.plugins.youtube", [])
    .run(['$rootScope', '$window',
        function($rootScope, $window) {
            $rootScope.youtubeApiReady = false;
            $window.onYouTubeIframeAPIReady = function() {
                $rootScope.$apply(function() {
                    $rootScope.youtubeApiReady = true;
                });
            };
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    ])
    .directive(
        "vgYoutube", ["$rootScope", "$window", "$timeout", "$interval", "VG_STATES",
            function($rootScope, $window, $timeout, $interval, VG_STATES) {
                return {
                    restrict: "A",
                    require: "^videogular",
                    link: function(scope, elem, attr, API) {
                        var ytplayer, updateTimer, optionsArr, playerVars;

                        var youtubeReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                        optionsArr = attr.vgYoutube !== null ? attr.vgYoutube.split(";") : null;
                        playerVars = {
                            'controls': 0,
                            'showinfo': 0,
                            'rel': 0,
                            'autoplay': 0, //Switch autoplay to 1 to autoplay videos
                            'start': 0
                        };

                        if (optionsArr !== null) {
                            optionsArr.forEach(function (item) {
                                var keyValuePair = item.split("=");
                                if (playerVars.hasOwnProperty(keyValuePair[0])) {
                                  playerVars[keyValuePair[0]] = keyValuePair[1] || 0;
                                }
                            });
                        }

                        function getYoutubeId(url) {
                            return url.match(youtubeReg)[2];
                        }

                        function initYoutubePlayer(url) {
                            if (ytplayer) {
                                ytplayer.cueVideoById({
                                    videoId: getYoutubeId(url)
                                  });
                            } else {
                                $rootScope.$watch('youtubeApiReady', function(value) {
                                    if (value) {
                                        ytplayer = new YT.Player(API.mediaElement[0], {
                                            videoId: getYoutubeId(url),
                                            playerVars: playerVars,
                                            events: {
                                                'onReady': onVideoReady,
                                                'onStateChange': onVideoStateChange
                                            }
                                        });
                                    }
                                });
                            }
                        }

                        function destroyYoutubePlayer() {
                            ytplayer.destroy();
                        }

                        function onVideoReady() {
                            //Define some property, method for player
                            API.mediaElement[0].__defineGetter__("currentTime", function () {
                                return ytplayer.getCurrentTime();
                            });
                            API.mediaElement[0].__defineSetter__("currentTime", function (seconds) {
                                return ytplayer.seekTo(seconds, true);
                            });
                            API.mediaElement[0].__defineGetter__("duration", function () {
                                return ytplayer.getDuration();
                            });
                            API.mediaElement[0].__defineGetter__("paused", function () {
                                return ytplayer.getPlayerState() != YT.PlayerState.PLAYING;
                            });
                            API.mediaElement[0].__defineGetter__("videoWidth", function () {
                                return ytplayer.a.width;
                            });
                            API.mediaElement[0].__defineGetter__("videoHeight", function () {
                                return ytplayer.a.height;
                            });
                            API.mediaElement[0].__defineGetter__("volume", function () {
                                return ytplayer.getVolume() / 100.0;
                            });
                            API.mediaElement[0].__defineSetter__("volume", function (volume) {
                                return ytplayer.setVolume(volume * 100.0);
                            });
                            API.mediaElement[0].play = function () {
                                ytplayer.playVideo();
                            };
                            API.mediaElement[0].pause = function () {
                                ytplayer.pauseVideo();
                            };
                            function updateTime() {
                                API.onUpdateTime({
                                    target: API.mediaElement[0]
                                });
                            }
                            updateTimer = setInterval(updateTime, 600);
                            angular.element(ytplayer.getIframe()).css({'width':'100%','height':'100%'});
                        }

                        function onVideoStateChange(event) {
                            var player = event.target;

                            switch (event.data) {
                                case YT.PlayerState.ENDED:
                                    API.onComplete();
                                break;

                                case YT.PlayerState.PLAYING:
                                    API.setState(VG_STATES.PLAY);
                                break;

                                case YT.PlayerState.PAUSED:
                                    API.setState(VG_STATES.PAUSE);
                                break;

                                case YT.PlayerState.BUFFERING:
                                    //No appropriate state
                                break;

                                case YT.PlayerState.CUED:
                                    //No appropriate state
                                break;
                            }
                        }

                        function isYoutube(url) {
                            if (url) {
                                return url.match(youtubeReg);
                            }
                            return false;
                        }

                        function onSourceChange(url) {
                            if (isYoutube(url)) {
                                initYoutubePlayer(url);
                            } else {
                                if (ytplayer) {
                                    destroyYoutubePlayer();
                                }
                            }
                        }
                        scope.$watch(
                            function() {
                                return API.sources;
                            },
                            function(newVal, oldVal) {
                                if (newVal && newVal.length > 0 && newVal[0].src) {
                                    onSourceChange(newVal[0].src.toString());
                                }
                                else {
                                    onSourceChange(null);
                                }
                            }
                        );
                        scope.$on('$destroy', function() {
                            clearInterval(updateTimer);
                        });
                    }
                };
            }
        ]);
