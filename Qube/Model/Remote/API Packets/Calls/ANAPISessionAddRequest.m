//
//  ANAPISessionAddRequest.m
//  Qube
//
//  Created by Alex Nichol on 8/20/13.
//  Copyright (c) 2013 Alex Nichol. All rights reserved.
//

#import "ANAPISessionAddRequest.h"

@implementation ANAPISessionAddRequest

- (id)initWithAddRequests:(NSArray *)addReqs {
    NSMutableArray * sessionObjs = [NSMutableArray array];
    for (OCSessionAddition * addition in addReqs) {
        NSDictionary * dict = [addition.session encodeSession];
        [sessionObjs addObject:dict];
    }
    self = [super initWithAPI:@"session.add" params:@{@"sessions": sessionObjs}];
    return self;
}

@end
