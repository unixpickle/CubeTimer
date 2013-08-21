//
//  ANAPIRenameRequest.h
//  Qube
//
//  Created by Alex Nichol on 8/17/13.
//  Copyright (c) 2013 Alex Nichol. All rights reserved.
//

#import "ANAPICall.h"
#import "ANDataManager.h"
#import "ANPuzzle+Coding.h"

@interface ANAPIRenameRequest : ANAPICall

- (id)initWithPuzzleSettingChanges:(NSArray *)changes;
- (id)initWithPuzzleIds:(NSArray *)ids names:(NSArray *)names;

@end
