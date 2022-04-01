//COLUMN CONFIGURATION
var width = window.innerWidth;
document.getElementById('main').style.columnCount = 3;
if (width < 1000) {
    document.getElementById('main').style.columnCount = 2;
}
if (width < 600) {
    document.getElementById('main').style.columnCount = 1;
}

window.addEventListener('resize', function (e) {
    width = window.innerWidth;
    document.getElementById('main').style.columnCount = 3;
    if (width < 1000) {
        document.getElementById('main').style.columnCount = 2;
    }
    if (width < 600) {
        document.getElementById('main').style.columnCount = 1;
    }
});

String.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

//SCALING CONFIGURATION
const S = {};
//LEVEL SCALING
S.level = 1.5;

const G = {};
G.level = new Decimal(0);
G.xp = new Decimal(0);
G.need = new Decimal(1000);
G.percent = 0;
G.gain = new Decimal(0);
G.points = new Decimal('10');
G.buyables = {};
G.panels = {};

const C = {};

const E = {};
E.level = document.getElementById('curlvl');
E.prog = document.getElementById('lvlprog');
E.bar = document.getElementById('barprog');
E.icon = document.getElementById('icon');
E.points = document.getElementById('points');
E.debug = document.getElementById('debug');
E.devmenu = document.getElementById('dev');

E.devmenu.style.display = 'none';

const A = {};
A.Buyable = function (buyable) {
    var id = buyable.id;
    G.buyables[id] = buyable;
    G.buyables[id].B.addEventListener('click', function () { G.buyables[id].Buy() });
    G.buyables[id].M.addEventListener('click', function () { G.buyables[id].BuyMax() });
    return this;
}
A.Panel = function (panel) {
    G.panels[panel.id] = panel;
    return this;
}
A.Currency = function (currency) {
    C[currency.id] = currency;
    return this;
}

const D = {};
D.Buyable = class Buyable {
    /**
     * A buyable object by using a currency
     * @param {String} name - the name of the buyable
     * @param {String} desc - a description of the buyable
     * @param {String} id - unique id for the buyable
     * @param {Number} initial - initial price of the buyable
     * @param {Number} gain - price gain of the buyable
     * @param {Function} onbuy - execute on purchase of the buyable
     * @param {String} location - containing panel of the buyable
     * @param {Function} condition - function that returns true when the buyable should be unlocked
     * @param {Object} vars - internal variables for the buyable
     * @param {String} type - purchase currency
     */
    constructor(name, desc, id, initial, gain, onbuy, location, condition, vars, type) {
        this.name = name;
        this.desc = desc;
        this.id = id;
        this.cost = new Decimal(initial);
        this.initial = new Decimal(initial);
        this.gain = gain;
        this.OnBuy = onbuy;
        this.owned = 0;
        this.location = location;
        this.condition = condition;
        this.type = type;
        this.unlocked = this.condition();
        for (const variable in vars) {
            this[variable] = vars[variable];
        }
        this.E = document.createElement('div');
        this.T = document.createElement('p');
        this.N = document.createElement('strong');
        this.D = document.createElement('span');
        this.D.innerHTML = this.desc;
        this.N.innerHTML = this.name;
        this.E.appendChild(this.T);
        this.T.appendChild(this.N);
        G.panels[this.location].S.appendChild(this.E);
        this.B = document.createElement('button');
        this.B.innerHTML = 'Buy 1';
        this.M = document.createElement('button');
        this.M.innerHTML = 'Buy Max';
        this.C = document.createElement('span');
        if (this.type == 'p') this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' Pts';
        else this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' ' + C[this.type].name;
        this.A = document.createElement('span');
        this.A.innerHTML = ' Buyable: 0';
        this.P = document.createElement('div');
        this.P.classList.add('progress-small');
        this.V = document.createElement('div');
        this.V.classList.add('progress-small-val');
        this.V.style.backgroundColor = G.panels[this.location].color[3];
        this.P.appendChild(this.V);
        this.T.appendChild(document.createElement('br'));
        this.T.appendChild(this.D);
        this.T.appendChild(document.createElement('br'));
        this.T.appendChild(this.P);
        this.T.appendChild(this.B);
        this.T.appendChild(this.C);
        this.T.appendChild(document.createElement('br'));
        this.T.appendChild(this.M);
        this.T.appendChild(this.A);
        if (!this.unlocked) this.T.style.display = 'none';
    }
    CalcMax(points) {
        if (this.type == 'p') return BruteForceIntegral(this.cost, this.gain, points);
        else return BruteForceIntegral(this.cost, this.gain, C[this.type].amt);
    }
    Buy() {
        if (this.type == 'p') {
            if (G.points.gte(this.cost)) {
                this.OnBuy();
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            if (C[this.type].amt.gte(this.cost)) {
                this.OnBuy();
                C[this.type].amt = C[this.type].amt.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    BuyMax() {
        if (this.type == 'p') {
            while (G.points.gte(this.cost)) {
                this.OnBuy();
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            while (C[this.type].amt.gte(this.cost)) {
                this.OnBuy();
                C[this.type].amt = C[this.type].amt.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    Update() {
        if (this.type == 'p') {
            this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' Pts';
            this.V.style.width = Math.min(G.points.div(this.cost).mul(100).toFixed(1), 100) + '%';
        }
        else {
            this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format() + ' ' + C[this.type].name;
            this.V.style.width = Math.min(C[this.type].amt.div(this.cost).mul(100).toFixed(1), 100) + '%';
        }
        this.A.innerHTML = ' Buyable: ' + this.CalcMax(G.points);
        this.N.innerHTML = this.name + ' [' + this.owned + ']';
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.T.style.display = '';
        }
    }
}
D.Panel = class Panel {
    /**
     * A panel that contains stuff
     * @param {String} title - the name of the panel
     * @param {String} id - a unique id for the panel
     * @param {String} color1 - top color for the panel gradient
     * @param {String} color2 - bottom color for the panel gradient
     * @param {String} color3 - text color for the panel
     * @param {String} color4 - progress bar color for the panel
     * @param {Boolean} hidden - if the panel should start hidden
     */
    constructor(title, id, color1, color2, color3, color4, hidden) {
        this.title = title;
        this.id = id;
        this.color = [color1, color2, color3, color4];
        this.hidden = hidden;
        this.E = document.createElement('div');
        this.T = document.createElement('h2');
        this.T.innerHTML = this.title;
        this.E.appendChild(this.T);
        this.E.style.background = 'linear-gradient(' + this.color[0] + ',' + this.color[1] + ')';
        this.E.style.color = this.color[2];
        this.E.classList.add('panel');
        this.S = document.createElement('div');
        this.E.appendChild(this.S);
        if (hidden) this.E.style.display = 'none';
        document.getElementById('main').appendChild(this.E);
        document.getElementById('main').appendChild(document.createElement('br'));
    }
}
D.Currency = class Currency {
    /**
     * A currency that can be used for stuff
     * @param {String} name - the name of the currency
     * @param {String} id - the unique id of the currency
     * @param {Number} initial - the initial amount of the currency
     * @param {String} location - the containing panel for the currency
     * @param {Function} condition - function should return true if the currency is unlocked
     */
    constructor(name, id, initial, location, condition) {
        this.name = name;
        this.id = id;
        this.initial = initial;
        this.location = location;
        this.condition = condition;
        this.unlocked = this.condition();
        this.amt = new Decimal(initial);
        this.gain = new Decimal(0);
        this.E = document.createElement('div');
        this.V = document.createElement('strong');
        this.V.innerHTML = name + ': 0';
        this.E.appendChild(this.V);
        this.GC = document.createElement('option');
        this.GC.value = id;
        this.GC.innerHTML = name;
        document.getElementById('givecurrency').appendChild(this.GC);
        this.RC = document.createElement('option');
        this.RC.value = id;
        this.RC.innerHTML = name;
        document.getElementById('gaincurrency').appendChild(this.RC);
        G.panels[this.location].S.appendChild(this.E);
        if (!this.unlocked) {
            this.E.style.display = 'none';
        }
    }
    Unlock() {
        this.unlocked = this.condition();
        if (this.unlocked) this.E.style.display = '';
    }
    Tick () {
        this.V.innerHTML = this.name + ': ' + this.amt.toFixed(2).format();
        if (!this.unlocked) {
            this.Unlock();
        }
    }
}

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
    G.xp = G.xp.add(G.gain);
    G.points = G.points.add(G.gain.div(100));
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
    for (const b in G.buyables) {
        G.buyables[b].Update();
    }
    for (const c in C) {
        C[c].Tick();
    }
    UpdateUI();
}

function UpdateUI() {
    E.level.innerHTML = 'Level ' + G.level.toFixed(0).format();
    E.prog.innerHTML = G.percent + '% (+' + G.gain.div(G.need).mul(5000).toFixed(2).format() + '%)';
    E.bar.style.width = Math.min(G.percent, 100) + '%';
    if (G.points.gte('9e6')) E.points.innerHTML = 'Points: ' + G.points.toFixed(3).format() + ' (+' +
        G.gain.div(2).toFixed(3).format() + ')';
    else E.points.innerHTML = 'Points: ' + G.points.toFixed(1).format() + ' (+' +
        G.gain.div(2).toFixed(2).format() + ')';
    document.title = G.percent + '% - Level ' + G.level.toFixed(0).format();
    var high = 0;
    for (const val of icons) {
        if (G.xp.div(G.need).mul(100).gte(val)) {
            high = val;
        }
    }
    E.icon.href = 'icon/' + high + '.png';
    E.debug.innerHTML = `
    POINTS: layer ${G.points.layer}, mag ${G.points.mag.toFixed(2)}, exp ${G.points.exponent}<br>
    XP: ${G.xp.toFixed(2)} layer ${G.xp.layer}, mag ${G.xp.mag.toFixed(2)}, exp ${G.xp.exponent}
    `;
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
        if (K == "devhax") {
            E.devmenu.style.display = '';
        } else if (K == "nohax") {
            E.devmenu.style.display = 'none';
        }
        K = "";
    } else {
        K += e.key;
    }
})