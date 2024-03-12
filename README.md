# device-mod-server
Server for GitWeb from Device Mod. Written in Node.js.
## How do static websites work?
They work exactly as before, but use a different url structure. Example url:

```hello.world/help``` => ```./static/hello.world/help```

With the use of folder names as the domain instead of the suffix/domain, websites can now have subdomains, for example:
```help.hello.world```.
## How do servers work?
When the main server starts, it reads all of the lua scripts inside the ```./servers``` folder. For each of these servers, a new **wasmoon** lua engine gets created. Then, the global ```server``` is set to a function for server creation. After, the cached ```./sumneko.lua/app.lua``` script gets executed and adds some functions, such as ```Ternary```, ```Array.indexOf``` and ```Array.push```. Finally, the lua script inside the ```./servers``` folder is executed.


# GitWeb-Sites
This is a fork of the repository containing the community of user created sites (referred from here on out as indexes) for the GitWeb client available with MrCrayfish's Device Mod.

## Rules of Index creation
1. You are limited to the use of domain suffixes presented in the suffix section of this file.
    - *To use anything else, contact the moderation team.*

2. An index must not contain advertisements of any kind in the sense of the oxford dictionary.
    - *Restrictions may be lifted under certain cases.*
    
3. An index must not contain obcene material of any kind in the sense of the oxford dictionary.
    - *Restrictions will never be lifted under any circumstance.*

4. Indexes should primarily be in the English language defined by the oxford dictionary.
    - *Restrictions may be lifted under certain cases. The server is able to use any language for the domain, path and query.*
    

## Index Domain Suffixes
- .official - Required to be used only by moderation team of **GitWeb**!
    - *for subsites/subindexes - Standard multiple use case suffix*
    
- .app - Required to be used as information indexes on Device Mod addons!
    - *for subsites/subindexes - Standard multiple use case suffix*
    
- .wiki - Recommened for information based indexes!

- .craft - Standard multiple use case suffix!

- .web - Standard multiple use case suffix!
