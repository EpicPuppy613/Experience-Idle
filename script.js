const regex = /\d\.\d(?=e\d+)/;
const digit = /^\d(?=e\d+)/;

//COLUMN CONFIGURATION
var width = window.innerWidth;
document.getElementById('main').style.columnCount = 3;
if (width < 1800) {
    document.getElementById('main').style.columnCount = 2;
}
if (width < 1000) {
    document.getElementById('main').style.columnCount = 1;
}

window.addEventListener('resize', function (e) {
    width = window.innerWidth;
    document.getElementById('main').style.columnCount = 3;
    if (width < 1800) {
        document.getElementById('main').style.columnCount = 2;
    }
    if (width < 1000) {
        document.getElementById('main').style.columnCount = 1;
    }
});

String.prototype.format = function () {
    return this.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

String.prototype.formatZeros = function () {
    if (regex.test(this)) return this.replace(regex, this.match(regex)[0] + "0");
    if (digit.test(this)) return this.replace(digit, this.match(digit) + ".00");
    return this;
};

//SCALING CONFIGURATION
const S = {};
//LEVEL SCALING
S.level = 1.5;

const icons = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

/**
 * How many times you can afford something with a growth rate
 * @param {Number} principal - starting value
 * @param {Number} rate - growth rate
 * @param {Number} value - maximum value
 * @returns 
 */
function BruteForceIntegral(principal, rate, value) {
    current = 0;
    if (value.lt(principal)) return 0;
    cost = new Decimal(principal);
    left = new Decimal(value);
    while (true) {
        if (left.lt(cost)) return current;
        left = left.sub(cost);
        cost = cost.mul(rate);
        current += 1;
    }
}

function Main() {
    G.gain = new Decimal(0);
    G.mult = new Decimal(1);
    for (const c in C) {
        C[c].mult = new Decimal(1);
        C[c].gain = new Decimal(0);
    }
    for (const c in G.devgain) {
        if (c == 'p') {
            G.gain = G.gain.add(G.devgain.p);
        } else {
            C[c].gain = C[c].gain.add(G.devgain[c]);
        }
    }
    for (const b in G.buyables) {
        if (G.buyables[b].generate == 'p') {
            G.gain = G.gain.add(G.buyables[b].increase());
            G.mult = G.mult.mul(G.buyables[b].mult());
        } else {
            C[G.buyables[b].generate].gain = C[G.buyables[b].generate].gain.add(G.buyables[b].increase());
            C[G.buyables[b].generate].mult = C[G.buyables[b].generate].mult.mul(G.buyables[b].mult());
        }
    }
    for (const c in C) {
        C[c].Tick();
    }
    for (const m in G.milestones) {
        G.milestones[m].Tick();
        if (!G.milestones[m].achieved) continue;
        if (G.milestones[m].target == 'p') {
            G.gain = G.gain.add(G.milestones[m].gain());
            G.mult = G.mult.mul(G.milestones[m].mult());
        } else {
            C[G.milestones[m].target].gain = C[G.milestones[m].target].gain.add(G.milestones[m].gain());
            C[G.milestones[m].target].mult = C[G.milestones[m].target].mult.mul(G.milestones[m].mult());
        }
    }
    G.xp = G.xp.add(G.gain.mul(G.mult));
    G.points = G.points.add(G.gain.mul(G.mult).div(50));
    var iter = new Decimal(0);
    while (true) {
        if (G.xp.gte(G.need)) {
            G.level = G.level.add(1);
            G.xp = G.xp.sub(G.need);
            // Squared XP Requirement
            // G.need = G.level.add(2).pow(2) * 250;
            // Exponential XP Requirement
            G.need = G.need.mul(S.level);
            iter = iter.add(1);
        } else {
            break;
        }
        if (iter.gte(1e5)) break;
    }
    G.percent = G.xp.div(G.need).mul(100).toFixed(1);
    for (const p in G.panels) {
        G.panels[p].Unlock();
    }
    for (const a in G.ascensions) {
        G.ascensions[a].Tick();
    }
    for (const b in G.buyables) {
        G.buyables[b].Update();
    }
    UpdateUI();
}

function UpdateUI() {
    E.level.innerHTML = 'Level ' + G.level.toFixed(0).format();
    E.prog.innerHTML = G.percent + '% (+' + G.gain.mul(G.mult).div(G.need).mul(5000).toFixed(2).format() + '%)';
    E.bar.style.width = Math.min(G.percent, 100) + '%';
    var points = G.points.toFixed(2).formatZeros().format();
    var gain = G.gain.mul(G.mult).toFixed(2).format();
    E.points.innerHTML = 'Points: ' + points + ' (+' +
        gain + ')';
    document.title = G.percent + '% - Level ' + G.level.toFixed(0).format();
    var high = 0;
    for (const val of icons) {
        if (G.xp.div(G.need).mul(100).gte(val)) {
            high = val;
        }
    }
    E.icon.href = 'icon/' + high + '.png';
}

function CurrencyDebug() {
    const currencydebug = document.getElementById('currencyselect').value;
    if (currencydebug == ' ') document.getElementById('currencyinfo').innerHTML = '';
    else if (currencydebug == 'p') {
        document.getElementById('currencyinfo').innerHTML = JSON.stringify({
            points: G.points.toFixed(2).formatZeros().format(), 
            gain: G.gain.toFixed(2).formatZeros().format(), 
            mult: G.mult.toFixed(2).formatZeros().format(), 
            xp: G.xp.toFixed(2).formatZeros().format()
        });
    } else if (currencydebug == 'devgain') {
        document.getElementById('currencyinfo').innerHTML = JSON.stringify(G.devgain);
    } else {
        document.getElementById('currencyinfo').innerHTML = JSON.stringify(C[currencydebug]);
    }
}

function RenderDebug() {
    CurrencyDebug();
    const buyabledebug = document.getElementById('buyableselect').value;
    if (buyabledebug == ' ') document.getElementById('buyableinfo').innerHTML = '';
    else document.getElementById('buyableinfo').innerHTML = JSON.stringify(G.buyables[buyabledebug]);
    const ascensiondebug = document.getElementById('ascensionselect').value;
    if (ascensiondebug == ' ') document.getElementById('ascensioninfo').innerHTML = ' ';
    else document.getElementById('ascensioninfo').innerHTML = JSON.stringify(G.ascensions[ascensiondebug]);
    const milestonedebug = document.getElementById('milestoneselect').value;
    if (milestonedebug == ' ') document.getElementById('milestoneinfo').innerHTML = ' ';
    else document.getElementById('milestoneinfo').innerHTML = JSON.stringify(G.milestones[milestonedebug]);
}

function DevGive() {
    try {
    const currency = document.getElementById('givecurrency').value;
    if (currency == 'p') {
        G.points = G.points.add(document.getElementById('give').value);
    }
    else {
        C[currency].amt = C[currency].amt.add(document.getElementById('give').value);
    }}
    catch (err) {
        G.log("ERROR/GIVE: " + err.stack, "#faa");
    }
}

function DevGain() {
    try {
    const currency = document.getElementById('gaincurrency').value;
    if (currency == 'p') {
        if (G.devgain.p == undefined) {
            G.devgain.p = new Decimal(0);
        }
        G.devgain.p = G.devgain.p.add(document.getElementById('gain').value);
    }
    else {
        if (G.devgain[currency] == undefined) {
            G.devgain[currency] = new Decimal(0);
        }
        G.devgain[currency] = G.devgain[currency].add(document.getElementById('gain').value);
    }}
    catch (err) {
        G.log("ERROR/GAIN:" + err.stack, "#faa");
    }
}

G.loop = setInterval(function () {
    try {Main()} catch (err) {
        G.log("ERROR/MAIN: " + err.stack, "#faa");
        G.errors++;
        if (G.errors >= G.limit) {
            G.log("ERROR/MAIN: ERROR LIMIT EXCEDED, TERMINATING", "#f55");
            clearInterval(G.loop);
        }
    }
}, 1000 / 50);

G.debugloop = setInterval(function () {
    try {RenderDebug()} catch (err) {
        G.log("ERROR/DEBUG: " + err.stack, "#f77");
        clearInterval(G.debugloop);
    }
}, 1000 / 50);

K = "";

document.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') {
        switch (K) {
            case "devhax":
                document.getElementById("devmenu").style.display = '';
                break;
            case "nohax":
                document.getElementById("devmenu").style.display = 'none';
                break;
            case "debug":
                document.getElementById("debugmenu").style.display = '';
                break;
            case "nobug":
                document.getElementById("debugmenu").style.display = 'none';
                break;
            case "console":
                document.getElementById("debugconsole").style.display = '';
                E.console.scrollTop = E.console.scrollHeight - E.console.clientHeight;
                break;
            case "nocon":
                document.getElementById("debugconsole").style.display = 'none';
        }
        K = "";
    } else {
        K += e.key;
    }
})