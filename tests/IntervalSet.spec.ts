/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import * as antlr4 from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const IntervalSet = antlr4.IntervalSet;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Interval = antlr4.Interval;

describe("IntervalSet", () => {
    it("computes interval set length", () => {
        const s1 = new IntervalSet();
        s1.addOne(20);
        s1.addOne(154);
        s1.addRange(169, 171);
        expect(s1.length).toEqual(5);
    });

    it("merges simple interval sets", () => {
        const s1 = new IntervalSet();
        s1.addOne(10);
        expect(s1.toString()).toEqual("10");
        const s2 = new IntervalSet();
        s2.addOne(12);
        expect(s2.toString()).toEqual("12");
        const merged = new IntervalSet();
        merged.addSet(s1);
        expect(merged.toString()).toEqual("10");
        merged.addSet(s2);
        expect(merged.toString()).toEqual("{10, 12}");
        let s3 = new IntervalSet();
        s3.addOne(10);
        merged.addSet(s3);
        expect(merged.toString()).toEqual("{10, 12}");
        s3 = new IntervalSet();
        s3.addOne(11);
        merged.addSet(s3);
        expect(merged.toString()).toEqual("{10..12}");
        s3 = new IntervalSet();
        s3.addOne(12);
        merged.addSet(s3);
        expect(merged.toString()).toEqual("{10..12}");

    });

    it("merges complex interval sets", () => {
        const s1 = new IntervalSet();
        s1.addOne(20);
        s1.addOne(141);
        s1.addOne(144);
        s1.addOne(154);
        s1.addRange(169, 171);
        s1.addOne(173);
        expect(s1.toString()).toEqual("{20, 141, 144, 154, 169..171, 173}");
        const s2 = new IntervalSet();
        s2.addRange(9, 14);
        s2.addOne(53);
        s2.addRange(55, 63);
        s2.addRange(65, 72);
        s2.addRange(74, 117);
        s2.addRange(119, 152);
        s2.addRange(154, 164);
        expect(s2.toString()).toEqual("{9..14, 53, 55..63, 65..72, 74..117, 119..152, 154..164}");
        s1.addSet(s2);
        expect(s1.toString()).toEqual("{9..14, 20, 53, 55..63, 65..72, 74..117, 119..152, 154..164, 169..171, 173}");
    });

    it("Math Operations", () => {
        const fullUnicodeSet = IntervalSet.of(0, 0x10FFFF);
        expect(fullUnicodeSet.length).toEqual(0x10FFFF + 1);

        // Remove some of the non-printable Unicode characters.
        const intervalsToExclude = new IntervalSet();
        intervalsToExclude.addInterval(new Interval(0, 10));
        intervalsToExclude.addInterval(new Interval(14, 31));
        intervalsToExclude.addInterval(new Interval(127, 133));
        intervalsToExclude.addInterval(new Interval(134, 159));
        intervalsToExclude.addInterval(new Interval(173, 173));
        intervalsToExclude.addInterval(new Interval(888, 889));
        intervalsToExclude.addInterval(new Interval(896, 899));
        intervalsToExclude.addInterval(new Interval(907, 907));
        intervalsToExclude.addInterval(new Interval(909, 909));
        intervalsToExclude.addInterval(new Interval(930, 930));
        intervalsToExclude.addInterval(new Interval(1328, 1328));
        intervalsToExclude.addInterval(new Interval(1367, 1368));
        intervalsToExclude.addInterval(new Interval(1419, 1420));
        intervalsToExclude.addInterval(new Interval(1424, 1424));
        intervalsToExclude.addInterval(new Interval(1470, 1470));
        intervalsToExclude.addInterval(new Interval(1472, 1472));
        intervalsToExclude.addInterval(new Interval(1475, 1475));
        intervalsToExclude.addInterval(new Interval(1478, 1478));
        intervalsToExclude.addInterval(new Interval(1480, 1541));
        intervalsToExclude.addInterval(new Interval(1564, 1565));
        intervalsToExclude.addInterval(new Interval(1757, 1757));
        intervalsToExclude.addInterval(new Interval(1806, 1807));

        const final = intervalsToExclude.complement(fullUnicodeSet);
        expect(final.toString()).toEqual("{11..13, 32..126, 160..172, 174..887, 890..895, 900..906, 908, 910..929, " +
            "931..1327, 1329..1366, 1369..1418, 1421..1423, 1425..1469, 1471, 1473..1474, 1476..1477, 1479, " +
            "1542..1563, 1566..1756, 1758..1805, 1808..1114111}");

        const s1 = new IntervalSet();
        s1.addRange(1, 10);
        s1.addRange(20, 30);
        const s2 = new IntervalSet();
        s2.addRange(5, 25);
        expect(s1.or([s2]).toString()).toEqual("{1..30}");
        expect(s1.and(s2).toString()).toEqual("{5..10, 20..25}");
        expect(s1.subtract(s2).toString()).toEqual("{1..4, 26..30}");
        expect(s2.subtract(s1).toString()).toEqual("{11..19}");

        const s3 = new IntervalSet();
        s3.addRange(30, 57);
        const multi = final.and(s3);
        expect(multi.toString()).toEqual("{32..57}");
    });
});
