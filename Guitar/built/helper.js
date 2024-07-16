var isMobile = false;
// var isTouchscreen : boolean = false;
window.addEventListener("load", () => {
    // (A) BREAK USER AGENT DOWN
    var m = navigator.userAgent.toLowerCase().match(/mobile/i);
    console.log(m === null || m === void 0 ? void 0 : m.toString());
    if (m == null) {
    }
    else if (m.toString() == "mobile") {
        isMobile = true;
    }
    // m_isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    // var isTablet = navigator.userAgent.toLowerCase().match(/tablet/i),
    //   isAndroid = navigator.userAgent.toLowerCase().match(/android/i),
    //   isiPhone = navigator.userAgent.toLowerCase().match(/iphone/i),
    //   isiPad = navigator.userAgent.toLowerCase().match(/ipad/i);
    // (B) DETECTED DEVICE TYPE
    console.log("Mobile", isMobile);
    // console.log("Tablet", isTablet);
    // console.log("Android", isAndroid);
    // console.log("iPhone", isiPhone);
    // console.log("iPad", isiPad);
});
export { isMobile };
export function arraysEqual(a, b) {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every((el, ix) => el === b[ix]);
}
export function arraysContainSame(a, b) {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every(el => b.includes(el));
}
//# sourceMappingURL=helper.js.map