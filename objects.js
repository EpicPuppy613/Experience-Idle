const G = {};
G.level = new Decimal(0);
G.xp = new Decimal(0);
G.need = new Decimal(500);
G.percent = 0;
G.gain = new Decimal(0);
G.mult = new Decimal(1);
G.points = new Decimal('10');
G.buyables = {};
G.panels = {};
G.ascensions = {};

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
A.Ascension = function (ascension) {
    var id = ascension.id;
    G.ascensions[id] = ascension;
    G.ascensions[id].A.addEventListener('click', function () {G.ascensions[id].Ascend() });
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
     * @param {Number} tier - tier for resetting on ascension
     * @param {String} generate - currency to generate
     * @param {Function} increase - returns amount to gain, most likely going to be (rate * owned)
     * @param {Function} mult - returns multiplier for the buyable's generation currency
     */
    constructor(name, desc, id, initial, gain, onbuy, location, condition, vars, type, tier, generate, increase, mult) {
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
        this.tier = tier;
        this.generate = generate;
        this.increase = increase;
        this.mult = mult;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.startVar = {};
        for (const variable in vars) {
            this[variable] = vars[variable];
            this.startVar[variable] = vars[variable];
        }
        this.E = document.createElement('div');
        this.T = document.createElement('p');
        this.N = document.createElement('h3');
        this.D = document.createElement('span');
        this.D.innerHTML = this.desc;
        this.N.innerHTML = this.name;
        this.E.appendChild(this.T);
        this.E.style.display = 'inline-block';
        this.E.style.width = '90%';
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
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            if (C[this.type].amt.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                C[this.type].amt = C[this.type].amt.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
    }
    BuyMax() {
        if (this.type == 'p') {
            while (G.points.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
                G.points = G.points.sub(this.cost);
                this.cost = this.cost.mul(this.gain);
                this.owned += 1;
            }
        }
        else {
            while (C[this.type].amt.gte(this.cost)) {
                try {
                    this.OnBuy();
                }
                catch (err) {
                    console.log(err)
                }
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
            if (this.unlocked) this.T.style.display = 'inline-block';
        }
    }
    Reset() {
        this.owned = 0;
        this.cost = this.initial;
        this.unlocked = false;
        this.T.style.display = 'none';
        for (const v in this.startVar) {
            this[v] = this.startVar[v];
        }
        this.Update();
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
     * @param {Function} condition - function returns true if the panel is unlocked
     */
    constructor(title, id, color1, color2, color3, color4, condition) {
        this.title = title;
        this.id = id;
        this.color = [color1, color2, color3, color4];
        this.condition = condition;
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.E = document.createElement('div');
        if (!this.unlocked) this.E.style.display = 'none';
        this.T = document.createElement('h2');
        this.T.innerHTML = this.title;
        this.E.appendChild(this.T);
        this.E.style.background = 'linear-gradient(' + this.color[0] + ',' + this.color[1] + ')';
        this.E.style.color = this.color[2];
        this.E.classList.add('panel');
        this.S = document.createElement('div');
        this.S.style.columns = '2';
        this.E.appendChild(this.S);
        document.getElementById('main').appendChild(this.E);
        document.getElementById('main').appendChild(document.createElement('br'));
    }
    Unlock() {
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = '';
        }
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
     * @param {Number} tier - tier for resetting on ascension
     */
    constructor(name, id, initial, location, condition, tier) {
        this.name = name;
        this.id = id;
        this.initial = initial;
        this.location = location;
        this.condition = condition;
        this.tier = tier;
        this.mult = new Decimal(1);
        try {
            this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.amt = new Decimal(initial);
        this.gain = new Decimal(0);
        this.E = document.createElement('div');
        this.V = document.createElement('strong');
        this.V.innerHTML = name + ': 0 (+0.00)';
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
        this.V.innerHTML = this.name + ': ' + this.amt.toFixed(2).format() + ' (+' + this.gain.toFixed(2).format() + ')';
        this.amt = this.amt.add(this.gain.mul(this.mult));
        if (!this.unlocked) {
            this.Unlock();
        }
    }
    Reset() {
        this.amt = new Decimal(this.initial);
        this.gain = new Decimal(0);
        this.unlocked = false;
        this.E.style.display = 'none';
        this.Tick();
    }
}

D.Ascension = class Ascension {
    /**
     * reset progress to gain a new currency
     * @param {String} name - name for the ascension
     * @param {String} id - unique id for the ascension
     * @param {String} currency - id of a currency to reward
     * @param {Number} req - target currency amount required to ascend
     * @param {String} target - required currency type
     * @param {Function} scale - scaling for multiple of the new currency
     * @param {Number} mult - total multiplier for the new currency
     * @param {Function} condition - function that returns true if the ascension is unlocked
     * @param {String} location - panel container for the ascension
     * @param {Number} tier - tier of reset, all lower tiers are reset
     */
    constructor(name, id, currency, req, target, scale, mult, condition, location, tier) {
        this.name = name;
        this.id = id;
        this.currency = currency;
        this.req = new Decimal(req);
        this.target = target;
        this.scale = scale;
        this.mult = mult;
        this.condition = condition;
        this.location = location;
        this.tier = tier;
        this.ascensions = new Decimal(0);
        this.reward = new Decimal(0);
        try {
        this.unlocked = this.condition();
        } catch {
            this.unlocked = false;
        }
        this.E = document.createElement('div');
        if (!this.unlocked) this.E.style.display = 'none';
        this.T = document.createElement('h3');
        this.T.innerHTML = this.name;
        this.E.appendChild(this.T);
        this.S = document.createElement('p');
        this.N = document.createElement('strong');
        this.N.innerHTML = 'Requires: ';
        this.NV = document.createElement('span');
        this.R = document.createElement('strong');
        this.R.innerHTML = 'Reward: ';
        this.RV = document.createElement('span');
        this.A = document.createElement('button');
        this.A.innerHTML = 'Ascend';
        this.A.disabled = true;
        if (this.target == 'p') this.NV.innerHTML = this.req.toFixed(2).format() + ' Pts';
        else this.NV.innerHTML = this.req.toFixed(2).format() + ' ' + C[this.target].name;
        if (this.currency == 'p') this.RV.innerHTML = this.reward.toFixed(2).format() + ' Pts';
        else this.RV.innerHTML = this.reward.toFixed(2).format() + ' ' + C[this.currency].name;
        this.S.appendChild(this.N);
        this.S.appendChild(this.NV);
        this.S.appendChild(document.createElement('br'));
        this.S.appendChild(this.R);
        this.S.appendChild(this.RV);
        this.S.appendChild(document.createElement('br'));
        this.S.appendChild(this.A);
        this.E.appendChild(this.S);
        G.panels[this.location].S.appendChild(this.E);
    }
    Tick() {
        if (!this.unlocked) {
            this.unlocked = this.condition();
            if (this.unlocked) this.E.style.display = '';
        }
        if (this.target == 'p') {
            if (G.points.gte(this.req)) {
                this.A.disabled = false;
            } else {
                this.A.disabled = true;
            }
            this.reward = new Decimal(this.scale(G.points.div(this.req))).add(1);
            
        }
        else {
            if (C[this.target].amt.gte(this.req)) {
                this.A.disabled = false;
            } else {
                this.A.disabled = true;
            }
            this.reward = new Decimal(this.scale(C[this.target].amt.div(this.req))).add(1);
            
        }
        if (this.currency == 'p') {
            if (this.reward.lte(0.001)) this.RV.innerHTML = '0.00 Pts';
            else this.RV.innerHTML = this.reward.toFixed(2).format() + ' Pts';
        }
        else {
            if (this.reward.lte(0.001)) this.RV.innerHTML = '0.00 ' + C[this.currency].name;
            else this.RV.innerHTML = this.reward.toFixed(2).format() + ' ' + C[this.currency].name;
        }
    }
    Ascend() {
        this.ascensions = this.ascensions.add(1);
        C[this.currency].amt = C[this.currency].amt.add(this.reward);
        G.points = new Decimal(10);
        G.gain = new Decimal(0);
        G.level = new Decimal(0);
        G.xp = new Decimal(0);
        G.need = new Decimal(500);
        for (const c in C) {
            if (C[c].tier < this.tier) {
                C[c].Reset();
            }
        }
        for (const b in G.buyables) {
            if (G.buyables[b].tier < this.tier) {
                G.buyables[b].Reset();
            }
        }
    }
}