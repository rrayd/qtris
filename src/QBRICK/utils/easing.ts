// http://gizma.com/easing/

/**
 * easeInOutQuad
 * @param t time frame
 * @param b start value
 * @param c target value
 * @param d duration
 */
export const easeInOutQuad = (
    t: number,
    b: number,
    c: number,
    d: number
): number => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
}
