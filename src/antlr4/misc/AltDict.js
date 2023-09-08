/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class AltDict {
    constructor() {
        this.data = {};
    }

    get(key) {
        return this.data["k-" + key] || null;
    }

    set(key, value) {
        this.data["k-" + key] = value;
    }

    values() {
        return Object.keys(this.data).filter(key => key.startsWith("k-")).map(key => this.data[key], this);
    }
}
