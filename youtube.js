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
        "vgYoutube", ["VG_EVENTS", "VG_STATES", "$rootScope", "$window", "$timeout", "$interval",
            function(VG_EVENTS, VG_STATES, $rootScope, $window, $timeout, $interval) {
                return {
                    restrict: "E",
                    require: "^videogular",
                    template: "<div id=\"youtube_player_{{vgYoutubePlayerId}}\" style=\"position: absolute;\" />",
                    scope: {},
                    link: function(scope, elem, attr, API) {
                        var ytplayer, videoId, updateTimer, result = {
                                method: "",
                                url: ""
                            };

                        scope.vgYoutubePlayerId = Date.now();

                        function onYoutubeStateChange(event) {
                            if (event.data == YT.PlayerState.ENDED) {
                                scope.$parent.$broadcast(VG_EVENTS.ON_COMPLETE);
                            } else if (event.data == YT.PlayerState.PLAYING) {
                                scope.$parent.$broadcast(VG_EVENTS.ON_START_PLAYING, [ytplayer.getDuration()]);
                            } 
                        }

                        function onVideoReady() {
                            var videoSize = API.getSize();
                            ytplayer.setSize(videoSize.width, videoSize.height);
                            API.videoElement[0].pause();
                            API.videoElement[0].src = false;
                            scope.$parent.$broadcast(VG_EVENTS.ON_PLAYER_READY);

                            function updateTime() {
                                scope.$parent.$broadcast(VG_EVENTS.ON_UPDATE_TIME, [ytplayer.getCurrentTime(), ytplayer.getDuration()]);
                                var updateTimeCallbackFuncName = angular.element(API.videogularElement).attr('vg-update-time');
                                if(updateTimeCallbackFuncName)
                                    API.videoElement.scope()[updateTimeCallbackFuncName](ytplayer.getCurrentTime(), ytplayer.getDuration());
                            }
                            updateTimer = setInterval(updateTime, 600);

                        }

                        function loadYoutube() {
                            if(!ytplayer){
                                ytplayer = new YT.Player('youtube_player_' + scope.vgYoutubePlayerId, {
                                    videoId: videoId,
                                    playerVars: {
                                        controls: 0,
                                        showinfo: 0
                                    },
                                    events: {
                                        'onReady': onVideoReady,
                                        'onStateChange': onYoutubeStateChange
                                    }
                                });
                            }else{
                                ytplayer.loadVideoById(videoId,0,'large');
                            }
                            
                        }

                        function parseSrc(src) {
                            if (src) {
                                // Regex to parse the video ID
                                var regId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                var match = src.match(regId);

                                if (match && match[2].length == 11) {
                                    videoId = match[2];
                                } else {
                                    videoId = null;
                                }
                                $rootScope.$watch('youtubeApiReady', function(value) {
                                    if (value) {
                                        console.log("Api loaded..");
                                        if (result.method === 'youtube')
                                            $timeout(function() {
                                                loadYoutube();
                                            });
                                    }
                                });
                            }
                        };

                        function checkYoutubeSource() {
                            var htmlMediaElement = API.videoElement[0];
                            var vgScope = API.videoElement.scope();
                            var sources = eval('vgScope.' + angular.element(API.videoElement).attr('vg-src'));
                            var mediaFiles = [],
                                i,
                                n,
                                type,
                                media,
                                src;
                            for (i = 0; i < sources.length; i++) {
                                mediaFiles.push({
                                    type: sources[i].type,
                                    url: sources[i].src.toString()
                                });
                            }
                            for (i = 0; i < mediaFiles.length; i++) {
                                // normal check
                                if (htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== ''
                                    // special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
                                    || htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/, 'mpeg')).replace(/no/, '') !== '') {
                                    result.method = 'native';
                                    result.url = mediaFiles[i].url;
                                    break;
                                }
                            }

                            if (result.method !== 'native') {
                                for (i = 0; i < mediaFiles.length; i++) {
                                    type = mediaFiles[i].type;
                                    if (type == "video/youtube") {
                                        result.method = "youtube";
                                        result.url = mediaFiles[i].url;
                                    }
                                }

                            }
                            if (result.method === 'native') {
                                if (result.url !== null) {
                                    console.log("Please check youtube video in source");
                                }
                            } else if (result.method === 'youtube') {
                                parseSrc(result.url);
                            }
                        };

                        function onVgError(e, msg) {
                            if (msg.type == "Can't play file")
                                checkYoutubeSource();
                        };

                        function onEvent(target, params) {
                            switch (target.name) {
                                case VG_EVENTS.ON_PLAY:
                                    if(ytplayer)
                                        ytplayer.playVideo();
                                    break;
                                case VG_EVENTS.ON_PAUSE:
                                    if(ytplayer)
                                        ytplayer.pauseVideo();
                                    break;
                                case VG_EVENTS.ON_SEEK_TIME:
                                    if(ytplayer)
                                        ytplayer.seekTo(params[0] * ytplayer.getDuration(), true);
                                    break;
                                case VG_EVENTS.ON_SET_VOLUME:
                                    if(ytplayer)
                                        ytplayer.setVolume(params[0] * 100.0)
                                    break;
                                case VG_EVENTS.ON_UPDATE_SIZE:
                                    if(ytplayer)
                                        ytplayer.setSize(params[0],params[1]);
                                    break;                                    
                            }
                        }

                        API.$on(VG_EVENTS.ON_ERROR, onVgError);
                        API.$on(VG_EVENTS.ON_PLAY, onEvent);
                        API.$on(VG_EVENTS.ON_PAUSE, onEvent);
                        API.$on(VG_EVENTS.ON_SEEK_TIME, onEvent);
                        API.$on(VG_EVENTS.ON_SET_VOLUME, onEvent);
                        API.$on(VG_EVENTS.ON_UPDATE_SIZE, onEvent);

                        scope.$on('$destroy', function() {
                            clearInterval(updateTimer);
                        })

                    }
                }
            }
        ]);
