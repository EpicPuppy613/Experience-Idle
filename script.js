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
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

String.prototype.formatZeros = function () {
    if (!(/[0-9]+(\.)[0-9](?=e[0-9]+)/).test(this)) return this;
    var match = (/[0-9]+(\.)[0-9](?=e[0-9]+)/).match(this)[0];
    return this.replace(/[0-9]+(\.)[0-9](?=e[0-9]+)/, match + '0');
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
    for (const b in G.buyables) {
        if (G.buyables[b].generate == 'p') G.gain = G.gain.add(G.buyables[b].increase());
        else C[G.buyables[b].generate].gain = C[G.buyables[b].generate].gain.add(G.buyables[b].increase());
    }
    for (const b in G.buyables) {
        if (G.buyables[b].generate == 'p') G.mult = G.mult.mul(G.buyables[b].mult());
        else C[G.buyables[b].generate].mult = C[G.buyables[b].generate].mult.mul(G.buyables[b].mult());
    }
    for (const c in C) {
        C[c].Tick();
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
    var points = G.points.toFixed(2).format().formatZeros();
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
    E.debug.innerHTML = `
    POINTS: layer ${G.points.layer}, exp ${G.points.exponent}, gain ${G.gain}, mult ${G.mult}<br>
    XP: ${G.xp.toFixed(2)}, layer ${G.xp.layer}, exp ${G.xp.exponent}
    `;
    for (const c in C) {
        E.debug.innerHTML += `<br>${c}: 
        amt ${C[c].amt.toFixed(2)}, gain ${C[c].gain}, mult ${C[c].mult}`;
    }
}

function DevGive() {
    const currency = document.getElementById('givecurrency').value;
    if (currency == 'p') {
        G.points = G.points.add(document.getElementById('give').value);
    }
    else {
        C[currency].amt = C[currency].amt.add(document.getElementById('give').value);
    }
}

function DevGain() {
    const currency = document.getElementById('gaincurrency').value;
    if (currency == 'p') {
        G.gain = G.gain.add(document.getElementById('gain').value);
    }
    else {
        C[currency].gain = C[currency].gain.add(document.getElementById('gain').value);
    }
}

G.loop = setInterval(Main, 1000 / 50);

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
                break;
            case "nocon":
                document.getElementById("debugconsole").style.display = 'none';
        }
        K = "";
    } else {
        K += e.key;
    }
})