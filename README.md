Bower-videogular-youtube
========================

Videogular `youtube` plugin repository for distribution on `bower`

## Install

Install [Videogular](http://www.videogular.com/) `youtube` plugin with Bower:

`bower install videogular-youtube`

Inside the folder `bower_components\videogular-youtube` you should find also `html` partials that you should locate in `.\views\videogular\plugins\youtube\`.

## How to use
Add directives, and video source to your HTML:

```html
<videogular vg-player-ready="onPlayerReady" vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
                    <vg-media vg-src="config.sources" vg-youtube="rel=1;showinfo=1"></vg-media>

                    <vg-controls vg-autohide="config.autoHide" vg-autohide-time="config.autoHideTime">
                        <vg-play-pause-button></vg-play-pause-button>
                        <vg-timedisplay>{{ currentTime | date:'mm:ss' }}</vg-timedisplay>
                        <vg-scrubBar>
                            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
                        </vg-scrubBar>
                        <vg-timedisplay>{{ timeLeft | date:'mm:ss' }}</vg-timedisplay>
                        <vg-volume>
                            <vg-mutebutton></vg-mutebutton>
                            <vg-volumebar></vg-volumebar>
                        </vg-volume>
                        <vg-fullscreenButton></vg-fullscreenButton>
                    </vg-controls>

                    <vg-poster-image vg-url='config.plugins.poster.url'></vg-poster-image>
                    <vg-buffering></vg-buffering>
                    <vg-overlay-play vg-play-icon="config.theme.playIcon"></vg-overlay-play>

                    <vg-poster-image vg-url='config.plugins.poster.url'></vg-poster-image>
                    <vg-buffering></vg-buffering>
                    <vg-overlay-play vg-play-icon="config.theme.playIcon"></vg-overlay-play>
</videogular>
```

Additionally, you will need to add youtube plugins and videogular to your application:

```js
"use strict";
angular.module("videogularApp",
    [
        "controllers",

        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.buffering",
        "info.vietnamcode.nampnq.videogular.plugins.youtube"
    ]
);
```

And that's all :)

### Demo

Here you can see a demo on Codepen:

http://codepen.io/2fdevs/pen/qOBRpO

### A note on mobile fullscreen support

The YouTube iframe API does not provide a programmatic way to make a video fullscreen. If the Videogular full screen button is enabled for YouTube videos, it will not work.

While good results may be obtained by making the `iframe` or `videogular` element fullscreen on Android, this currently is not supported on iOS which can only make `video` elements fullscreen. The only way to support fullscreen YouTube videos on iPad is to show the YouTube controls and allow the user to tap the fullscreen button. If YouTube controls are enabled, ensure that any videogular elements that would cover the iframe, such as `vg-controls`, `vg-overlay-play`, and `vg-poster` are disabled so that the user can interact with the controls inside the YouTube iframe.

### Donate

If project help you, you can donate me

* Paypal: chienthan1612@gmail.com
* Bitcoin: 1LKyH1jTP8Agd8FakpvydCP87HQzL85cFx

### Install Videogular

Install [Videogular](http://www.videogular.com/) with Bower:

`bower install videogular`

### Install themes

Install [Videogular](http://www.videogular.com/) themes with Bower:

`bower install videogular-themes-default`

### Install plugins

Install [Videogular](http://www.videogular.com/) plugins with Bower:

`bower install videogular-buffering`

`bower install videogular-controls`

`bower install videogular-poster`

## Documentation

It's available on [Videogular's project Wiki](https://github.com/2fdevs/videogular/wiki).

## License

The MIT License (MIT)

Copyright (c) 2014 NamPNQ

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
