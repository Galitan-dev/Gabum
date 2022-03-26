export default function search(query: string, data: string[]) {
    const matches: [string, number][] = data.map((str) => {
        let amount = 0;

        for (const word of query.split(/[\s.]/g)) {
            let i = 0;
            for (const char of word) {
                let found = false;
                while (i < str.length) {
                    if (char.toLowerCase() === str[i].toLocaleLowerCase()) {
                        amount++;
                        found = true;
                        break;
                    }
                    amount -= 0.01;
                    i++;
                }
                if (!found) return [str, 0];
            }
        }

        return [str, amount];
    });

    return matches
        .filter(([, a]) => a >= query.length - 1 || a >= 3)
        .sort(([, a], [, b]) => b - a)
        .map(([s]) => s);
}
