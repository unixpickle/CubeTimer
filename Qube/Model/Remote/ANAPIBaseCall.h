//
//  ANAPIBaseCall.h
//  Qube
//
//  Created by Alex Nichol on 8/22/13.
//  Copyright (c) 2013 Alex Nichol. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ANAPIBaseCall : NSObject {
    NSString * api;
    NSDictionary * parameters;
}

- (id)initWithAPI:(NSString *)theApi params:(NSDictionary *)params;
- (void)fetchResponse:(void (^)(NSError * error, NSDictionary * obj))callback;
- (void)cancel;

@end
