(async () => {

    const express = require('express');
    const app = express();
    const { LuaFactory } = require('wasmoon');

    const factory = new LuaFactory();
    const lua = await factory.createEngine();

    lua.global.set('hello', (func) => func());

    app.get('/', async (req, res) => {
        res.send(await lua.doString(`return hello(function () return 'hello world' end)`));
    })

    app.listen(8000)

})();