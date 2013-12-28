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
<videogular vg-width="config.width" vg-height="config.height" vg-theme="config.theme.url" vg-autoplay="config.autoPlay" vg-stretch="config.stretch.value" vg-responsive="config.responsive">
	<video class='videoPlayer' preload='metadata'>
		<source type="video/youtube" src="http://www.youtube.com/watch?v=nOEw9iiopwI" />
	</video>

	<vg-youtube></vg-youtube>

	<vg-controls vg-autohide="config.autoHide" style="height: 50px;">
		<vg-play-pause-button vg-play-icon="config.theme.playIcon" vg-pause-icon="config.theme.pauseIcon"></vg-play-pause-button>
		<vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>
		<vg-scrubBar>
			<vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
		</vg-scrubBar>
		<vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>
		<vg-volume>
			<vg-mutebutton
				vg-volume-level-3-icon="config.theme.volumeLevel3Icon"
				vg-volume-level-2-icon="config.theme.volumeLevel2Icon"
				vg-volume-level-1-icon="config.theme.volumeLevel1Icon"
				vg-volume-level-0-icon="config.theme.volumeLevel0Icon"
				vg-mute-icon="config.theme.muteIcon">
			</vg-mutebutton>
			<vg-volumebar></vg-volumebar>
		</vg-volume>
		<vg-fullscreenButton vg-enter-full-screen-icon="config.theme.enterFullScreenIcon" vg-exit-full-screen-icon="config.theme.exitFullScreenIcon"></vg-fullscreenButton>
	</vg-controls>
</videogular>
```

Additionally, you will need to add youtube plugins and videogular to your application:

```js
"use strict";
angular.module("videogularApp",
    [
        "controllers",

        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controlbar",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.buffering",
        "info.vietnamcode.nampnq.videogular.plugins.youtube"
    ]
);
```

And that's all :)

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

Copyright (c) 2013 2fdevs

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