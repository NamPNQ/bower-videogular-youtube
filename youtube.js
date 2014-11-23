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
            console.log("Init youtube api");
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    ])
    .directive(
        "vgYoutube", ["$rootScope", "$window", "$timeout", "$interval",
            function($rootScope, $window, $timeout, $interval) {
                return {
                    restrict: "A",
                    require: "^videogular",
                    link: function(scope, elem, attr, API) {
                        var ytplayer, updateTimer;

                        var youtubeReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

                        function getYoutubeId(url){
                            return url.match(youtubeReg)[2];
                        }

                        function initYoutubePlayer(url) {
                            if (ytplayer) {
                                this.ytplayer.loadVideoById({
                                    videoId: getYoutubeId(url)
                                  });
                            } else {
                                $rootScope.$watch('youtubeApiReady', function(value) {
                                    if (value) {
                                        console.log("Api loaded..");
                                        ytplayer = new YT.Player(API.mediaElement[0], {
                                            videoId: getYoutubeId(url),
                                            playerVars: {
                                                controls: 0,
                                                showinfo: 0
                                            },
                                            events: {
                                                'onReady': onVideoReady
                                            }
                                        });
                                    }
                                })
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
                            }
                            API.mediaElement[0].pause = function () {
                                ytplayer.pauseVideo();
                            };
                            function updateTime(){
                                API.onUpdateTime({
                                        target: API.mediaElement[0]
                                    })
                            }
                            updateTimer = setInterval(updateTime, 600);
                            angular.element(ytplayer.getIframe()).css({'width':'100%','height':'100%'});
                        }

                        function isYoutube(url) {
                            return url.match(youtubeReg);
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
                                onSourceChange(newVal[0].src);
                            }
                        );
                        scope.$on('$destroy', function() {
                            clearInterval(updateTimer);
                        });

                    }
                }
            }
        ]);