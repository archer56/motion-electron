// #include <napi.h>
// #include <windows.h>
// #include <vlc/vlc.h>

// // Globals
// libvlc_instance_t* g_vlcInstance = nullptr;
// libvlc_media_player_t* g_vlcPlayer = nullptr;
// HWND g_vlcWindow = nullptr;

// // Forward declaration
// LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

// HWND CreateVLCWindow(HINSTANCE hInstance) {
//     // Register window class
//     WNDCLASSW wc = {};
//     wc.lpfnWndProc = WindowProc;
//     wc.hInstance = hInstance;
//     wc.lpszClassName = L"VLCAddonWindowClass";
//     wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);

//     if (!RegisterClassW(&wc)) {
//         MessageBoxW(nullptr, L"Failed to register window class", L"Error", MB_OK | MB_ICONERROR);
//         return nullptr;
//     }

//     // Get work area
//     RECT rc;
//     if (!SystemParametersInfoW(SPI_GETWORKAREA, 0, &rc, 0)) {
//         MessageBoxW(nullptr, L"Failed to get work area", L"Error", MB_OK | MB_ICONERROR);
//         return nullptr;
//     }

//     HWND hwnd = CreateWindowExW(
//         WS_EX_LAYERED | WS_EX_TOOLWINDOW,
//         wc.lpszClassName,
//         L"VLC Window",
//         WS_POPUP,
//         rc.left, rc.top,
//         rc.right - rc.left,
//         rc.bottom - rc.top,
//         nullptr,
//         nullptr,
//         hInstance,
//         nullptr
//     );

//     if (!hwnd) {
//         MessageBoxW(nullptr, L"Failed to create window", L"Error", MB_OK | MB_ICONERROR);
//         return nullptr;
//     }

//     SetLayeredWindowAttributes(hwnd, 0, 255, LWA_ALPHA);
//     ShowWindow(hwnd, SW_SHOW);
//     UpdateWindow(hwnd);

//     return hwnd;
// }

// LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
//     switch (uMsg) {
//         case WM_DESTROY:
//             PostQuitMessage(0);
//             return 0;
//         default:
//             return DefWindowProcW(hwnd, uMsg, wParam, lParam);
//     }
// }

// // N-API methods

// Napi::Value Open(const Napi::CallbackInfo& info) {
//   printf("Initialising VLC");

//     Napi::Env env = info.Env();

//     if (g_vlcWindow) {
//         ShowWindow(g_vlcWindow, SW_SHOW);
//         SetForegroundWindow(g_vlcWindow);
//         return Napi::String::New(env, "VLC window already opened");
//     }

//     HINSTANCE hInstance = GetModuleHandle(nullptr);
//     g_vlcWindow = CreateVLCWindow(hInstance);
//     if (!g_vlcWindow) {
//         Napi::TypeError::New(env, "Failed to create VLC window").ThrowAsJavaScriptException();
//         return env.Null();
//     }
//     printf("*******************1");
    
//     // VLC args
//     const char* vlc_args[] = {
//       "--no-video-title-show",
//       "--quiet",
//       "--verbose=2"
//     };

//     SetEnvironmentVariableA("VLC_PLUGIN_PATH", "C:/Users/benar/Workspace/motion-electron/libvlc");
//     char buf[512];
//     GetEnvironmentVariableA("VLC_PLUGIN_PATH", buf, sizeof(buf));
//     printf("VLC_PLUGIN_PATH = %s\n", buf);
    
//     g_vlcInstance = libvlc_new(sizeof(vlc_args) / sizeof(vlc_args[0]), vlc_args);
//     if (!g_vlcInstance) {
//       Napi::TypeError::New(env, "Failed to create VLC instance").ThrowAsJavaScriptException();
//       return env.Null();
//     }
    
//     printf("*******************2");
//     g_vlcPlayer = libvlc_media_player_new(g_vlcInstance);
//     printf("*******************3");
//     libvlc_media_t* media = libvlc_media_new_location(g_vlcInstance,
//       "http://192.168.1.56:3000/playback/movies/329");
//     printf("*******************4");
//     libvlc_media_player_set_media(g_vlcPlayer, media);
//     printf("*******************5");
//     libvlc_media_release(media);
//     printf("*******************6");
    
//     // Set the video output window handle for VLC
//     libvlc_media_player_set_hwnd(g_vlcPlayer, g_vlcWindow);
//     printf("*******************6");
    
//     libvlc_media_player_play(g_vlcPlayer);
//     printf("*******************7");

//     return Napi::String::New(env, "VLC player started");
// }

// Napi::Value Close(const Napi::CallbackInfo& info) {
//     Napi::Env env = info.Env();

//     if (g_vlcPlayer) {
//         libvlc_media_player_stop(g_vlcPlayer);
//         libvlc_media_player_release(g_vlcPlayer);
//         g_vlcPlayer = nullptr;
//     }
//     if (g_vlcInstance) {
//         libvlc_release(g_vlcInstance);
//         g_vlcInstance = nullptr;
//     }
//     if (g_vlcWindow) {
//         DestroyWindow(g_vlcWindow);
//         g_vlcWindow = nullptr;
//     }

//     return Napi::String::New(env, "VLC playback and window shut down");
// }

// Napi::Value Play(const Napi::CallbackInfo& info) {
//     if (g_vlcPlayer) {
//         libvlc_media_player_play(g_vlcPlayer);
//     }
//     return info.Env().Undefined();
// }

// Napi::Value Pause(const Napi::CallbackInfo& info) {
//     if (g_vlcPlayer) {
//         libvlc_media_player_set_pause(g_vlcPlayer, 1);
//     }
//     return info.Env().Undefined();
// }

// Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
//     exports.Set("open", Napi::Function::New(env, Open));
//     exports.Set("close", Napi::Function::New(env, Close));
//     exports.Set("play", Napi::Function::New(env, Play));
//     exports.Set("pause", Napi::Function::New(env, Pause));
//     return exports;
// }

// NODE_API_MODULE(vlc_addon, InitAll)


    #include <napi.h>
    #include <vlc/vlc.h>
    #include <thread>
    #include <chrono>
    #include <windows.h>

    libvlc_instance_t* inst = nullptr;
    libvlc_media_player_t* player = nullptr;

    Napi::Value Play(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected URL string").ThrowAsJavaScriptException();
            return env.Null();
        }

        std::string url = info[0].As<Napi::String>().Utf8Value();

        if (!inst) {
            inst = libvlc_new(0, nullptr);
            if (!inst) {
                Napi::Error::New(env, "Failed to create VLC instance").ThrowAsJavaScriptException();
                return env.Null();
            }
        }

        libvlc_media_t* media = libvlc_media_new_location(inst, url.c_str());
        if (!media) {
            Napi::Error::New(env, "Failed to create media").ThrowAsJavaScriptException();
            return env.Null();
        }

        if (player) {
            libvlc_media_player_stop(player);
            libvlc_media_player_release(player);
            player = nullptr;
        }

        player = libvlc_media_player_new_from_media(media);
        libvlc_media_release(media);

        if (!player) {
            Napi::Error::New(env, "Failed to create media player").ThrowAsJavaScriptException();
            return env.Null();
        }

        if (libvlc_media_player_play(player) != 0) {
            libvlc_media_player_release(player);
            player = nullptr;
            Napi::Error::New(env, "Failed to play media").ThrowAsJavaScriptException();
            return env.Null();
        }

        return Napi::String::New(env, "Playing");
    }

    Napi::Value Stop(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (player) {
            libvlc_media_player_stop(player);
            libvlc_media_player_release(player);
            player = nullptr;
        }

        if (inst) {
            libvlc_release(inst);
            inst = nullptr;
        }

        return Napi::String::New(env, "Stopped");
    }

    Napi::Object Init(Napi::Env env, Napi::Object exports) {
        exports.Set("open", Napi::Function::New(env, Play));
        exports.Set("close", Napi::Function::New(env, Stop));
        return exports;
    }

    NODE_API_MODULE(vlc_addon, Init)
