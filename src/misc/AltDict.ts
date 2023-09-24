/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class AltDict {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        this.data = {};
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(key: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.data["k-" + key] || null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    set(key: any, value: any) {
        this.data["k-" + key] = value;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    values() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, arrow-parens, arrow-body-style
        return Object.keys(this.data).filter(key => key.startsWith("k-")).map(key => this.data[key], this);
    }
}
