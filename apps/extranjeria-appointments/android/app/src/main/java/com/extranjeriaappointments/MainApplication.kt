package com.extranjeriaappointments

import android.app.Application
import java.io.IOException
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<com.facebook.react.ReactPackage> =
            PackageList(this).packages

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getJSMainModuleName(): String = "index"

        override val isHermesEnabled: Boolean = true
      }

  override fun onCreate() {
    super.onCreate()
    try {
      SoLoader.init(this, OpenSourceMergedSoMapping)
    } catch (exception: IOException) {
      throw RuntimeException("Failed to initialize SoLoader", exception)
    }
  }
}
