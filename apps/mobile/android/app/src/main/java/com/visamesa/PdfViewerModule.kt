package com.visamesa

import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Intent
import android.util.Base64
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import java.io.File

class PdfViewerModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "PdfViewer"

  @ReactMethod
  fun savePdfBase64(base64: String, fileName: String, promise: Promise) {
    try {
      val bytes = Base64.decode(base64, Base64.DEFAULT)
      val file = File(reactContext.filesDir, fileName)
      file.writeBytes(bytes)

      val result =
        WritableNativeMap().apply {
          putString("fileName", fileName)
          putString("path", file.absolutePath)
          putString("uri", "file://${file.absolutePath}")
        }
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("PDF_SAVE_FAILED", error.message, error)
    }
  }

  @ReactMethod
  fun openPdf(pathOrUri: String, promise: Promise) {
    try {
      val path = pathOrUri.removePrefix("file://")
      val file = File(path)

      if (!file.exists()) {
        promise.reject("PDF_NOT_FOUND", "PDF file does not exist: $path")
        return
      }

      val authority = "${reactContext.packageName}.fileprovider"
      val uri = FileProvider.getUriForFile(reactContext, authority, file)
      val viewIntent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, "application/pdf")
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        clipData = ClipData.newUri(reactContext.contentResolver, file.name, uri)
      }
      val chooser = Intent.createChooser(viewIntent, "Open PDF").apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      }

      reactContext.startActivity(chooser)
      promise.resolve(null)
    } catch (error: ActivityNotFoundException) {
      promise.reject("NO_PDF_VIEWER", "No app is available to open PDF files", error)
    } catch (error: Exception) {
      promise.reject("PDF_OPEN_FAILED", error.message, error)
    }
  }
}
