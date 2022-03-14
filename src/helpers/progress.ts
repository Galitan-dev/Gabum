export default class ProgressBar {
    current = 0;
    format: string;
    complete = false;
    start: number;
    lastBump: number;
    selector = 100;

    constructor(format: string) {
        this.format = format;
        this.start = Date.now();
        this.lastBump = Date.now();
    }

    tick(n: number) {
        this.update(this.current + n);
    }

    update(n: number) {
        this.complete = n >= 100;
        if (this.complete) this.current = 100;
        else this.current = n;
        this.lastBump = Date.now();
    }

    render(): string {
        return this.format
            .replace(/<bar>/g, this.makeBar())
            .replace(/<percent>/g, Math.round(this.current * 100) / 100 + '%')
            .replace(/<speed>/, Math.round(this.speed * 100) / 100 + '%/s')
            .replace(/<timeLeft>/g, Math.round(this.timeLeft * 100) / 100 + 's')
            .replace(/Infinity[^\s]/g, '--');
    }

    makeBar(): string {
        // Made by Chancago at https://github.com/Changaco/unicode-progress-bars

        const bar_style = '▁▂▃▄▅▆▇█';

        let d,
            full,
            m,
            middle,
            r,
            rest,
            x,
            min_delta = Number.POSITIVE_INFINITY,
            p = this.current;
        const full_symbol = bar_style[bar_style.length - 1],
            n = bar_style.length - 1;

        if (p === 100) return new Array(30).fill(full_symbol).join('');
        p = p / 100;
        for (let i = 30; i >= 30; i--) {
            x = p * i;
            full = Math.floor(x);
            rest = x - full;
            middle = Math.floor(rest * n);
            if (p !== 0 && full === 0 && middle === 0) middle = 1;
            d = Math.abs(p - (full + middle / n) / i) * 100;
            if (d < min_delta) {
                min_delta = d;
                m = bar_style[middle];
                if (full === i) m = '';
                r =
                    new Array(full).fill(full_symbol).join('') +
                    m +
                    new Array(i - full - 1).fill(bar_style[0]).join('');
            }
        }

        return r as string;
    }

    get timeLeft() {
        const timeLeft = (100 - this.current) / this.speed - (Date.now() - this.lastBump) / 1000;
        return isNaN(timeLeft) ? Infinity : timeLeft;
    }

    get speed(): number {
        return this.current / ((Date.now() - this.start) / 1000);
    }
}
