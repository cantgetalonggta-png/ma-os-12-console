package com.maos12.console

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature

/**
 * MA-OS-12 Epstein Public-Record Investigation Desk — Android companion.
 *
 * Hardened WebView shell for the live Vercel console.
 * Deep link: maos12://open?url=<https-url>
 *
 * Policy:
 *  - HTTPS only (cleartext disabled in manifest)
 *  - No secret / API key storage in the shell
 *  - Public-record ceiling; association ≠ guilt
 *  - Operator ledger is LEAD track (not auto-SOLID)
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar

    private val defaultConsoleUrl: String
        get() = prefs.getString(KEY_URL, FALLBACK_CONSOLE_URL) ?: FALLBACK_CONSOLE_URL

    private val prefs by lazy {
        getSharedPreferences(PREFS, MODE_PRIVATE)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
        supportActionBar?.title = getString(R.string.app_name)
        supportActionBar?.subtitle = "LIVE · GOD"

        webView = findViewById(R.id.webview)
        progress = findViewById(R.id.progress)

        configureWebView(webView)
        val startUrl = resolveStartUrl(intent)
        webView.loadUrl(startUrl)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val url = resolveStartUrl(intent)
        if (url.isNotBlank()) webView.loadUrl(url)
    }

    private fun resolveStartUrl(intent: Intent?): String {
        val data = intent?.data
        if (data != null && data.scheme == "maos12" && data.host == "open") {
            val q = data.getQueryParameter("url")
            if (!q.isNullOrBlank() && isAllowedHttps(q)) return q
        }
        val extra = intent?.getStringExtra(EXTRA_URL)
        if (!extra.isNullOrBlank() && isAllowedHttps(extra)) return extra
        return defaultConsoleUrl
    }

    private fun isAllowedHttps(url: String): Boolean {
        if (!url.startsWith("https://")) return false
        val host = Uri.parse(url).host ?: return false
        return true
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView(wv: WebView) {
        val s = wv.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.databaseEnabled = false
        s.cacheMode = WebSettings.LOAD_DEFAULT
        s.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        s.allowFileAccess = false
        s.allowContentAccess = false
        s.mediaPlaybackRequiresUserGesture = true
        s.builtInZoomControls = true
        s.displayZoomControls = false
        s.userAgentString = s.userAgentString + " MAOS12Console/2.0 GOD-LIVE"
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(s, WebSettingsCompat.FORCE_DARK_ON)
        }
        wv.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val u = request.url
                return when (u.scheme) {
                    "https" -> false
                    "http" -> {
                        Toast.makeText(
                            this@MainActivity,
                            R.string.https_only,
                            Toast.LENGTH_SHORT
                        ).show()
                        true
                    }
                    "mailto", "tel" -> {
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, u))
                        } catch (_: Exception) {
                            Toast.makeText(
                                this@MainActivity,
                                R.string.no_handler,
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        true
                    }
                    else -> true
                }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progress.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progress.visibility = View.GONE
            }
        }
        wv.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progress.progress = newProgress
                progress.visibility = if (newProgress in 1..99) View.VISIBLE else View.GONE
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_reload -> {
                webView.reload()
                true
            }
            R.id.action_home -> {
                webView.loadUrl(defaultConsoleUrl)
                true
            }
            R.id.action_live_console -> {
                webView.loadUrl(PRODUCTION_VERCEL_URL)
                true
            }
            R.id.action_status -> {
                showLiveStatus()
                true
            }
            R.id.action_set_url -> {
                promptUrl()
                true
            }
            R.id.action_open_browser -> {
                val u = webView.url
                if (!u.isNullOrBlank()) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(u)))
                }
                true
            }
            R.id.action_about -> {
                AlertDialog.Builder(this)
                    .setTitle(R.string.about_title)
                    .setMessage(R.string.about_body)
                    .setPositiveButton(android.R.string.ok, null)
                    .show()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun showLiveStatus() {
        val msg = """
            Console: $defaultConsoleUrl
            Production: $PRODUCTION_VERCEL_URL
            Mode: LIVE HTTP · GOD profile
            Tracks: Residue · Operator ledger · Contradictions · Missing productions · Meridian
            Policy: public-record only · association ≠ guilt · no secrets in shell
            Deep link: maos12://open?url=https://…
        """.trimIndent()
        AlertDialog.Builder(this)
            .setTitle(R.string.status_title)
            .setMessage(msg)
            .setPositiveButton(android.R.string.ok, null)
            .show()
    }

    private fun promptUrl() {
        val input = android.widget.EditText(this).apply {
            setText(defaultConsoleUrl)
            hint = "https://"
            setSingleLine()
            setPadding(48, 32, 48, 32)
        }
        AlertDialog.Builder(this)
            .setTitle(R.string.set_url_title)
            .setView(input)
            .setPositiveButton(R.string.save) { _, _ ->
                val v = input.text.toString().trim()
                if (v.startsWith("https://")) {
                    prefs.edit().putString(KEY_URL, v).apply()
                    webView.loadUrl(v)
                } else {
                    Toast.makeText(this, R.string.https_only, Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val PREFS = "maos12"
        private const val KEY_URL = "console_url"
        const val EXTRA_URL = "extra_url"

        /** Live Vercel production console (MA-OS-12 desk). */
        const val PRODUCTION_VERCEL_URL =
            "https://ma-os-12-console-echo-ec69.vercel.app"

        /** Built-in fallback: production Vercel (was GitHub Pages). */
        const val FALLBACK_CONSOLE_URL = PRODUCTION_VERCEL_URL
    }
}
