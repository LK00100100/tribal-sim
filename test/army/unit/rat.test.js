import Rat from "../../../src/army/unit/Rat.js";

let rat = new Rat();

test("rat cost is 0", () => {
    expect(rat.getCost()).toBe(0);
});
