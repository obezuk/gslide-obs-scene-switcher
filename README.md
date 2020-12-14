# Google Slides to OBS Scene Switcher
A Chrome extension that automatically changes OBS scenes during Google Slide presentations. Put "OBS:Your Scene Name" o nit's own line in your speaker notes and ensure the OBS Web Sockets Server is running. When connected the extension will change your scene as while you are in Editing mode and Presenter view.

This plugin is inspired by Scott Hanselman's excellent [PowerPoint + .NET core implementation](https://github.com/shanselman/PowerPointToOBSSceneSwitcher). I decided to build this as a Chrome extension to add cross-platform support and make it easier for everyone to up their presentation game.

## Dependencies
To use this plugin you will need to install [OBS Studio](https://obsproject.com/) and the [Web Socket Server plugin](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/).

## Usage

This plugin needs to be connected to your OBS Web Socket server. By default this is `localhost:4444`.

Set a scene for a slide with:

```
"OBS:Your Scene Name"
```