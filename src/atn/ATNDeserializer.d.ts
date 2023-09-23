/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNDeserializationOptions } from "./ATNDeserializationOptions.js";
import { ATN } from "./ATN.js";

export declare class ATNDeserializer {
    public constructor(options?: ATNDeserializationOptions);
    public deserialize(data: number[]): ATN;
}
