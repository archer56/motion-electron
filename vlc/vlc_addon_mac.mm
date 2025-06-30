#include <napi.h>
#import <Cocoa/Cocoa.h>
#include <vlc/vlc.h>
#include <thread> // For std::this_thread::sleep_for
#include <chrono> // For std::chrono::milliseconds

libvlc_instance_t* g_vlcInstance = nullptr;
libvlc_media_player_t* g_vlcPlayer = nullptr;
NSWindow* g_vlcWindow = nil;
NSView* g_vlcView = nil;


Napi::Value Open(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  @autoreleasepool {
    // Create window if it doesn't exist
    if (!g_vlcWindow) {
      NSRect screenRect = [[NSScreen mainScreen] frame];
      g_vlcWindow = [[NSWindow alloc] initWithContentRect:screenRect
                                                 styleMask:NSWindowStyleMaskBorderless
                                                   backing:NSBackingStoreBuffered
                                                     defer:NO];
      [g_vlcWindow setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorFullScreenAuxiliary];
      [g_vlcWindow center];
      [g_vlcWindow setOpaque:YES];
      [g_vlcWindow setBackgroundColor:[NSColor blackColor]];
      [g_vlcWindow setLevel:NSNormalWindowLevel];
      [g_vlcWindow setIgnoresMouseEvents:YES];
      [g_vlcWindow makeKeyAndOrderFront:nil];

      g_vlcView = [[NSView alloc] initWithFrame:screenRect];
      [g_vlcWindow setContentView:g_vlcView];
    }

    dispatch_async(dispatch_get_main_queue(), ^{
      [g_vlcWindow makeKeyAndOrderFront:nil];
    });

    const char* vlc_args[] = {
      "--no-xlib",
      "--quiet"
    };

    setenv("VLC_PLUGIN_PATH", "/Applications/VLC.app/Contents/MacOS/plugins", 1);

    g_vlcInstance = libvlc_new(sizeof(vlc_args) / sizeof(vlc_args[0]), vlc_args);
    if (!g_vlcInstance) {
      Napi::TypeError::New(env, "Failed to create VLC instance").ThrowAsJavaScriptException();
      return env.Null();
    }

    g_vlcPlayer = libvlc_media_player_new(g_vlcInstance);

    // Set media from URL
    libvlc_media_t* media = libvlc_media_new_location(g_vlcInstance,
      "http://192.168.1.56:3000/playback/movies/329");
    libvlc_media_player_set_media(g_vlcPlayer, media);
    libvlc_media_release(media);

    // Attach the player to the NSView
    libvlc_media_player_set_nsobject(g_vlcPlayer, (__bridge void*)g_vlcView);

    // Start playback
    libvlc_media_player_play(g_vlcPlayer);
  }

  return Napi::String::New(env, "VLC player started");
}

Napi::Value Close(const Napi::CallbackInfo& info) {
  printf("Closing VLC\n");

  Napi::Env env = info.Env();

 
  @autoreleasepool {
    if (g_vlcPlayer) {
      libvlc_media_player_set_nsobject(g_vlcPlayer, nullptr); // Detach view
      libvlc_media_player_stop(g_vlcPlayer);                  // Stop playback
    }

    if (g_vlcWindow) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [g_vlcWindow orderOut:nil];  // Hide only
      });
    }

    // Delay VLC cleanup
    libvlc_media_player_t* player = g_vlcPlayer;
    libvlc_instance_t* inst = g_vlcInstance;
    g_vlcPlayer = nullptr;
    g_vlcInstance = nullptr;

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      if (player) libvlc_media_player_release(player);
      if (inst) libvlc_release(inst);
    });
  }

  return Napi::String::New(env, "VLC playback and window shut down");
}

Napi::Value Play(const Napi::CallbackInfo& info) {
  if (g_vlcPlayer) {
    libvlc_media_player_play(g_vlcPlayer);
  }
  return info.Env().Undefined();
}

Napi::Value Pause(const Napi::CallbackInfo& info) {
  if (g_vlcPlayer) {
    libvlc_media_player_set_pause(g_vlcPlayer, 1);
  }
  return info.Env().Undefined();
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  exports.Set("open", Napi::Function::New(env, Open));
  exports.Set("close", Napi::Function::New(env, Close));
  exports.Set("play", Napi::Function::New(env, Play));
  exports.Set("pause", Napi::Function::New(env, Pause));
  return exports;
}

NODE_API_MODULE(vlc_addon, InitAll)