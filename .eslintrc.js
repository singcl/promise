module.exports = {
    "parserOptions": {
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
      "max-len": ["error", { "comments": 200 }],
      "linebreak-style": 0,
      "indent": ["error", 4],
      "no-var": "off",
      "semi": "off",
      "max-len": ["error", 150],
      "no-multi-spaces": ["error", { ignoreEOLComments: true }]
    }
};