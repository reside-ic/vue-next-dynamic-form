module.exports = {
    testEnvironment: 'jsdom',
    "globals": {
        "ts-jest": {
            tsConfig: 'tsconfig.json',
            "diagnostics": {
                "warnOnly": false
            }
        }
    },
    "moduleFileExtensions": [
        "js",
        "json",
        "vue",
        "ts"
    ],
    "transform": {
        ".*\\.(vue)$": "vue3-jest",
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    "coverageDirectory": "./coverage/",
    "collectCoverage": true,
    "coverageProvider": "v8",
    "coveragePathIgnorePatterns": [
        "/node_modules/"
    ]
};
