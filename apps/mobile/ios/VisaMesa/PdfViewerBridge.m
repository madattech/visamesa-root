#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PdfViewer, NSObject)

RCT_EXTERN_METHOD(openPdf:(NSString *)pathOrUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(savePdfBase64:(NSString *)base64
                  fileName:(NSString *)fileName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
