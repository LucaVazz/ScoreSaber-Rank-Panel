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
    to save customization value
- uses a minimal reverse proxy to access the ScroeSaber.com user page and extracts relevant data from it
- source files are structured using [Jinja2 Templating](http://jinja.pocoo.org/docs/2.10/templates/)


### Local Development Setup
1. make sure you have Python 3.5 or later installed
1. download and install the [Twitch Developer Rig]()
1. clone this repository
1. install `jinja2` via pip
1. set the project up in the Rig and use it to serve the files locally
    - front-end files: `<clone-dir>\dist`
    - front-end command: *leave blank*
1. whenever you change relevant sources, built the project again:
    `python build.py`

