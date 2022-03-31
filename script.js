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

String.prototype.format = function(){
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
A.Buyable = function (buyable, id) {
    G.buyables[id] = buyable;
    G.buyables[id].B.addEventListener('click', function () {G.buyables[id].Buy()});
    G.buyables[id].M.addEventListener('click', function () {G.buyables[id].BuyMax()});
    return this;
}
A.Panel = function (panel) {
    G.panels[panel.id] = panel;
    return this;
}

const D = {};
D.Buyable = class Buyable {
    /**
     * Purchasable item
     * @param name {String} name of buyable
     * @param desc {String} description of buyable
     * @param id {String} id of buyable
     * @param initial {Decimal/Number} starting price
     * @param gain {Number} price increase
     * @param onbuy {Function} run when bought
     * @param location {String} id of containing panel
     * @param condition {Function} returns true when buyable should be unlocked
     * @param vars {Object} contains internal variables that should be stored in the buyable object
     */
    constructor (name, desc, id, initial, gain, onbuy, location, condition, vars, type) {
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
        this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format();
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
    CalcMax (points) {
        return BruteForceIntegral(this.cost, this.gain, points);
    }
    Buy () {
        if (this.type == 'p') {
            if (G.points.gte(this.cost)) {
                this.OnBuy();
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            currency = C[this.type].amt;
            if (currency.gte(this.cost)) {
                this.OnBuy();
                currency = currency.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    BuyMax () {
        if (this.type == 'p') {
            while (G.points.gte(this.cost)) {
                this.OnBuy();
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            currency = C[this.type].amt;
            while (currency.gte(this.cost)) {
                this.OnBuy();
                currency = currency.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    Update () {
        this.V.style.width = Math.min(G.points.div(this.cost).mul(100).toFixed(1), 100) + '%';
        this.A.innerHTML = ' Buyable: ' + this.CalcMax(G.points);
        this.C.innerHTML = ' Cost: ' + this.cost.toFixed(2).format();
        this.N.innerHTML = this.name + ' [' + this.owned + ']';
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.T.style.display = '';
        }
    }
}
D.Panel = class Panel {
    /**
     * Container for stuff
     * @param title {String} title of the panel
     * @param id {String} id of the panel
     * @param color1 {String} first color of the panel gradient
     * @param color2 {String} second color of the panel gradient
     * @param color3 {String} color of the panel text
     * @param color4 {String} color or progress bars
     * @param hidden {Boolean} panel should be hidden at the start
     */
    constructor (title, id, color1, color2, color3, color4, hidden) {
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
    constructor (name, id, initial, location, condition) {
        this.name = name;
        this.id = id;
        this.initial = initial;
        this.location = location;
        this.condition = condition;
        this.unlocked = this.condition();
    }
}

const icons = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

function Buy(item, mode) {

}

/**
 * Integral but the lazy way
 * @param principal {Decimal} the starting value
 * @param rate {Number} the growth rate
 * @param value {Decimal} the max amount
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
    UpdateUI();
}

function UpdateUI() {
    E.level.innerHTML = 'Level ' + G.level.toFixed(0).format();
    E.prog.innerHTML = G.percent + '% (+' + G.gain.div(G.need).mul(5000).toFixed(2).format() + '%)';
    E.bar.style.width = Math.min(G.percent, 100) + '%';
    if (G.points.gte('9e6')) E.points.innerHTML = 'Points: ' + G.points.toFixed(3).format() + ' (+' + G.gain.div(2).toFixed(3).format() + ')';
    else E.points.innerHTML = 'Points: ' + G.points.toFixed(1).format() + ' (+' + G.gain.div(2).toFixed(2).format() + ')';
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
}

function DevGain() {
    const currency = document.getElementById('gaincurrency').value;
    if (currency == 'p') {
        G.gain = G.gain.add(document.getElementById('gain').value);
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