# pokemongo-map

A more fast, smaller command-line interface application for Pokèmon GO, showing nearby pokemons on map. Inspired by Python demo: [tejado](https://github.com/tejado/pokemongo-api-demo)

## Getting Started

```
git clone https://github.com/YangYangX/pokemongo-map.git
```

### Prerequisities

* nodejs env.
* browser [chrome,firefox,IE and etc.]

Support platform for now:

* Linux
* MacOS


Windows 10 are not supported yet due to the 'node-gyp rebuild' error on windows, check the issue [here](https://github.com/nodejs/node-gyp/issues/629).<br>

some useful information:
* https://github.com/nodejs/node-gyp
* https://github.com/nodejs/node-gyp/issues/809
* https://github.com/nodejs/node-gyp/issues/629

Windows 7 : not tested yet.

TODO: make windows working.

### Installing

```
npm install
```

If nodejs is not available:
* For debian-and-ubuntu-based-linux:
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
* For MacOS:
```
brew install node
```

## Configuring

#### Apply a Google Map API access token here:
https://developers.google.com/maps/documentation/javascript/get-api-key

#### Save the token in config file:
* Step 1 : Click GET A KEY button => pick "Create a new project", click Continue, wait until the key has been generated.
* Step 2 : Copy&Paste access key to <repo>/config/appConfig.json

## Running

```
Usage: index [options]

Pokemon GO Map

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -U, --username <username>  google user account
  -P, --password <password>  password
  -L, --location <location>  location
  -M, --method <method>      login method
  -R, --radiation            scanning points [faster, but less scanning points]
```

### Example:
```
<shell>$ node index -U account-you-used-for-pokemon@gmail.com -P 1234 -L Stockholm
```
#### Options:

##### -H

print out help message.

#### -V

show version.

#### -U

username
* For google auth login: google account
* For pokemon club login: pokemon club username [TODO]

#### -P

password

#### -L

Specify the scanning origin point, using arrdess as input.

e.g.: "11122,Stockholm", or "Foretag Kungsbron 2, Stockholm"

#### -M

Specify login method, only support google Auth for now.<br>
pokemon club login [TODO]

#### -R

Using radiation scanning way points:

![Radiation scanning matrix](https://s31.postimg.org/d3wdxs9jf/909a727e2a541bf8b722deaadad074c7f258ca22.jpg)

Recommended to **NOT** use this option, so the system will pick Circularity scanning matrix, which works like:

![Circularity scanning matrix](https://s32.postimg.org/dhc30x5tx/909a727e2a541bf8b722deaadad074c7f258ca23.jpg)

###### Other scanning method/matrix :
TODO

### Results:

#### Use option -L Stockholm,Sweden
Searching area will be:

![Searching area](https://s32.postimg.org/ueylld1bp/909a727e2a541bf8b722deaadad074c7f258ca19.jpg)


#### console prints:

![result](https://s31.postimg.org/dr4xyl297/909a727e2a541bf8b722deaadad074c7f258ca22.jpg)

#### data file snippet:

```
...
{
  "id":"465f9d5f31f:118",
  "name":"Goldeen",
  "classification":"Goldfish Pokèmon",
  "location":{
    "lat":59.32871144235132,
    "lng":18.067775290925695
  },
  "properties":{
    "weight":"15.0 kg",
    "height":"0.6 m",
    "avatar": AVATAR_URL
  }
  "timeleft":452235,
  "timestamp":1469524652100
}
...
```

#### **MAP** :
The command will generate a single html page as pokemonMap.html.
Everything should be loaded into that page.
##### NOTE: time-left value in this page is not updated! You need to run the command again to fetch new values.
![result](https://s31.postimg.org/72l3hmwqz/909a727e2a541bf8b722deaadad074c7f258ca19.png)

#### log files:

* info.log => application execution logs
* error.log => error traces.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Version

### 1.0.0

## Future plan

* build-in web service to host the result, so the pokemon data will be keep updated.
* show current location on map.
* get pokemon data based on current coordinates.

## Credits

This small application was coded on the shoulders of giants:
* [tejado](https://github.com/tejado/pokemongo-api-demo)
* [AeonLucid/POGOProtos](https://github.com/AeonLucid/POGOProtos)
* [carldanley/node-pokemon-go-api](https://github.com/carldanley/node-pokemon-go-api)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
