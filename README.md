# ScroeSaber Rank Panel

A Twitch Extension, providing a Panel to show your current ranking on ScoreSaber.com.


### Disclaimer
*This software is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ScoreSaber.com or any of its subsidiaries or its affiliates.*
*This software is provided "as is" and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the author or additional contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption).*


### Features
- shows current global and national Rank
- shows change of glabel Rank for the current day and the current week (last 7 days)
- shows current Performance Points Count
- adapts dynamically to the dark and light theme of Twitch
- coloring fully customizable
- display langauge of the Panel can be set to English or German
- when the streamer is currently playing Beat Saber, it auto-refreshes every minute


### Function Outline
- uses the [Twitch Configuration Service](https://dev.twitch.tv/docs/extensions/building/#configuration-service)
    to save customization values
- extracts data from [ScoreSaber](https://scoresaber.com)
- uses a caching proxy in-front of ScoreSaber to reduce load to their site
- source files are structured using [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- build-orchestration is handled by [Eleventy](https://www.11ty.dev/)
- background error reporting via [Sentry](https://docs.sentry.io/platforms/javascript/)
- additonal resources are taken from [Line-Awesome](https://icons8.com/line-awesome) and
    [svg-country-flags](https://github.com/hjnilsson/country-flags)


### Local Development Setup
1. download and install the [Twitch Developer Rig](https://dev.twitch.tv/docs/extensions/rig/) and
    [yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable)
1. clone this repository
1. install all dependencies via `yarn`
1. set the project up in the Rig and use it to serve the files locally
    - front-end files: `<clone-dir>\dist`
    - front-end command: *leave blank*
1. while developing have `yarn run watch` running to get live-updates to the app files
1. to get ready to uplaod files to Twitch, run `yarn run package`
