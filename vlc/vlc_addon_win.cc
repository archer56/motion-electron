#include <thread>
#include <windows.h>
#include <napi.h>
#include <vlc/vlc.h>

HWND g_vlcWindow = nullptr;
libvlc_instance_t* g_vlcInstance = nullptr;
libvlc_media_player_t* g_vlcPlayer = nullptr;

std::atomic<bool> g_vlcInitialising = false;
std::atomic<bool> g_vlcInitialised = false;

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
  switch (uMsg) {
    case WM_DESTROY:
      PostQuitMessage(0);
      return 0;
  }
  return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

void InitVLCAsync(HWND hwnd) {
  printf("Initialising VLC\n");
  g_vlcInitialising = true;

  const char* vlc_args[] = { "--quiet" };

  g_vlcInstance = libvlc_new(sizeof(vlc_args) / sizeof(vlc_args[0]), vlc_args);
  if (!g_vlcInstance) return;

  g_vlcPlayer = libvlc_media_player_new(g_vlcInstance);
  
  g_vlcInitialising = false;
  g_vlcInitialised = true;
  printf("Initialising VLC Complete\n");
}

Napi::Value Initialise(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if(g_vlcInitialised){
    return Napi::String::New(env, "VLC is initialised");
  }

  if(g_vlcInitialising){
    return Napi::String::New(env, "VLC is initialising");
  }

  // Offload VLC initialization to a background thread
//   std::string url = "http://192.168.1.56:3000/playback/movies/329";
  std::thread(InitVLCAsync, g_vlcWindow).detach();

  return Napi::String::New(env, "Initializing VLC asynchronously...");
}

Napi::Value Uninitialise(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    printf("Uninitialising VLC\n");
    
    if(g_vlcInitialising){
        printf("Uninitialising VLC - VLC is currently initialising\n");
        return Napi::String::New(env, "VLC is initialising");
    }

    if (g_vlcPlayer) {
        printf("Uninitialising VLC - VLC Player\n");
        libvlc_media_player_stop(g_vlcPlayer);
        libvlc_media_player_release(g_vlcPlayer);
        g_vlcPlayer = nullptr;
    }
    
    if (g_vlcInstance) {
        printf("Uninitialising VLC - VLC Instance\n");
        libvlc_release(g_vlcInstance);
        g_vlcInstance = nullptr;
    }
    
    if (g_vlcWindow) {
        printf("Uninitialising VLC - VLC Window\n");
        DestroyWindow(g_vlcWindow);
        g_vlcWindow = nullptr;
    }
    
    printf("Uninitialising VLC Complete\n");
    
    g_vlcInitialised = false;

    return Napi::String::New(env, "VLC playback and window shut down");
}

// Napi::Value UpdateWindowPosition(const Napi::CallbackInfo& info) {
//   Napi::Env env = info.Env();
  
//   if(g_vlcWindow) {
//     // SetWindowPos(
//     //     g_vlcWindow,
//     //     HWND_BOTTOM,  // <-- Always stay behind Electron
//     //     0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
//     //     SWP_NOACTIVATE | SWP_SHOWWINDOW
//     // );
//     SetWindowPos(
//         g_vlcWindow,
//         HWND_NOTOPMOST,  // not HWND_BOTTOM
//         0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
//         SWP_NOACTIVATE | SWP_SHOWWINDOW
//     );
//   }

//   return Napi::String::New(env, "Initializing VLC asynchronously...");
// }

Napi::Value UpdateWindowPosition(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (!g_vlcWindow) {
        // Napi::Error::New(env, "VLC window not created").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Expected one argument (Electron HWND)").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Electron passes HWND as Number or BigInt depending on arch
    // Try BigInt first (64-bit), then fallback to Number (32-bit)
    HWND electronHwnd = nullptr;

    if (info[0].IsBigInt()) {
        bool lossless = false;
        uint64_t val = info[0].As<Napi::BigInt>().Uint64Value(&lossless);
        electronHwnd = reinterpret_cast<HWND>(val);
    } else if (info[0].IsNumber()) {
        uintptr_t val = static_cast<uintptr_t>(info[0].As<Napi::Number>().Int64Value());
        electronHwnd = reinterpret_cast<HWND>(val);
    } else {
        Napi::TypeError::New(env, "Argument must be a BigInt or Number representing HWND").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Set VLC window to be just below Electron window in z-order,
    // without activating or changing size/position here.
    // Adjust position and size to cover full screen or match Electron if desired.

    // Example: place VLC window right behind Electron window in z-order
    BOOL res = SetWindowPos(
        g_vlcWindow,
        electronHwnd,    // place just below Electron window
        0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
        SWP_NOACTIVATE | SWP_SHOWWINDOW | SWP_NOMOVE | SWP_NOSIZE
    );

    if (!res) {
        DWORD err = GetLastError();
        char msg[256];
        sprintf_s(msg, "SetWindowPos failed with error %lu", err);
        Napi::Error::New(env, msg).ThrowAsJavaScriptException();
        return env.Null();
    }

    return Napi::String::New(env, "VLC window position updated");
}

Napi::Value Open(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  printf("Opening VLC\n");
  
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "Expected a URL string as argument").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::string url = info[0].As<Napi::String>();
  
  if (!g_vlcInstance || !g_vlcPlayer) {
    printf("Opening VLC - VLC not initialised\n");
    Napi::Error::New(env, "VLC not initialised (this is often slow)").ThrowAsJavaScriptException();
    return env.Null();
  }
    
    if (!g_vlcWindow) {
    printf("Opening VLC - creating window\n");
    // create Win32 window (same as before)
    const char CLASS_NAME[] = "VLCWindowClass";
    WNDCLASS wc = {};
    wc.lpfnWndProc = DefWindowProc;
    wc.hInstance = GetModuleHandle(nullptr);
    wc.lpszClassName = CLASS_NAME;
    RegisterClass(&wc);

    g_vlcWindow = CreateWindowEx(
        WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE, // Hides from Alt+Tab and taskbar
        CLASS_NAME, "VLC",
        WS_POPUP, // No border or decorations
        0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
        nullptr, nullptr, GetModuleHandle(nullptr), nullptr
    );

    ShowWindow(g_vlcWindow, SW_SHOW);
  }

  libvlc_media_t* media = libvlc_media_new_location(g_vlcInstance, url.c_str());
  libvlc_media_player_set_media(g_vlcPlayer, media);
  libvlc_media_release(media);

  libvlc_media_player_set_hwnd(g_vlcPlayer, g_vlcWindow);
  libvlc_media_player_play(g_vlcPlayer);

  printf("Opening VLC Complete\n");

  return Napi::String::New(env, "Initializing VLC asynchronously...");
}

Napi::Value Close(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    printf("Closing VLC\n");
    
    if (g_vlcPlayer) {
        printf("Closing VLC - VLC Player\n");
        libvlc_media_player_stop(g_vlcPlayer);
    }
        
    if (g_vlcWindow) {
        printf("Closing VLC - VLC Window\n");
        DestroyWindow(g_vlcWindow);
        g_vlcWindow = nullptr;
    }

    printf("Closing VLC Complete\n");

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

Napi::Value SeekTo(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Time in milliseconds expected").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (g_vlcPlayer) {
    int64_t timeMs = info[0].As<Napi::Number>().Int64Value();
    libvlc_media_player_set_time(g_vlcPlayer, static_cast<libvlc_time_t>(timeMs));
  }

  return env.Undefined();
}

Napi::Value GetTimeState(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (!g_vlcPlayer) {
    return env.Null();
  }

  libvlc_time_t current = libvlc_media_player_get_time(g_vlcPlayer);
  libvlc_time_t total = libvlc_media_player_get_length(g_vlcPlayer);
  float position = libvlc_media_player_get_position(g_vlcPlayer);

  libvlc_time_t remaining = (total > 0 && current >= 0) ? (total - current) : -1;

  Napi::Object status = Napi::Object::New(env);
  status.Set("current", Napi::Number::New(env, current));
  status.Set("total", Napi::Number::New(env, total));
  status.Set("remaining", Napi::Number::New(env, remaining));
  status.Set("position", Napi::Number::New(env, position));

  return status;
}

Napi::Value GetPlaybackState(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (!g_vlcPlayer) {
    return Napi::String::New(env, "none");
  }

  libvlc_media_t* media = libvlc_media_player_get_media(g_vlcPlayer);
  if (!media) {
    return Napi::String::New(env, "none");
  }

  libvlc_state_t state = libvlc_media_get_state(media);

  const char* stateStr = "unknown";

  switch (state) {
    case libvlc_NothingSpecial: stateStr = "idle"; break;
    case libvlc_Opening:        stateStr = "opening"; break;
    case libvlc_Buffering:      stateStr = "buffering"; break;
    case libvlc_Playing:        stateStr = "playing"; break;
    case libvlc_Paused:         stateStr = "paused"; break;
    case libvlc_Stopped:        stateStr = "stopped"; break;
    case libvlc_Ended:          stateStr = "ended"; break;
    case libvlc_Error:          stateStr = "error"; break;
  }

  return Napi::String::New(env, stateStr);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("initialise", Napi::Function::New(env, Initialise));
    exports.Set("uninitialise", Napi::Function::New(env, Uninitialise));
    exports.Set("updateWindowPosition", Napi::Function::New(env, UpdateWindowPosition));
    exports.Set("open", Napi::Function::New(env, Open));
    exports.Set("close", Napi::Function::New(env, Close));
    exports.Set("play", Napi::Function::New(env, Play));
    exports.Set("pause", Napi::Function::New(env, Pause));
    exports.Set("seekTo", Napi::Function::New(env, SeekTo));
    exports.Set("getTimeState", Napi::Function::New(env, GetTimeState));
    exports.Set("getPlaybackState", Napi::Function::New(env, GetPlaybackState));
    return exports;
}

NODE_API_MODULE(vlc_addon, Init)