"use strict";
angular.module("info.vietnamcode.nampnq.videogular.plugins.youtube", [])
    .run(['$rootScope', '$window',
        function($rootScope, $window) {
            // Load YouTube API only if required
            if (typeof YT == 'undefined') {
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
            } else {
                $rootScope.youtubeApiReady = true;
            }
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
                            'start': 0,
                            'iv_load_policy': 1,
                            // Play video inline instead of fullscreen on iOS
                            'playsinline': 1,
                            'modestbranding': 1
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
                            return url && url.match(youtubeReg)[2] || null;
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
                                                'onStateChange': onVideoStateChange,
                                                'onError': onVideoError
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
                            // FLOWRA
                            API.mediaElement[0].__defineGetter__("currentState", function () {
                                return ytplayer.getPlayerState();
                            });
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
                            API.mediaElement[0].__defineGetter__("playbackRate", function () {
                                return ytplayer.getPlaybackRate();
                            });
                            API.mediaElement[0].__defineSetter__("playbackRate", function (rate) {
                                return ytplayer.setPlaybackRate(rate);
                            });
                            API.mediaElement[0].__defineGetter__("loadedFraction", function () {
                                return ytplayer.getVideoLoadedFraction();
                            });
                            // FLOWRA
                            API.mediaElement[0].__defineGetter__("videoId", function () {
                                return getYoutubeId(ytplayer.getVideoUrl());
                            });
                            // FLOWRA
                            API.mediaElement[0].__defineSetter__("videoId", function (params) {
                                // Will position the given video at the optionally
                                // given startSeconds, but don't play it (important).
                                // params e.g. { videoId: XYZ, startSeconds: 13.5 }
                                return ytplayer.cueVideoById(params);
                            });
                            API.mediaElement[0].play = function () {
                                ytplayer.playVideo();
                            };
                            API.mediaElement[0].pause = function () {
                                ytplayer.pauseVideo();
                            };
                            // FLOWRA
                            API.mediaElement[0].mute = function () {
                                ytplayer.mute();
                            };
                            // FLOWRA
                            API.mediaElement[0].unmute = function () {
                                ytplayer.unmute();
                            };
                            updateTime(); // Initial time update
                            angular.element(ytplayer.getIframe()).css({'width':'100%','height':'100%'});

                            // Trigger canplay event
                            var event = new CustomEvent("canplay");
                            API.mediaElement[0].dispatchEvent(event);
                        }

                        function updateTime() {
                            API.onUpdateTime({
                                target: API.mediaElement[0]
                            });
                        }

                        function startUpdateTimer(interval) {
                            if (updateTimer) {
                                stopUpdateTimer();
                            }
                            updateTimer = setInterval(updateTime, interval);
                        }

                        function stopUpdateTimer() {
                            if (updateTimer) {
                                clearInterval(updateTimer);
                            }
                        }

                        function onVideoStateChange(event) {
                            var player = event.target;

                            switch (event.data) {
                                case YT.PlayerState.ENDED:
                                    stopUpdateTimer();
                                    API.onComplete();
                                break;

                                case YT.PlayerState.PLAYING:
                                    // Trigger onStartPlaying event
                                    var event = new CustomEvent("playing");
                                    API.mediaElement[0].dispatchEvent(event);
                                    API.setState(VG_STATES.PLAY);
                                    startUpdateTimer(600);
                                break;

                                case YT.PlayerState.PAUSED:
                                    // NB Videogular calls pause() on the YouTube player to actually stop a video.
                                    // Avoid jumping from the desired "stop" status to "pause" status:
                                    if (API.currentState == VG_STATES.PLAY) {
                                        API.setState(VG_STATES.PAUSE);
                                    }
                                    stopUpdateTimer();
                                break;

                                case YT.PlayerState.BUFFERING:
                                    // Trigger onStartBuffering event
                                    var event = new CustomEvent("waiting");
                                    API.mediaElement[0].dispatchEvent(event);
                                break;

                                case YT.PlayerState.CUED:
                                    var event = new CustomEvent("positioned");
                                    API.mediaElement[0].dispatchEvent(event);
                                break;
                            }
                        }

                        function onVideoError(event) {
                            API.onVideoError(event);
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
                            stopUpdateTimer();
                        });
                    }
                };
            }
        ]);
