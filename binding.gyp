{
  "targets": [
    {
      "target_name": "vlc_addon",
      "sources": [],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include_dir\")"
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "conditions": [

        # Windows-specific configuration
        [ "OS=='win'", {
          "sources": [ "vlc/vlc_addon_win.cc" ],
          "include_dirs": [
            "libvlc/include"
          ],
          "link_settings": {
            "library_dirs": [
              "libvlc"
            ],
            "libraries": [
              "libvlc.lib",
              "libvlccore.lib"
            ]
          },
          "copies": [
            {
              "files": [
                "libvlc/libvlc.dll",
                "libvlc/libvlccore.dll"
              ],
              "destination": "<(PRODUCT_DIR)"
            }
          ],
          "cflags": [ "/EHsc" ],
          "cflags_cc": [ "/EHsc" ]
        }],

        # macOS-specific configuration
        [ "OS=='mac'", {
          "sources": [ "vlc/vlc_addon_mac.mm" ],
          "include_dirs": [
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
        }]
      ]
    }
  ]
}
