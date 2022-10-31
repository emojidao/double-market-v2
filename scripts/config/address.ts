import { bsc, bsct, ethereum, moonbase_testnet, mumbai, oasys_SandVerse, oasys_testnet, okex_chain_testnet, okx_chain_mainnet, platon_mainnet, platon_testnet, rinkeby, ropsten, polygon, goerli } from "./network";

const rinkeby_addr = {
    market_proxy: "0x078AB7E728832E162648b64976D83C3bD23615cd",
    market_logic: "0x6C1B62E57278266fEF6128A1484F3BC5be650596",
    proxy_admin: "0x173D9D19bBF4201B8bB45Dccdcb925Cda2090518",
    DoubleSVG: "0x2AEa63A3F519DF9f5A9d8aEfd7187dbe514478dB",
    TimeLockMultiSigWallet: "0x3b1467bB125dafF631067D456001DE717D080231",
    beacon: "0xA236bA8367FE5d6132DBdF703E8d56b413Db9F91",
    doNFT_Factory: "0x0cb53bEb6d0B6Ddc973397C39899fC787F1ad98c",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    //v2
    market_proxy_v2: "0x1247D7f1b02BC9476eB5E5a8B0f33Fbc71c807fA",
    doNFT4907_v2: "0xc7A356DC836CF1ece6de08594f253BFbF0Fe382b",
    doNFTWrap_v2: "0xf86c619FC51be62c71930554Ba1E6fb706b1DC80",
    middle_ware_v2: "0x05a464deC6c1f253aaA6F47185f3691f91bC4dA4",
    DoubleSVGV2: "0x9327AD31697f09753F55ae9E7b48eb031cA2F853",
    double_lib: "0xe6c1984a4bf8fe4ecaef9d70a71ebe9caa9cda06",
    market_beneficiary: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
}

const ropsten_addr = {
    market_proxy: "0xA75989C363bFE3A58FD2a54Da77841551118294d",
    market_logic: "0x4dB1Ad9E60D4C57064679E01504626A205F0B854",
    proxy_admin: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    DoubleSVG: "0x84cAb37c64425B8ff9B3E75E7a901FcAe62BAD79",
    TimeLockMultiSigWallet: "",
    beacon: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    doNFT_Factory: "",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}

const bsct_addr = {
    market_proxy: "0xAE1ABbB6550431Ad1dE32621509E3e71287F8aac",
    market_logic: "0xC864966B37099aBC109050a02BbDB5D37Ff95274",
    proxy_admin: "0xC7EC527905f5A8e624ffd1609f18B4Eb59eD7144",
    DoubleSVG: "0x1778a8412dec009e014CE0C6ce1a70052D2bcC87",
    TimeLockMultiSigWallet: "0x3C0b085210675027B9ed19f6AA8E72d1ce22e73a",
    beacon: "0x352280938A78d3299ddb81F8FD37281b648a8f85",
    doNFT_Factory: "0xc67c43dfA2E45e6C90c107bDF1440c8bcAc2c522",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    //v2
    market_proxy_v2: "0x0202d3B8A1Cf1CC0A84fe7977E5C35c3089aB9Af",
    doNFT4907_v2: "0x354E2cD07881F62CcE984bf020CD39b0Df1410c3",
    doNFTWrap_v2: "0xCbA8D2b21d4eb99bfE86b5175A26505952a6f1eb",
    middle_ware_v2: "0x55AF14F744a504aD0500B23E8c8971DBAeE84a93",
    DoubleSVGV2: "0xcbD43E01D37afA5b4d17fDC95A5a0084E3d4A2fF",
    double_lib: "0x5a47acaa27364d089F82161e2AFF6C90D2ab64FA",
    market_beneficiary: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
}

const bsc_addr = {
    market_proxy: "0x2250Fe9F5825Aa53f7dB66f5B2eCcc21B417cf57",
    market_logic: "0x1ac3aCAE4FA615Ee17B4F8a436b528e952987c66",
    // proxy_admin: "0xf3C7028651F2D3b3F5C7873f3a9C523e6462aCc9",//v1.2.x
    proxy_admin: "0x3E756E5eF0A58C3D59509E8246E0926de4B99c86",//v2 gnosis-bsc
    DoubleSVG: "0xb49bAD56441fb742AF5bC7BFE3a0233021912f0b",
    TimeLockMultiSigWallet: "0x3E756E5eF0A58C3D59509E8246E0926de4B99c86",
    beacon: "0x92cebeaC4efa490687eE15c834B70bB424035143",
    ComplexDoNFT: "0xd0da3bbbd11a8c8f22f5e7d0620eee8a71b57485",
    doNFT_Factory: "0x5E1c4cCD2C41c1C35F660Cd53b306E07D5afaD5b",
    contract_owner: "0x25ddD796423944Df8e794BB8A40bD008e4BCa945",
    contract_admin: "0x52c5aC6f05629b36f2dC2C80e5905d6110f4D389",
    //v2
    market_proxy_v2: "0x3657d50543de737835EDaC89Ba1b7aaF7Ac17b31",
    doNFT4907_v2: "0xf2AEb479129083cCA2168D0739e18AbF73010a5C",
    doNFTWrap_v2: "0x2B85C4d67e3fBf443cAABe97dAfD2523C63b9173",
    middle_ware_v2: "0xe0a68E5C045C401133C2D0f1f61b9979383848E2",
    DoubleSVGV2: "0x57E1722602d8220B1A490021e5ace309aFa1B5D5",
    double_lib: "0x77909544af2e8a574611fc1703401834f0c78e8d",
    market_beneficiary: "0x25ddd796423944df8e794bb8a40bd008e4bca945",
}

const polygon_addr = {
    market_proxy: "0x935329bCeA69AFbd8a0627D111a30bc3B433f7a2",
    market_logic: "0xD0dA3bBBd11A8c8F22f5e7d0620eEE8a71b57485",
    proxy_admin: "0xb49bAD56441fb742AF5bC7BFE3a0233021912f0b",
    DoubleSVG: "0x6793619c3Dd9D545520923da47C6f8824e2cC30F",
    TimeLockMultiSigWallet: "0xb49bAD56441fb742AF5bC7BFE3a0233021912f0b",
    beacon: "0xCD131eb7Fb4ee596a0E1668196f4Cf16ab87f58a",
    ComplexDoNFT: "0x0891c60efdd6eE73b80edcED9d5e0742a48DA998",
    doNFT_Factory: "0x1927f93e0038524179cc6e438c20d68413921b06",
    contract_owner: "0xDc9eF29B0F9b04bFE04a041701660CF307945B66",
    contract_admin: "0x52c5aC6f05629b36f2dC2C80e5905d6110f4D389",
    //v2
    market_proxy_v2: "0x01F81478d8F9e0Feee5aF22D6631A796cd7f5b1A",
    doNFT4907_v2: "0xdc553e086458FEebc9d2002ee2f93a83f312C67d",
    doNFTWrap_v2: "0x451F21d9a390dda9B8DCBB706AB79e305B8872c3",
    middle_ware_v2: "0x3E55A0d1d7ef37bf0764363C43D8b5f79F8D46Ad",
    DoubleSVGV2: "0xc5038E0a4aB9BC9Be0709FC1bE177C132EeFe498",
    double_lib: "0xb37a35d8735e02927189756955f67ffcea586847",
    market_beneficiary: "0xDc9eF29B0F9b04bFE04a041701660CF307945B66",
}

const ethereum_addr = {
    market_proxy: "0xb49bAD56441fb742AF5bC7BFE3a0233021912f0b",
    market_logic: "0xf3C7028651F2D3b3F5C7873f3a9C523e6462aCc9",
    proxy_admin: "0x2250Fe9F5825Aa53f7dB66f5B2eCcc21B417cf57",
    DoubleSVG: "0xD0dA3bBBd11A8c8F22f5e7d0620eEE8a71b57485",
    TimeLockMultiSigWallet: "0x1ac3aCAE4FA615Ee17B4F8a436b528e952987c66",
    beacon: "",//通用版
    doNFT_Factory: "0xe33b367d3a985eb9c53a7a4031f6b1b5aa4392d1",
    contract_owner: "0x98Fa5dd1B0518AeBc0D6a1a227CA83e85C80F442",//gnosis
    contract_admin: "0x52c5aC6f05629b36f2dC2C80e5905d6110f4D389",//deployer
    //v2
    market_proxy_v2: "0xe0a68e5c045c401133c2d0f1f61b9979383848e2",
    doNFT4907_v2: "0x5e1c4ccd2c41c1c35f660cd53b306e07d5afad5b",
    doNFTWrap_v2: "0xd97285b29cc3dd308c244b784facdd0e0b26bae5",
    middle_ware_v2: "0x01696c613b628e2d0054180a6fed13893ee51474",
    DoubleSVGV2: "0x891a72f0a3cefa2c5296fe6c79538ba14928613c",
    double_lib: "0xbb9b78d08bf65e8c598a197748d373f0909c912b",
    market_beneficiary: "0x98fa5dd1b0518aebc0d6a1a227ca83e85c80f442",
}

const okex_chain_testnet_addr = {
    market_proxy: "0xFb8fE9654094bb9d1dEc1ea917521eBF2cD5EdB4",
    market_logic: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    proxy_admin: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    DoubleSVG: "0x84cAb37c64425B8ff9B3E75E7a901FcAe62BAD79",
    TimeLockMultiSigWallet: "",
    beacon: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    ComplexDoNFT: "",
    doNFT_Factory: "",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}
const okx_chain_mainnet_addr = {
    market_proxy: "",
    market_logic: "",
    proxy_admin: "",
    DoubleSVG: "",
    TimeLockMultiSigWallet: "",
    beacon: "",
    ComplexDoNFT: "",
    doNFT_Factory: "",
    contract_owner: "",
    contract_admin: "",
    MiddleWare: "",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}

const platon_testnet_addr = {
    market_proxy: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    market_logic: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    proxy_admin: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    DoubleSVG: "0x84cAb37c64425B8ff9B3E75E7a901FcAe62BAD79",
    TimeLockMultiSigWallet: "0xFb8fE9654094bb9d1dEc1ea917521eBF2cD5EdB4",
    beacon: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    ComplexDoNFT: "",
    doNFT_Factory: "0xA75989C363bFE3A58FD2a54Da77841551118294d",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "0x17130EC173f686aaACB99cF1311F3340A995182C",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}
const platon_mainnet_addr = {
    market_proxy: "",
    market_logic: "",
    proxy_admin: "",
    DoubleSVG: "",
    TimeLockMultiSigWallet: "",
    beacon: "",
    ComplexDoNFT: "",
    doNFT_Factory: "",
    contract_owner: "",
    contract_admin: "",
    MiddleWare: "",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}
const mumbai_addr = {
    market_proxy: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    market_logic: "0xFb8fE9654094bb9d1dEc1ea917521eBF2cD5EdB4",
    proxy_admin: "0x4dB1Ad9E60D4C57064679E01504626A205F0B854",
    DoubleSVG: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    TimeLockMultiSigWallet: "",
    beacon: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    ComplexDoNFT: "",
    doNFT_Factory: "0x21b253B71Ab8eb5dcc89fe2f8dBb549F5a031984",//v2
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "0x8Bd3D02147dD017556f77454a3e2611FD3F5079a",
    //v2
    market_proxy_v2: "0x3687987a984fbB9F909aF568218D7f5a1017B743",
    doNFT4907_v2: "0xD5D183C5e9328e002427c96Aa880E2C8A8ED9aa1",
    doNFTWrap_v2: "0x2cc2EecbC1889723AfaD8F6A985EfF070D0b49cb",
    middle_ware_v2: "0x7F0CD9feF80c61C9E446D0945840745412745D53",
    DoubleSVGV2: "0x8733787bCC6dAd6fDb35373bb804e34958183c4A",
    double_lib: "0xd923eBCA1Fb5559dB29Ae1976d1e928bF44FEB94",
    market_beneficiary: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
}

const goerli_addr = {
    market_proxy: "0x0000000000000000000000000000000000000000",
    market_logic: "0x0000000000000000000000000000000000000000",
    proxy_admin: "0xfB7ff746A0aeBDE0012813565FC3Fb8281f23E01",
    DoubleSVG: "",
    TimeLockMultiSigWallet: "",
    beacon: "0x0000000000000000000000000000000000000000",
    ComplexDoNFT: "0x0000000000000000000000000000000000000000",
    doNFT_Factory: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "",
    //v2
    market_proxy_v2: "0x08D0b6902338DcE3eE08d0e72186D2572b2d7bfA",
    doNFT4907_v2: "0xD53c1d27185A7CE55518bE46d3F40368667bfa87",
    doNFTWrap_v2: "0x8Bd3D02147dD017556f77454a3e2611FD3F5079a",
    middle_ware_v2: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    DoubleSVGV2: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    double_lib: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    market_beneficiary: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
}

const moonbase_testnet_addr = {
    market_proxy: "0x4dB1Ad9E60D4C57064679E01504626A205F0B854",
    market_logic: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    proxy_admin: "0xFb8fE9654094bb9d1dEc1ea917521eBF2cD5EdB4",
    DoubleSVG: "0x84cAb37c64425B8ff9B3E75E7a901FcAe62BAD79",
    TimeLockMultiSigWallet: "",
    beacon: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    ComplexDoNFT: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    doNFT_Factory: "0xA75989C363bFE3A58FD2a54Da77841551118294d",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "0x1bb259Ad7AaE3a3c1aaf6C995bc96be5a3BC8C2C",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}

const oasys_testnet_addr = {
    market_proxy: "",
    market_logic: "",
    proxy_admin: "",
    DoubleSVG: "",
    TimeLockMultiSigWallet: "",
    beacon: "",
    ComplexDoNFT: "",
    doNFT_Factory: "",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}

const oasys_SandVerse_addr = {
    market_proxy: "0x2d3Ad900b865AA4BD9C27f85E9F2Fd2aEDd8fC21",
    market_logic: "0xd5e2d2251209fE10023e9A423b656E91E2c47584",
    proxy_admin: "0xB6F405c735E0E92AE97B63e9da29b29eb43b0b7d",
    DoubleSVG: "0x84cAb37c64425B8ff9B3E75E7a901FcAe62BAD79",
    TimeLockMultiSigWallet: "",
    beacon: "0x4dB1Ad9E60D4C57064679E01504626A205F0B854",
    ComplexDoNFT: "0xFb8fE9654094bb9d1dEc1ea917521eBF2cD5EdB4",
    doNFT_Factory: "0xA75989C363bFE3A58FD2a54Da77841551118294d",
    contract_owner: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    contract_admin: "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123",
    MiddleWare: "0x08D0b6902338DcE3eE08d0e72186D2572b2d7bfA",
    //v2
    market_proxy_v2: "",
    doNFT4907_v2: "",
    doNFTWrap_v2: "",
    middle_ware_v2: "",
    DoubleSVGV2: "",
    double_lib: "",
    market_beneficiary: "",
}

export class AddressConfig {
    public static network = ethereum;
    public static royaltyAdmin: string = "0x3569FEBAc68368F7CC8B2Cd01A528e8CbDAdb123";

    public static log_network() {
        console.log("--------", AddressConfig.network, "-------");
    }

    public static get market_proxy(): string {
        return this.CurAddr.market_proxy;
    }

    public static get proxy_admin(): string {
        return this.CurAddr.proxy_admin;
    }

    public static get double_svg(): string {
        return this.CurAddr.DoubleSVG;
    }

    public static get multi_sig_wallet(): string {
        return this.CurAddr.TimeLockMultiSigWallet;
    }

    public static get market_logic(): string {
        return this.CurAddr.market_logic;
    }

    public static get beacon(): string {
        return this.CurAddr.beacon;
    }

    public static get doNFT_Factory(): string {
        return this.CurAddr.doNFT_Factory;
    }

    public static get contract_admin(): string {
        return this.CurAddr.contract_admin;
    }
    public static get contract_owner(): string {
        return this.CurAddr.contract_owner;
    }

    public static get market_proxy_v2(): string {
        return this.CurAddr.market_proxy_v2;
    }

    public static get doNFT4907_v2(): string {
        return this.CurAddr.doNFT4907_v2;
    }
    public static get doNFTWrap_v2(): string {
        return this.CurAddr.doNFTWrap_v2;
    }
    public static get DoubleSVGV2(): string {
        return this.CurAddr.DoubleSVGV2;
    }

    public static get market_beneficiary(): string {
        return this.CurAddr.market_beneficiary;
    }


    public static get CurAddr() {
        switch (AddressConfig.network) {
            case bsct:
                return bsct_addr;
            case rinkeby:
                return rinkeby_addr;
            case bsc:
                return bsc_addr;
            case ropsten:
                return ropsten_addr;
            case ethereum:
                return ethereum_addr;
            case okex_chain_testnet:
                return okex_chain_testnet_addr;
            case okx_chain_mainnet:
                return okx_chain_mainnet_addr;
            case platon_testnet:
                return platon_testnet_addr;
            case platon_mainnet:
                return platon_mainnet_addr;
            case mumbai:
                return mumbai_addr;
            case moonbase_testnet:
                return moonbase_testnet_addr;
            case oasys_testnet:
                return oasys_testnet_addr;
            case oasys_SandVerse:
                return oasys_SandVerse_addr;
            case polygon:
                return polygon_addr;
            case goerli:
                return goerli_addr;
        }
    }
}

