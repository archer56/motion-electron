{
  "targets": [
    {
      "target_name": "vlc_addon",
      "sources": [ "vlc/vlc_addon_mac.mm" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include_dir\")",
        "/Applications/VLC.app/Contents/MacOS/include"
      ],
      "libraries": [
        "-L/Applications/VLC.app/Contents/MacOS/lib",
        "-lvlc"
      ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "MACOSX_DEPLOYMENT_TARGET": "15.0",
        "LD_RUNPATH_SEARCH_PATHS": [
          "@loader_path",
          "/Applications/VLC.app/Contents/MacOS/lib"
        ]
      }
    }
  ]
}
