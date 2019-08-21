import {proxyTrack }  from './proxyTrack.js'

/***/

function MyClass() {}

MyClass.prototype = {
    isPrime: function() {
        const num = this.num;
        for(var i = 2; i < num; i++)
            if(num % i === 0) return false;
        return num !== 1 && num !== 0;
    },

    num: null,
};

MyClass.prototype.constructor = MyClass;

const trackedClass = proxyTrack(MyClass);

function start() {
    const my = new trackedClass();
    my.num = 573723653;
    if (!my.isPrime()) {
        return `${my.num} is not prime`;
    }
}

function main() {
    start();
}

main();
