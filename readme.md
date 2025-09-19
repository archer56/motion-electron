# Motion Election

This is an election app which interfaces with motion server for the content and video streams.

Then embeds VLC into an electron app to display video so the server does not need to transpile.

## Mac Prerequisites
Install VLC
```sh
 brew update
 brew install vlc
```

## Windows Prerequisites
Install VLC

- Download package [VideoLAN.LibVLC.Windows](https://www.nuget.org/packages/VideoLAN.LibVLC.Windows) using the direct download (64 bit version worked for me - on SP11 running x64 node)
- Rename to `.zip`
- extract the files
- move them into this repo under the folder `libvlc`. Pretty much just copied over the required files in the same order.
- create this folder structure:
```sh
├── libvlc/
│   ├── include/
│   │   │── vlc/
│   │   │   │── plugins/
│   │   │   │   └── *.h
│   │   │   └── *.h
│   │── plugins/  
│   │   ├── libvlc.dll
│   │   ├── libvlccore.dll
│   │   └── libvlc.lib  
```

## Running the App
If this is the first time running you will need to create the binaries for VLC.

This is done by running: 
```sh 
yarn build:vlc:windows
// or
yarn build:vlc:mac
```
If vlc has not been installed in an expected location, you made need to update binding.gyp with the correct location.

This only needs to be done once (unless you are making edits to the c++ files).

To run the app itself in dev mode:
```sh
yarn dev:server
```
and
```sh
yarn dev:ui
```