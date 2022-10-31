
const bsct = {
    name: 'bsct',
    chainId: 97,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
}

const bsc = {
    name: 'bsc',
    chainId: 56,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://bsc-dataseed.binance.org')
}

const polygon = {
    name: 'polygon',
    chainId: 137,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://matic-mainnet--jsonrpc.datahub.figment.io/apikey/f9f4ac22e150815e92542133a3bb7bbf')
}

const rinkeby = {
    name: 'rinkeby',
    chainId: 4,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
}

const ropsten = {
    name: 'ropsten',
    chainId: 3,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/FaGh4lg8Aupu1QzIN9yRSu0USZ28ZtkB')
}
const goerli = {
    name: 'goerli',
    chainId: 5,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://goerli.infura.io/v3/')
}

const ethereum = {
    name: 'ethereum',
    chainId: 1,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
}

const okx_chain_mainnet = {
    name: 'okx_chain_mainnet',
    chainId: 66,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.OKX_CHAIN_MAINNET_ETH_URL)
}
const okex_chain_testnet = {
    name: 'okex_chain_testnet',
    chainId: 65,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.OKEX_CHAIN_TESTNET)
}

const platon_mainnet = {
    name: 'platon_mainnet',
    chainId: 210425,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.PLATON_MAINNET)
}
const platon_testnet = {
    name: 'platon_testnet',
    chainId: 2203181,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.PLATON_DEV_TESTNET)
}

const mumbai = {
    name: 'mumbai',
    chainId: 80001,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.MUMBAI)
}

const moonbase_testnet = {
    name: 'moonbase_testnet',
    chainId: 1287,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.MOONBASE_TESTNET)
}

const oasys_testnet = {
    name: 'oasys_testnet',
    chainId: 9372,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.OASYS_TESTNET)
}
const oasys_SandVerse = {
    name: 'oasys_SandVerse',
    chainId: 20197,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(process.env.OASYS_SandVerse)
}


export{
    bsc,
    bsct,
    polygon,
    rinkeby,
    ropsten,
    ethereum,
    okx_chain_mainnet,
    okex_chain_testnet,
    platon_mainnet,
    platon_testnet,
    mumbai,
    moonbase_testnet,
    oasys_testnet,
    oasys_SandVerse,
    goerli,
}