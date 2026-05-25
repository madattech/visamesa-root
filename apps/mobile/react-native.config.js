/**
 * @react-native-vector-icons/material-icons ships an Android library that
 * registers New Architecture codegen without producing jni output, which breaks
 * CMake autolinking. We only need the TTF on Android — fonts are copied in
 * android/app/build.gradle. iOS still uses the CocoaPods resource bundle.
 */
module.exports = {
  dependencies: {
    '@react-native-vector-icons/material-icons': {
      platforms: {
        android: null,
      },
    },
  },
};
