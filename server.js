(async () => {
    
    const express = require('express');
    const app = express();
    const { LuaFactory } = require('wasmoon');
    const fs = require('fs/promises');
    const wcmatch = require('wildcard-match');
    const factory = new LuaFactory();
    //const lua = await factory.createEngine();
    const luaEngines = [];

    let servers = {};
    let servers_ = [];

    const serverConstructor = (engine, filepath) => ((options, callback) => {
        if (servers_.indexOf(options.url) == -1) {
            let server = { engine: engine, paths: [], filepath: filepath, url: options.url };
            servers[options.url] = server;
            servers_.push(options.url);
            callback({
                url: options.url,
                get: (path, callback) => { server.paths.push({ path: path, callback: callback }) },
                storage: {}
            });
        }
    })
    const cachedAppLua = await fs.readFile(`./sumneko.lua/app.lua`, { encoding: 'utf-8' });

    let static_websites = await fs.readdir('static');
    console.log(static_websites)

    let servers_dir = await fs.readdir('servers');
    for (let i = 0; i < servers_dir.length; i++) {
        let engine = await factory.createEngine();
        await engine.doString(cachedAppLua);
        engine.global.set('server', serverConstructor(engine, `./servers/${servers_dir[i]}`));
        await engine.doString(await fs.readFile(`./servers/${servers_dir[i]}`, { encoding: 'utf-8' }));
        luaEngines.push(engine);
    }
    console.log(servers)

    app.get('/restart/*', async (req, res) => {
        try {
            if (!req.url.includes('favicon.ico')) {
                let match = req.url.match(/\/restart\/([^\/]+)/);
                let url = match[1];
                if (servers_.indexOf(url) != -1) {
                    let server = Object.assign({}, servers[url])
                    delete servers[url]
                    servers_.splice(servers_.indexOf(server.url))
                    await server.engine.doString(await fs.readFile(server.filepath, { encoding: 'utf-8' }));
                }
            }
            res.send('')
        } catch (e) {}
    })

    app.get('*', async (req, res) => {
        try {
            if (!req.url.includes('favicon.ico')) {
                let match = req.url.match(/\/([^\/]+)(\/[^?]*){0,1}(\?.*){0,1}/);
                let url = { url: match[1] || '', path: ((match[2][match[2].length - 1] == '/' && match[2] != '/') ? match[2].slice(0, -1) : match[2]) || '', query: match[3] || '' };
                if (servers_.indexOf(url.url) == -1) {
		        	if (static_websites.indexOf(url.url) == -1) {
		        		res.send('404 Not Found')
                    } else {
                        res.send(await fs.readFile(`./static/${url.url}${url.path}/index`))
                    }
                } else {
                    let found = false;
                    for (let i = 0; i < servers[url.url].paths.length && !found; i++) {
                        if (wcmatch(servers[url.url].paths[i].path.replace('*', '**'))(url.path)) {
                            res.send(servers[url.url].paths[i].callback(url));
                            found = true;
                        }
                    }
                    if (!found) {
                        res.send('404 Not Found');
                    }
                }
                console.log(url)
            }
        } catch (e) {}
    })

    app.listen(8000);
    console.log(`
Start time: ${new Date()}
Engine count: ${luaEngines.length}
Lua websites count: ${servers_.length}
Static websites count: ${static_websites.length}`);
    if (process.argv[3] == 'test') { setTimeout(() => {
        app.close();
    }, 1000); }

})();