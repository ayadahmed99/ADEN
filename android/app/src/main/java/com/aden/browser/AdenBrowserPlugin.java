package com.aden.browser;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.browser.customtabs.CustomTabsIntent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.HashMap;
import java.util.Map;

@CapacitorPlugin(name = "AdenNativeBrowser")
public class AdenBrowserPlugin extends Plugin {

    private final Map<String, WebView> webViewTabs = new HashMap<>();
    private String activeTabId = "default";
    private FrameLayout webViewContainer;
    private ValueCallback<Uri[]> filePathCallback;
    private static final String DESKTOP_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    private String defaultUserAgent = null;

    @Override
    public void load() {
        super.load();
        getActivity().runOnUiThread(() -> {
            webViewContainer = new FrameLayout(getContext());
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            );
            getActivity().addContentView(webViewContainer, params);
            webViewContainer.setVisibility(View.GONE);
        });
    }

    private WebView getOrCreateWebView(String tabId, boolean isIncognito) {
        if (webViewTabs.containsKey(tabId)) {
            return webViewTabs.get(tabId);
        }

        Context context = getContext();
        WebView webView = new WebView(context);

        WebSettings settings = webView.getSettings();
        if (defaultUserAgent == null) {
            defaultUserAgent = settings.getUserAgentString();
        }

        // 1. Enable JavaScript & Storage
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        // 2. Cookies
        CookieManager cookieManager = CookieManager.getInstance();
        if (isIncognito) {
            settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
            settings.setAppCacheEnabled(false);
            cookieManager.setAcceptCookie(false);
        } else {
            cookieManager.setAcceptCookie(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cookieManager.setAcceptThirdPartyCookies(webView, true);
            }
        }

        // 3. Setup WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    getContext().startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return true;
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                JSObject ret = new JSObject();
                ret.put("tabId", tabId);
                ret.put("url", url);
                ret.put("canGoBack", view.canGoBack());
                ret.put("canGoForward", view.canGoForward());
                notifyListeners("onPageStarted", ret);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                JSObject ret = new JSObject();
                ret.put("tabId", tabId);
                ret.put("url", url);
                ret.put("title", view.getTitle());
                ret.put("canGoBack", view.canGoBack());
                ret.put("canGoForward", view.canGoForward());
                notifyListeners("onPageFinished", ret);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed(); // Allow SSL in embedded browser preview
            }
        });

        // 4. Setup WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                JSObject ret = new JSObject();
                ret.put("tabId", tabId);
                ret.put("progress", newProgress);
                notifyListeners("onProgressChanged", ret);
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                JSObject ret = new JSObject();
                ret.put("tabId", tabId);
                ret.put("title", title);
                notifyListeners("onTitleReceived", ret);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                getActivity().runOnUiThread(() -> request.grant(request.getResources()));
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                result.confirm();
                return true;
            }
        });

        // 5. Setup Native DownloadManager
        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setMimeType(mimetype);
                String cookies = CookieManager.getInstance().getCookie(url);
                request.addRequestHeader("cookie", cookies);
                request.addRequestHeader("User-Agent", userAgent);
                request.setDescription("جاري تنزيل الملف عبر ADEN Browser...");
                String filename = URLUtil.guessFileName(url, contentDisposition, mimetype);
                request.setTitle(filename);
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);

                DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm != null) {
                    dm.enqueue(request);
                    Toast.makeText(getContext(), "بدأ تنزيل: " + filename, Toast.LENGTH_SHORT).show();
                    
                    JSObject ret = new JSObject();
                    ret.put("filename", filename);
                    ret.put("url", url);
                    ret.put("mimeType", mimetype);
                    ret.put("totalBytes", contentLength);
                    notifyListeners("onDownloadEnqueued", ret);
                }
            } catch (Exception e) {
                Toast.makeText(getContext(), "فشل التنزيل: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        webViewTabs.put(tabId, webView);
        return webView;
    }

    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url", "https://www.google.com");
        String tabId = call.getString("tabId", activeTabId);
        boolean isIncognito = Boolean.TRUE.equals(call.getBoolean("isIncognito", false));
        boolean isDesktop = Boolean.TRUE.equals(call.getBoolean("isDesktop", false));

        getActivity().runOnUiThread(() -> {
            WebView webView = getOrCreateWebView(tabId, isIncognito);
            if (isDesktop) {
                webView.getSettings().setUserAgentString(DESKTOP_USER_AGENT);
            } else if (defaultUserAgent != null) {
                webView.getSettings().setUserAgentString(defaultUserAgent);
            }

            webView.loadUrl(url);
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("url", url);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void openCustomTab(PluginCall call) {
        String url = call.getString("url", "https://www.google.com");
        getActivity().runOnUiThread(() -> {
            try {
                CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
                CustomTabsIntent customTabsIntent = builder.build();
                customTabsIntent.launchUrl(getContext(), Uri.parse(url));
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } catch (Exception e) {
                call.reject(e.getMessage());
            }
        });
    }

    @PluginMethod
    public void goBack(PluginCall call) {
        String tabId = call.getString("tabId", activeTabId);
        getActivity().runOnUiThread(() -> {
            WebView webView = webViewTabs.get(tabId);
            if (webView != null && webView.canGoBack()) {
                webView.goBack();
                call.resolve();
            } else {
                call.reject("Cannot go back");
            }
        });
    }

    @PluginMethod
    public void goForward(PluginCall call) {
        String tabId = call.getString("tabId", activeTabId);
        getActivity().runOnUiThread(() -> {
            WebView webView = webViewTabs.get(tabId);
            if (webView != null && webView.canGoForward()) {
                webView.goForward();
                call.resolve();
            } else {
                call.reject("Cannot go forward");
            }
        });
    }

    @PluginMethod
    public void reload(PluginCall call) {
        String tabId = call.getString("tabId", activeTabId);
        getActivity().runOnUiThread(() -> {
            WebView webView = webViewTabs.get(tabId);
            if (webView != null) {
                webView.reload();
                call.resolve();
            } else {
                call.reject("Tab not found");
            }
        });
    }

    @PluginMethod
    public void setDesktopMode(PluginCall call) {
        String tabId = call.getString("tabId", activeTabId);
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", false));
        getActivity().runOnUiThread(() -> {
            WebView webView = webViewTabs.get(tabId);
            if (webView != null) {
                webView.getSettings().setUserAgentString(enabled ? DESKTOP_USER_AGENT : defaultUserAgent);
                webView.reload();
                call.resolve();
            } else {
                call.reject("Tab not found");
            }
        });
    }

    @PluginMethod
    public void clearBrowsingData(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            CookieManager.getInstance().removeAllCookies(null);
            CookieManager.getInstance().flush();
            for (WebView wv : webViewTabs.values()) {
                wv.clearCache(true);
                wv.clearHistory();
                wv.clearFormData();
            }
            call.resolve();
        });
    }
}
