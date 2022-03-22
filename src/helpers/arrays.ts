export function mapArray<In, Out>(inp: In[], ...cases: [In[], Out][]): Out | undefined {
    for (const caze of cases) {
        let match = true;
        for (const i in caze[0]) {
            if (caze[0][i] !== inp[i]) match = false;
            else continue;
            break;
        }
        if (match) return caze[1];
    }
    return undefined;
}
