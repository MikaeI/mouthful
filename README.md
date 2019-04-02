# mouthful

> Generate a concatenated file of all CSS used on a given website.

## Requirements

- Node.js

## Install

`npm install --save-dev mouthful`

## Usage

Add the following script to your package.json:

```
"scripts": {
  "mouthful": "mouthful https://www.example.com path/to/file.css"
}
```

Now you can add `mouthful` to other scripts or use it from the command line: `npm run mouthful`.


## License

MIT © [Mikael Åsbjørnsson-Stensland](http://persille.no/)
