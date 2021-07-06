const storage = {};

module.exports = storage;

const weekOfYear = function (curDate) {
    /*
     date1是当前日期
     date2是当年第一天
     d是当前日期是今年第多少天
     用d + 当前年的第一天的周差距的和在除以7就是本年第几周
     */
    curDate = curDate || new Date();
    var a = curDate.getFullYear();
    var b = curDate.getMonth() + 1;
    var c = curDate.getDate();

    var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil(
        (d + ((date2.getDay() + 1) - 1)) / 7
    );
};

const getWeekUpdateTime = function () {
    const date = new Date();
    const year = date.getFullYear();
    const week = weekOfYear(date);
    return year + '' + week;
};

const getDayUpdateTime = function (curDate) {
    curDate = curDate || new Date();
    return curDate.toLocaleDateString();
};

storage._cache = {};

/**
 * 返回值为false代表调用失败
 */
storage.set = function (key, value) {
    if (typeof key === 'string' && typeof value !== 'undefined') {
        try {
            let data = JSON.stringify(value);
            cc.sys.localStorage.setItem(key, data);
            // 设置缓存
            this._cache[key] = data;
            return true;
        } catch (err) { }
    } else {
        cc.error('storage set error');
    }
    return false;
};

/**
 * 返回值为undefined代表调用失败
 */
storage.get = function (key) {
    // 先读取缓存
    if (typeof this._cache[key] !== 'undefined') {
        return JSON.parse(this._cache[key]);
    }

    let result = null;
    try {
        let data = cc.sys.localStorage.getItem(key);
        if (data && typeof data === 'string') {
            // 设置缓存
            this._cache[key] = data;
            result = JSON.parse(data);
        } else if (data !== '' && data !== null) {
            result = undefined;
        }
    } catch (e) {
        result = undefined;
    }
    return result;
};

/**
 * 返回值为false代表调用失败
 */
storage.add = function (key, value = 1) {
    let result = this.get(key);
    if (result !== undefined) {
        result = result || 0;
        result += value;
        if (this.set(key, result)) {
            return result;
        }
    }
    return false;
};


/**
 * 返回值为false代表调用失败
 */
storage.remove = function (key) {
    try {
        cc.sys.localStorage.removeItem(key);
        delete this._cache[key];
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * 返回值为false代表调用失败
 */
storage.clear = function () {
    try {
        cc.sys.localStorage.clear();
        cc.js.clear(this._cache);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * 设置本周数据 [返回值为false代表调用失败]
 * @param {*} key 
 * @param {*} value 
 * @param {Function} cb 当已存在本周的数据时，会根据cb的返回决定是否存储，true代表存储
 */
storage.setWeek = function (key, value, cb) {
    const updateTime = getWeekUpdateTime();

    if (cb) {
        const data = this.getWeek(key);
        if (data !== undefined) {
            if (data === null || cb(data, value)) {
                return this.set(key, {
                    data: value,
                    updateTime: updateTime
                });
            }
        }
    } else {
        return this.set(key, {
            data: value,
            updateTime: updateTime
        });
    }

    return false;
};

/**
 * 获取本周数据 [返回值为undefined代表调用失败]
 * @param {*} key 
 */
storage.getWeek = function (key) {
    const data = this.get(key);
    if (data && data.updateTime == getWeekUpdateTime()) {
        return data.data;
    }
    return data && null;
};

/**
 * 设置本天数据 [返回值为false代表调用失败]
 * @param {*} key 
 * @param {*} value 
 * @param {Function} cb 当已存在本天的数据时，会根据cb的返回决定是否存储，true代表存储
 */
storage.setDay = function (key, value, cb) {
    const updateTime = getDayUpdateTime();

    if (cb) {
        const data = this.getDay(key);
        if (data !== undefined) {
            if (data === null || cb(data, value)) {
                return this.set(key, {
                    data: value,
                    updateTime: updateTime
                });
            }
        }
    } else {
        return this.set(key, {
            data: value,
            updateTime: updateTime
        });
    }

    return false;
};

/**
 * 获取本天数据 [返回值为undefined代表调用失败]
 * @param {*} key 
 */
storage.getDay = function (key) {
    const data = this.get(key);
    if (data && data.updateTime == getDayUpdateTime()) {
        return data.data;
    }
    return data && null;
};