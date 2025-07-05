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

Napi::Value UpdateWindowPosition(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if(g_vlcWindow) {
    SetWindowPos(
        g_vlcWindow,
        HWND_BOTTOM,  // <-- Always stay behind Electron
        0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
        SWP_NOACTIVATE | SWP_SHOWWINDOW
    );
  }

  return Napi::String::New(env, "Initializing VLC asynchronously...");
}

Napi::Value Open(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  printf("Opening VLC\n");
  
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

    // g_vlcWindow = CreateWindowEx(
    //   0, CLASS_NAME, "VLC", WS_POPUP,
    //   0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
    //   nullptr, nullptr, GetModuleHandle(nullptr), nullptr
    // );
    g_vlcWindow = CreateWindowEx(
        WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE, // Hides from Alt+Tab and taskbar
        CLASS_NAME, "VLC",
        WS_POPUP, // No border or decorations
        0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN),
        nullptr, nullptr, GetModuleHandle(nullptr), nullptr
    );

    ShowWindow(g_vlcWindow, SW_SHOW);
  }

  libvlc_media_t* media = libvlc_media_new_location(g_vlcInstance, "http://192.168.1.56:3000/playback/movies/329");
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

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("initialise", Napi::Function::New(env, Initialise));
    exports.Set("uninitialise", Napi::Function::New(env, Uninitialise));
    exports.Set("updateWindowPosition", Napi::Function::New(env, UpdateWindowPosition));
    exports.Set("open", Napi::Function::New(env, Open));
    exports.Set("close", Napi::Function::New(env, Close));
    return exports;
}

NODE_API_MODULE(vlc_addon, Init)