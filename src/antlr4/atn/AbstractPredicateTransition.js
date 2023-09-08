/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "../transition/Transition.js";

export class AbstractPredicateTransition extends Transition {
    constructor(target) {
        super(target);
    }
}
