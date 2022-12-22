import { ChainParams } from ".";
//@ts-ignore
import TronWeb from "tronweb";
import { Chain, MainNetRpcUri, TestNetRpcUri } from "../consts";
import { ethers } from "ethers";
import { TezosToolkit } from "@taquito/taquito";
import { evNotifier } from "../notifier";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import * as thor from "web3-providers-connex";
import { Framework } from "@vechain/connex-framework";
import { hethers } from "@hashgraph/hethers";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import TonWeb from "tonweb";
import { FeeMargins } from "../helpers/chain";

/*const EVM_VALIDATORS = [
  "0xffa74a26bf87a32992bb4be080467bb4a8019e00",
  "0x837b2eb764860b442c971f98f505e7c5f419edd7",
  "0x9671ce5a02eb53cf0f2cbd220b34e50c39c0bf23",
  "0x90e79cc7a06dbd227569920a8c4a625f630d77f4",
  "0xdc80905cafeda39cb19a566baeef52472848e82f",
  "0x77745cd585798e55938940e3d4dd0fd7cde7bdd6",
  "0xc2a29b4e9fa71e9033a52611544403241c56ac5e",
];*/

// const _EVM_TESTNET_VALIDATORS = [
//   "0x50aCEC08ce70aa4f2a8ab2F45d8dCd1903ea4E14",
//   "0xae87208a5204B6606d3AB177Be5fdf62267Cd499",
//   "0x5002258315873AdCbdEF25a8E71C715A4f701dF5",
// ];

const middleware_uri = "https://notifier.xp.network";
const testnet_middleware_uri =
  "https://testnet-notifier.xp.network/notify-test/";

export namespace ChainFactoryConfigs {
  export const TestNet: () => Promise<Partial<ChainParams>> = async () => {
    const feeMargin = { min: 1, max: 5 };
    const notifier = evNotifier(testnet_middleware_uri);

    // VeChain related:
    const net = new SimpleNet(TestNetRpcUri.VECHAIN);
    const driver = await Driver.connect(net);
    const provider = thor.ethers.modifyProvider(
      new ethers.providers.Web3Provider(
        new thor.ConnexProvider({ connex: new Framework(driver) })
      )
    );

    return {
      elrondParams: {
        node_uri: TestNetRpcUri.ELROND,
        minter_address:
          "erd1qqqqqqqqqqqqqpgqy2nx5z4cpr90de4sga2v2yx62fph3lg8g6vskt0k2f",
        esdt_swap_address:
          "erd1qqqqqqqqqqqqqpgqc854pa9ruzgs5f8rdzzc02xgq8kqku3ng6vs59vmf8",
        esdt_nft: "XPNFT-af3fde",
        esdt_swap: "WEGLD-708f9b",
        notifier,
        nonce: 2,
        feeMargin,
      },
      tonParams: {
        tonweb: new TonWeb(
          new TonWeb.HttpProvider(TestNetRpcUri.TON, {
            apiKey:
              "abe8c1222f19b0891a9a35889d112dc88562093467db8dda39961eeacd50f9b1",
          })
        ),
        bridgeAddr: "kQBwUu-b4O6qDYq3iDRvsYUnTD6l3WCxLXkv0aH6ywAaPs3c",
        burnerAddr: "kQCbH9gGgqJzXuusUVajW_40brrl2fxTYqMkk6HUhJnIgOQA",
        xpnftAddr: "EQDji0YH-SNT-qi6o5dQQBLeWL0Xmm46fnqj34EYhOL34WDc",
        feeMargin,
        notifier,
      },
      solanaParams: {
        xpnftAddr: "C7bw5dJZwhjWd6TZE3LnE2b1RLqWDiy9XRMA1rajPKQY",
        bridgeContractAddr: "FXaXLtmkuoJCJeX6BnLwQJWgT8cPdwuXN8BmmQzVvuRA",
        endpoint: TestNetRpcUri.SOLANA,
        notifier,
        feeMargin,
      },
      vechainParams: {
        notifier,
        feeMargin,
        nonce: Chain.VECHAIN,
        provider,
        minter_addr: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        erc721_addr: "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B",
        erc1155_addr: "0xf8e81D47203A594245E36C48e151709F0C19fBe8",
        erc721Minter: "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47",
        erc1155Minter: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
      },
      tronParams: {
        provider: new TronWeb({ fullHost: TestNetRpcUri.TRON }),
        notifier,
        minter_addr: "TY46GA3GGdMtu9GMaaSPPSQtqq9CZAv5sK",
        erc721_addr: "TDhb2kyurMwoc1eMndKzqNebji1ap1DJC4",
        erc1155_addr: "TBeSKv5RSFLAi7SCD7hR64xuvP6N26oEqR",
        erc1155Minter: "TBeSKv5RSFLAi7SCD7hR64xuvP6N26oEqR",
        erc721Minter: "TMVDt5PP53eQro5hLafibv2xWzSSDSMyjy",
        validators: [
          "TJuG3kvmGBDxGyUPBbvKePUjbopLurtqSo",
          "TN9bHXEWditocT4Au15mgm7JM56XBnRCvm",
          "TRHLhivxVogGhtxKn6sC8UF2Fr3WBdaT8N",
        ],
        nonce: Chain.TRON,
        feeMargin,
      },
      caduceusParams: {
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.CADUCEUS),
        erc1155_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        erc721_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        erc1155Minter: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        erc721Minter: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
        minter_addr: "0x3fe9EfFa80625B8167B2F0d8cF5697F61D77e4a2",
        nonce: Chain.CADUCEUS,
      },
      avalancheParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.AVALANCHE),
        minter_addr: "0xDdF1f6B8Ae8cd26dBE7C4C3ed9ac8E6D8B3a4FdC",
        erc721_addr: "0xE1D8Df2e06797F22e7ce25c95A7ddccb926f8A1E",
        erc1155Minter: "0xfA9214AEe59a6631A400DC039808457524dE70A2",
        erc721Minter: "0x54Db938575DD089702822F191AEbB25C2Af7D1Ef",
        erc1155_addr: "0xfA9214AEe59a6631A400DC039808457524dE70A2",
        nonce: Chain.AVALANCHE,
        feeMargin,
      },
      polygonParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.POLYGON),
        minter_addr: "0x224f78681099D66ceEdf4E52ee62E5a98CCB4b9e",
        erc721_addr: "0xb678b13E41a47e46A4046a4D8315b32E0F34389c",
        erc1155Minter: "0x5A768f8dDC67ccCA1431879BcA28E93a6c7722bb",
        erc1155_addr: "0xc1D778Ce89154357471bA6c4C6E51f0e590FFe57",
        erc721Minter: "0x6516E2D3387A9CF4E5e868E7842D110c95A9f3B4",
        nonce: Chain.POLYGON,
        feeMargin,
      },
      dfinityParams: {
        agent: new HttpAgent({
          host: "https://ic0.app",
        }),
        bridgeContract: Principal.fromText("e3io4-qaaaa-aaaak-qasua-cai"),
        xpnftId: Principal.fromText("e4jii-5yaaa-aaaak-qasuq-cai"),
        umt: Principal.fromText("evkdu-lqaaa-aaaak-qasva-cai"),
        notifier,
        feeMargin,
      },
      moonbeamParams: {
        nonce: Chain.MOONBEAM,
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.MOONBEAM),
        erc721Minter: "0x1F71E80E1E785dbDB34c69909C11b71bAd8D9802",
        erc1155Minter: "0x10E3EE8526Cc7610393E2f6e25dEee0bD38d057e",
        erc1155_addr: "0xd023739a76Df4cC6260A1Ba25e8BEbCe8389D60D",
        erc721_addr: "0x42027aF22E36e839e138dc387F1b7428a85553Cc",
        minter_addr: "0x0F00f81162ABC95Ee6741a802A1218C67C42e714",
      },
      aptosParams: {
        rpcUrl: TestNetRpcUri.APTOS,
        bridge:
          "0x467fbe95cf51893ce4526e0959771ac1e5b9c578d351aba35b98506476221f18",
        xpnft: "XPNFT",
        notifier,
        feeMargin,
        nonce: Chain.APTOS,
        network: "testnet",
      },
      abeyChainParams: {
        nonce: Chain.ABEYCHAIN,
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.ABEYCHAIN),
        erc721Minter: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
        erc1155Minter: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        erc1155_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        erc721_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        minter_addr: "0x3fe9EfFa80625B8167B2F0d8cF5697F61D77e4a2",
      },
      fantomParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.FANTOM),
        minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
        erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
        erc1155Minter: "string",
        erc1155_addr: "0xE657b66d683bF4295325c5E66F6bb0fb6D1F7551",
        erc721Minter: "string",
        nonce: Chain.FANTOM,
        feeMargin,
      },
      bscParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.BSC),
        minter_addr: "0x3Dd26fFf61D2a79f5fB77100d6daDBF073F334E6",
        erc721_addr: "0x783eF7485DCF27a3Cf59F5A0A406eEe3f9b2AaeB",
        erc1155Minter: "0x5dA3b7431f4581a7d35aEc2f3429174DC0f2A2E1",
        erc721Minter: "0x97CD6fD6cbFfaa24f5c858843955C2601cc7F2b9",
        erc1155_addr: "0xb5278A4808e2345A3B9d08bAc8909A121aFaEBB3",
        nonce: Chain.BSC,
        feeMargin,
      },
      celoParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.CELO),
        minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
        erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
        erc1155_addr: "",
        erc1155Minter: "string",
        erc721Minter: "string",
        nonce: Chain.CELO,
        feeMargin,
      },
      harmonyParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.HARMONY),
        minter_addr: "0x198Cae9EE853e7b44E99c0b35Bddb451F83485d5",
        erc721_addr: "0x1280c5c11bF0aAaaEAeBc998893B42e08B26fD5A",
        erc1155Minter: "0xB546c2358A6e4b0B83192cCBB83CaE37FA572fe1",
        erc721Minter: "0xb036640d6f7cAfd338103dc60493250561Af2eBc",
        erc1155_addr: "0x44FCF0001A2B03260e4Bba44AF93a60C64cE79A2",
        nonce: Chain.HARMONY,
        feeMargin,
      },
      ropstenParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.ROPSTEN),
        erc1155_addr: "0x46Df0d0Dd629d61BDFA567dE61912FDeD883A60d",
        erc721_addr: "0x33DC209D33AddF60cf90Dd4B10f9a198A1A93f63",
        erc1155Minter: "0xE90105827d04522e52AdfA6BF695730E5706C0C2",
        erc721Minter: "0x90d38996B210D45bDF2FD54d091C6061dff0dA9F",
        minter_addr: "0x04a5f9158829Cae5a0a549954AdEaBD47BbB3d2d",
        nonce: Chain.ETHEREUM,
        feeMargin,
      },
      xDaiParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.XDAI),
        minter_addr: "0x90d38996B210D45bDF2FD54d091C6061dff0dA9F",
        erc721_addr: "0x0e02b55e1D0ec9023A04f1278F39685B53739010",
        erc1155Minter: "0x0AA29baB4F811A9f3dcf6a0F9cAEa9bE18ECED78",
        erc721Minter: "0x7cB14C4aB12741B5ab185C6eAFb5Eb7b5282A032",
        erc1155_addr: "0x1C6d7aa611B30C9C1e5f52068E145b77b0e661b2",
        nonce: Chain.XDAI,
        feeMargin,
      },
      algorandParams: {
        algodApiKey:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        indexerUri: "https://algoindexer.testnet.algoexplorerapi.io",
        algodUri: "https://node.testnet.algoexplorerapi.io",
        nonce: Chain.ALGORAND,
        sendNftAppId: 83148194,
        algodPort: 443,
        notifier,
        feeMargin,
      },
      auroraParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.AURORA),
        erc721_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        minter_addr: "0x3fe9EfFa80625B8167B2F0d8cF5697F61D77e4a2",
        erc1155Minter: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        erc1155_addr: "",
        erc721Minter: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
        nonce: Chain.AURORA,
        feeMargin,
      },
      uniqueParams: {
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.UNIQUE),
        nonce: Chain.UNIQUE,
        erc721_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        erc1155_addr: "",
        minter_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        erc1155Minter: "string",
        erc721Minter: "string",
        notifier,
        feeMargin,
      },
      tezosParams: {
        bridgeAddress: "KT1KbL9kWPM8GkMr5M38vF1eHdsNxTc4WkyQ",
        notifier,
        Tezos: new TezosToolkit(TestNetRpcUri.TEZOS),
        xpnftAddress: "KT1WR4fe9wFGPgNViK5feigMGyXKG9gCX8n4",
        validators: [
          "tz1iKCCYmhayfpp1HvVA8Fmp4PkY5Z7XnDdX",
          "tz1g4CJW1mzVLvN8ycHFg9JScpuzYrJhZcnD",
          "tz1exbY3JKPRpo2KLegK8iqoVNRLn1zFrnZi",
        ],
        feeMargin,
      },
      velasParams: {
        notifier,
        erc721_addr: "0xE657b66d683bF4295325c5E66F6bb0fb6D1F7551",
        erc1155_addr: "0x5D822bA2a0994434392A0f947C83310328CFB0DE",
        minter_addr: "0x5051679FEDf0D7F01Dc23e72674d0ED58de9be6a",
        erc1155Minter: "0x941972fa041F507eBb8CfD5d11C05Eb1a51f2E95",
        erc721Minter: "0x5df32A2F15D021DeF5086cF94fbCaC4594208A26",
        nonce: Chain.VELAS,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.VELAS),
        feeMargin,
      },
      iotexParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.IOTEX),
        minter_addr: "0xE657b66d683bF4295325c5E66F6bb0fb6D1F7551",
        erc721_addr: "0x5D822bA2a0994434392A0f947C83310328CFB0DE",
        erc1155_addr: "0x46Df0d0Dd629d61BDFA567dE61912FDeD883A60d",
        erc1155Minter: "0x5df32A2F15D021DeF5086cF94fbCaC4594208A26",
        erc721Minter: "0xC3dB3dBcf007961541BE1ddF15cD4ECc0Fc758d5",
        nonce: Chain.IOTEX,
        feeMargin,
      },
      hederaParams: {
        notifier,
        provider: hethers.getDefaultProvider("testnet") as any,
        feeMargin,
        nonce: Chain.HEDERA,
        erc721_addr: "0x0000000000000000000000000000000002e88e04",
        erc1155_addr: "0x0000000000000000000000000000000002e88e04",
        minter_addr: "0x0000000000000000000000000000000002e86d67",
        erc721Minter: "0x0000000000000000000000000000000002da3c1d",
        erc1155Minter: "0x0000000000000000000000000000000002da3c20",
      },
      skaleParams: {
        nonce: Chain.SKALE,
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.SKALE),
        feeMargin,
        erc1155_addr: "0x34c34E0808dC25c43cD41Cdba5049F7C370b7093",
        erc1155Minter: "0x19F5cb72DBEdBAd6622FcC4244E238F207d7Bcb6",
        erc721Minter: "0x79CcaA9FF641e848437C1855fd6c217Dc2204B09",
        erc721_addr: "0x753993a3220eB7EFb837c26b14F3EFffF271F886",
        minter_addr: "0xF50d791fb0427442287AA574bacADBf5C964f38c",
        paymentTokenAddress: "0x3F3894e65B9EcAAa1F099ECb82e9Cca3a0e86E9E",
      },
      godwokenParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.GODWOKEN),
        minter_addr: "0x3fe9EfFa80625B8167B2F0d8cF5697F61D77e4a2",
        erc721_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        erc1155_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        erc721Minter: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
        erc1155Minter: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        nonce: Chain.GODWOKEN,
        feeMargin,
      },
      gateChainParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(TestNetRpcUri.GATECHAIN),
        minter_addr: "0x2B24de7BFf5d2ab01b1C53682Ee5987c9BCf1BAc",
        erc721_addr: "0x3fe9EfFa80625B8167B2F0d8cF5697F61D77e4a2",
        erc1155_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
        erc721Minter: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        erc1155Minter: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        nonce: Chain.GATECHAIN,
        feeMargin,
      },
      secretParams: {
        notifier,
        rpcUrl: TestNetRpcUri.SECRET,
        bridge: {
          contractAddress: "secret1ecsxtsrct6h647lpztnnzc9e47ezh0uu673c8h",
          codeHash:
            "29a127369d1f4326fb684435fde702fa9619c812dfb5b3a1929529bab0e308e0",
        },
        xpnft: {
          contractAddress: "secret1x4afa2shvq4uwwtl0ld8qnjfm3jkmyvap3yn9g",
          codeHash:
            "090ab9b7968745369f8888302a16650164e2ffc2f44c393a7382f74e122a9a8e",
        },
        umt: {
          contractAddress: "secret146snljq0kjsva7qrx4am54nv3fhfaet7srx4n2",
          codeHash:
            "af076a49141264ec048270318f1358c9be193893c3f829425cab53ee5eb05e5c",
        },
        chainId: "24",
        feeMargin,
      },

      nearParams: {
        networkId: "testnet",
        nonce: Chain.NEAR,
        rpcUrl: TestNetRpcUri.NEAR,
        bridge: "xp_bridge_1.testnet",
        xpnft: "xp_nft_1.testnet",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        feeMargin,
        notifier,
      },
    };
  };

  export const Staging: () => Promise<Partial<ChainParams>> = async () => {
    const feeMargin: FeeMargins = { min: 1, max: 5 };
    const notifier = evNotifier("https://bridge1.xp.network/notifier");

    return {
      tonParams: {
        bridgeAddr: "kQD3Fic8toRl0SIMswto8wmy5H41CDZUGAIyIK95Al5BBUiX",
        burnerAddr: "kQBCnW4TO466p7YzKGZebnsylUSHTyxTKuwMDXo5JEQbIEOF",
        notifier,
        tonweb: new TonWeb(
          new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
            apiKey:
              "05645d6b549f33bf80cee8822bd63df720c6781bd00020646deb7b2b2cd53b73",
          })
        ),
        xpnftAddr: "EQCgk1I2zujGrXaNXnWZEtFD93tSKNjvRfqKV0xp7EswHgw9",
        feeMargin,
      },
      caduceusParams: {
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.CADUCEUS),
        erc1155_addr: "0x820c0b504fe85b43E3c43D2EA24cb764ad78d52e",
        erc721_addr: "0x086815f8154e3cdD89cD3aEc78377e3197a572d0",
        erc1155Minter: "0xe3266d5181FffE43A205ce5bE9437B9f717Bad84",
        erc721Minter: "0x8411EeadD374bDE549F61a166FFBeFca592bC60a",
        minter_addr: "0x28c43F505d210D6f8f78C58b450b76890dc76F21",
        nonce: Chain.CADUCEUS,
      },
      algorandParams: {
        algodApiKey:
          "e5b7d342b8a742be5e213540669b611bfd67465b754e7353eca8fd19b1efcffd",
        algodUri: "https://algorand-node.xp.network/",
        indexerUri: "https://algoindexer.algoexplorerapi.io",
        nonce: Chain.ALGORAND,
        sendNftAppId: 942656248,
        algodPort: 443,
        notifier,
        feeMargin,
      },
      elrondParams: {
        node_uri: MainNetRpcUri.ELROND,
        minter_address:
          "erd1qqqqqqqqqqqqqpgqacac9ux4uz0pjg8ck2sf0ugxre0feczzvcas2tsatn",
        esdt_swap_address:
          "erd1qqqqqqqqqqqqqpgqjlnfddgj2dl4kz3x4n55yhfv7v06mxhzvcas2ec5ps",
        esdt_nft: "XPNFT-976581",
        esdt_swap: "WEGLD-8c393e",
        notifier,
        nonce: Chain.ELROND,
        feeMargin,
      },
      harmonyParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.HARMONY),
        minter_addr: "0x77037e4f8aCb09f9bdedB9311bB6d9e74ed44371",
        erc721_addr: "0x23d399368EF31ca950E4Fd2063F2e4A5ACC0f9c2",
        erc1155_addr: "0xb3cE27eDadFE006f9f47C5ed5b62E63DFd9Cf3bD",
        erc1155Minter: "0x28c43F505d210D6f8f78C58b450b76890dc76F21",
        erc721Minter: "0x086815f8154e3cdD89cD3aEc78377e3197a572d0",
        nonce: Chain.HARMONY,
        feeMargin,
      },
      velasParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.VELAS),
        erc721Minter: "0x4d739e4953CE42f71604cbE142FD293841F9ed1c",
        erc1155Minter: "0xeEc7955F2F7AA4E36B582D8f022c9417ecB75a44",
        erc721_addr: "0x19678D8f9601AD0F099D401A3f82e4d6745B0e56",
        erc1155_addr: "0x4a153028F0b40C41432127E050015963D130b01A",
        minter_addr: "0xe535A8De7C42a8bc1633f16965fbc259a3Ef58B6",
        nonce: Chain.VELAS,
        feeMargin,
      },
      bscParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.BSC),
        erc721Minter: "0x83feaeA88b1377970E7cD11492d084B63e09C87E",
        erc1155_addr: "0x1B20ceec70e9635f5B56928de16A9dBc8EB8e3b6",
        erc1155Minter: "0x5Af6A4C6E261315C5B7811bEb9c620CfF4722793",
        erc721_addr: "0x9796B2F03e3afF786048cd67a1D33282476AB1d4",
        minter_addr: "0x7Eac6825A851d79ae24301eA497AD8db2a0F4976",
        nonce: Chain.BSC,
        feeMargin,
      },
      secretParams: {
        bridge: {
          contractAddress: "secret1t0g8tvc0tyvpwdsdc5zepa9j2ptr3vfte26qhu",
          codeHash:
            "684afe616d92b29c097c5f00365d07c005e99c90ff1227507a0284b601a2cc5e",
        },
        xpnft: {
          contractAddress: "secret1ggvqzks96k7hawhdx3harrtnffhttrrq2qxmdg",
          codeHash:
            "b7f44f7d2f72bfec52b027ee6b3ef802246735b50b2bfe747851876f818d7f45",
        },
        notifier,
        rpcUrl: MainNetRpcUri.SECRET,
        umt: {
          contractAddress: "",
          codeHash: "",
        },
        chainId: "24",
        feeMargin,
      },
      abeyChainParams: {
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.ABEYCHAIN),
        erc1155_addr: "0x8776073043eef8929F4a9cBa8Aacc6B59A21BA52",
        erc1155Minter: "0x5Ed657a379e06CBAc1Ba1a9cF6D28e71c66B0c83",
        erc721_addr: "0x3C8C51809Ee58E9D3BA37e37112843e41DcBD7B7",
        erc721Minter: "0xD580913Ef2c8CA4Ca90D4bE6851ACa004cf586D8",
        minter_addr: "0x14db0f56042Fa87F3b3921E871f87248f4C56A71",
        nonce: Chain.ABEYCHAIN,
      },
      moonbeamParams: {
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.MOONBEAM),
        erc1155_addr: "0x554560C6800f123B4A713F80A5AC9F21486F5De8",
        erc721_addr: "0x6f64e03fcc34b774b3b82825a91aABA336Fbf931",
        erc1155Minter: "0xA97FD39705583296221f39cb245fb573B28722A1",
        erc721Minter: "0x0e5C62beAD14795F3eA9969B139F5433DF85319e",
        minter_addr: "0xce50496C6616F4688d5775966E302A49e3876Dff",
        nonce: Chain.MOONBEAM,
      },
      polygonParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.POLYGON),
        erc721Minter: "0x32732607F67f9FC2007AF84e54B2ea9042327ed3",
        erc1155Minter: "0x62E26979F555Ec475981D8D1A7e269f747643f22",
        erc721_addr: "0x54024A9351B7aD68921914942f776489E71c467e",
        erc1155_addr: "0x8D3e050555356a2eD4ad8cfFb189994035F5803C",
        minter_addr: "0xF712f9De44425d8845A1d597a247Fe88F4A23b6f",
        nonce: Chain.POLYGON,
        feeMargin,
      },
      skaleParams: {
        notifier,
        feeMargin,
        nonce: Chain.SKALE,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.SKALE),
        erc721Minter: "0x0e02b55e1D0ec9023A04f1278F39685B53739010",
        erc1155Minter: "0x90d38996B210D45bDF2FD54d091C6061dff0dA9F",
        erc1155_addr: "0xE90105827d04522e52AdfA6BF695730E5706C0C2",
        erc721_addr: "0x46Df0d0Dd629d61BDFA567dE61912FDeD883A60d",
        minter_addr: "0x33DC209D33AddF60cf90Dd4B10f9a198A1A93f63",
        paymentTokenAddress: "0x59ab97Ee239e02112652587F9Ef86CB6F762983b", // Euphoria ETH (ETH) Token
      },
      aptosParams: {
        rpcUrl: MainNetRpcUri.APTOS,
        bridge:
          "0x813d070ca33bf08223e957257c25cb66072fa8960b0af4810c2e78990126ec37",
        xpnft: "XPNFT",
        notifier,
        feeMargin,
        nonce: Chain.APTOS,
        network: "staging",
      },
    };
  };

  export const MainNet: () => Promise<Partial<ChainParams>> = async () => {
    const feeMargin = { min: 1, max: 5 };
    const notifier = evNotifier(middleware_uri);

    // VeChain related:
    const net = new SimpleNet(MainNetRpcUri.VECHAIN);
    const driver = await Driver.connect(net);
    const provider = thor.ethers.modifyProvider(
      new ethers.providers.Web3Provider(
        new thor.ConnexProvider({ connex: new Framework(driver) })
      )
    );

    return {
      tonParams: {
        bridgeAddr: "kQAhH1me417YvScu9Rn8BXjsW_9HcalciG5LmCDT04HMJt6L",
        burnerAddr: "kQDuSGRY8g6TCLC4QhlhqgLr4G_nNXTGHoXy38Mwxx-r1aGY",
        notifier,
        tonweb: new TonWeb(
          new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
            apiKey:
              "05645d6b549f33bf80cee8822bd63df720c6781bd00020646deb7b2b2cd53b73",
          })
        ),
        xpnftAddr: "EQABqbZubs5e3QQF3lxVZMvdaxlaIdNQWq8W1rn8rvVvWHys",
        feeMargin,
      },
      elrondParams: {
        node_uri: MainNetRpcUri.ELROND,
        minter_address:
          "erd1qqqqqqqqqqqqqpgq3y98dyjdp72lwzvd35yt4f9ua2a3n70v0drsfycvu8",
        esdt_swap_address:
          "erd1qqqqqqqqqqqqqpgq5vuvac70kn36yk4rvf9scr6p8tlu23220drsfgszfy",
        esdt_nft: "XPNFT-cb7482",
        esdt_swap: "WEGLD-5f1f8d",
        notifier,
        nonce: Chain.ELROND,
        feeMargin,
      },
      caduceusParams: {
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.CADUCEUS),
        erc1155_addr: "0x52e7D07DE51F8163E0f29061EaAa7D3FEaf6b47E",
        erc721_addr: "0x3410b0e0b1aBAe452b3F031AdE8dab347f5Fb60b",
        erc1155Minter: "0xcEFC9182e9AB181b3FED4e89CdA55E0B9010aFe1",
        erc721Minter: "0x77037e4f8aCb09f9bdedB9311bB6d9e74ed44371",
        minter_addr: "0xd3f55Dd3da582E8E55AcE14e28352a95334E8feb",
        nonce: Chain.CADUCEUS,
      },
      dfinityParams: {
        agent: new HttpAgent({
          host: "https://ic0.app",
        }),
        bridgeContract: Principal.fromText("e3io4-qaaaa-aaaak-qasua-cai"),
        xpnftId: Principal.fromText("e4jii-5yaaa-aaaak-qasuq-cai"),
        umt: Principal.fromText("evkdu-lqaaa-aaaak-qasva-cai"),
        notifier,
        feeMargin,
      },
      vechainParams: {
        notifier,
        feeMargin,
        nonce: Chain.VECHAIN,
        provider,
        minter_addr: "0xE860cef926E5e76E0E88fdc762417a582F849C27",
        erc721_addr: "0xf0E778BD5C4c2F219A2A5699e3AfD2D82D50E271",
        erc1155_addr: "",
        erc721Minter: "0x6e2B43FeF2E750e1562AC572e60B6C484a027424",
        erc1155Minter: "0x4E3a506800b894f3d7B46475Ab693DD5a567bB5C",
      },
      tronParams: {
        provider: new TronWeb({ fullHost: MainNetRpcUri.TRON }),
        notifier,
        minter_addr: "TAncANF5aYbvgXDatmwTdvTa5N9PTrq95k",
        erc721_addr: "TVdp7szDHg3opRyuciQaJi93LLk7y83hrC",
        erc1155_addr: "",
        erc1155Minter: "TYoj1JVpJt1TAWBFj3GkaKLC2vrcFnjZ1G",
        erc721Minter: "TPSQTbFWaxiDZbGD7MoqR6N2aWDSWBUNfA",
        validators: [
          "TJuG3kvmGBDxGyUPBbvKePUjbopLurtqSo",
          "TN9bHXEWditocT4Au15mgm7JM56XBnRCvm",
          "TRHLhivxVogGhtxKn6sC8UF2Fr3WBdaT8N",
          "TJuG3kvmGBDxGyUPBbvKePUjbopLurtqSo",
          "TN9bHXEWditocT4Au15mgm7JM56XBnRCvm",
          "TRHLhivxVogGhtxKn6sC8UF2Fr3WBdaT8N",
          "TJuG3kvmGBDxGyUPBbvKePUjbopLurtqSo",
        ],
        nonce: Chain.TRON,
        feeMargin,
      },
      avalancheParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.AVALANCHE),
        erc721Minter: "0x9b2bACF4E69c81EF4EF42da84872aAC39ce7EC62",
        erc1155Minter: "0x73E8deFC951D228828da35Ff8152f25c1e5226fa",
        erc721_addr: "0x7bf2924985CAA6192D721B2B9e1109919aC6ff58",
        minter_addr: "0xC254a8D4eF5f825FD31561bDc69551ed2b8db134",
        erc1155_addr: "0x73E8deFC951D228828da35Ff8152f25c1e5226fa",
        nonce: Chain.AVALANCHE,
        feeMargin,
      },
      polygonParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.POLYGON),
        erc721Minter: "0x7E8493F59274651Cc0919feCf12E6A77153cdA72",
        erc1155Minter: "0x73E8deFC951D228828da35Ff8152f25c1e5226fa",
        erc721_addr: "0xC254a8D4eF5f825FD31561bDc69551ed2b8db134",
        erc1155_addr: "0x7bf2924985CAA6192D721B2B9e1109919aC6ff58",
        minter_addr: "0x14CAB7829B03D075c4ae1aCF4f9156235ce99405",
        nonce: Chain.POLYGON,
        feeMargin,
      },
      fantomParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.FANTOM),
        erc721Minter: "0xC81D46c6F2D59182c5A64FD5C372266c98985AdF",
        erc1155Minter: "0x146a99Ff19ece88EC87f5be03085cA6CD3163E15",
        erc1155_addr: "0x4bA4ADdc803B04b71412439712cB1911103380D6",
        erc721_addr: "0x75f93b47719Ab5270d27cF28a74eeA247d5DfeFF",
        minter_addr: "0x97dd1B3AE755539F56Db8b29258d7C925b20b84B",
        nonce: Chain.FANTOM,
        feeMargin,
      },
      bscParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.BSC),
        erc721Minter: "0xa66dA346C08dD77bfB7EE5E68C45010B6F2538ff",
        erc1155_addr: "0x3F888c0Ee72943a3Fb1c169684A9d1e8DEB9f537",
        erc1155Minter: "0xF5e0c79CB0B7e7CF6Ad2F9779B01fe74F958964a",
        erc721_addr: "0x0cC5F00e673B0bcd1F780602CeC6553aec1A57F0",
        minter_addr: "0x0B7ED039DFF2b91Eb4746830EaDAE6A0436fC4CB",
        nonce: Chain.BSC,
        feeMargin,
      },
      celoParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.CELO),
        minter_addr: "string",
        erc721_addr: "string",
        erc1155Minter: "string",
        erc721Minter: "string",
        erc1155_addr: "",
        nonce: Chain.CELO,
        feeMargin,
      },
      harmonyParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.HARMONY),
        minter_addr: "0x1358844f14feEf4D99Bc218C9577d1c7e0Cb2E89",
        erc721_addr: "0xDcAA2b071c1851D8Da43f85a34a5A57d4Fa93A1A",
        erc1155_addr: "0xFEeD85607C1fbc2f30EAc13281480ED6265e121E",
        erc1155Minter: "0xF547002799955812378137FA30C21039E69deF05",
        erc721Minter: "0x57d2Ad1a14C77627D5f82B7A0F244Cfe391e59C5",
        nonce: Chain.HARMONY,
        feeMargin,
      },
      ropstenParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.ETHEREUM),
        minter_addr: "0x1cC24128C04093d832D4b50609e182ed183E1688",
        erc721_addr: "0x32E8854DC2a5Fd7049DCF10ef2cb5f01300c7B47",
        erc1155_addr: "0x041AE550CB0e76a3d048cc2a4017BbCB74756b43",
        erc1155Minter: "0xca8E2a118d7674080d71762a783b0729AadadD42",
        erc721Minter: "0xF547002799955812378137FA30C21039E69deF05",
        nonce: Chain.ETHEREUM,
        feeMargin,
      },
      xDaiParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.XDAI),
        erc721Minter: "0x82A7d50A0030935808dAF6e5f0f06645866fb7Bb",
        erc1155Minter: "0xFEeD85607C1fbc2f30EAc13281480ED6265e121E",
        erc721_addr: "0x1358844f14feEf4D99Bc218C9577d1c7e0Cb2E89",
        erc1155_addr: "0xDcAA2b071c1851D8Da43f85a34a5A57d4Fa93A1A",
        minter_addr: "0x81e1Fdad0658b69914801aBaDA7Aa0Abb31653E5",
        nonce: Chain.XDAI,
        feeMargin,
      },
      algorandParams: {
        algodApiKey:
          "e5b7d342b8a742be5e213540669b611bfd67465b754e7353eca8fd19b1efcffd",
        algodUri: "https://algorand-node.xp.network/",
        indexerUri: "https://algoindexer.algoexplorerapi.io",
        nonce: Chain.ALGORAND,
        sendNftAppId: 769053604,
        algodPort: 443,
        notifier,
        feeMargin,
      },
      fuseParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.FUSE),
        erc721Minter: "0xC81D46c6F2D59182c5A64FD5C372266c98985AdF",
        erc1155Minter: "0x146a99Ff19ece88EC87f5be03085cA6CD3163E15",
        erc721_addr: "0x93239b1CF8CAd847f387735876EdBa7D75ae4f7A",
        erc1155_addr: "0x2496b44516c8639dA00E8D12ccE64862e3760190",
        minter_addr: "0xa66dA346C08dD77bfB7EE5E68C45010B6F2538ff",
        nonce: Chain.FUSE,
        feeMargin,
      },
      tezosParams: {
        bridgeAddress: "KT1WKtpe58XPCqNQmPmVUq6CZkPYRms5oLvu",
        notifier,
        Tezos: new TezosToolkit(MainNetRpcUri.TEZOS),
        xpnftAddress: "KT1NEx6MX2GUEKMTX9ydyu8mn9WBNEz3QPEp",
        validators: [
          "tz1MwAQrsg5EgeFD1AQHT2FTutnj9yQJNcjM",
          "tz1b5AMdXs9nDxsqoN9wa3HTusvhahgBRWuF",
          "tz1L5DjmMEHbj5npRzZewSARLmTQQyESW4Mj",
          "tz1csq1THV9rKQQexo2XfSjSEJEg2wRCSHsD",
          "tz1TBhd1NeZNtWsTbecee8jDMDzeBNLmpViN",
          "tz1SHcDnXRgb7kWidiaM2J6bbTS7x5jzBr67",
        ],
        feeMargin,
      },
      velasParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.VELAS),
        erc721Minter: "0x3F888c0Ee72943a3Fb1c169684A9d1e8DEB9f537",
        erc1155Minter: "0x0cC5F00e673B0bcd1F780602CeC6553aec1A57F0",
        erc721_addr: "0x9e5761f7A1360E8B3E9d30Ed9dd3161E8b75d4E8",
        erc1155_addr: "0x0B7ED039DFF2b91Eb4746830EaDAE6A0436fC4CB",
        minter_addr: "0x40d8160A0Df3D9aad75b9208070CFFa9387bc051",
        nonce: Chain.VELAS,
        feeMargin,
      },
      iotexParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.IOTEX),
        minter_addr: "0x4bA4ADdc803B04b71412439712cB1911103380D6",
        erc721_addr: "0x6eD7dfDf9678eCb2051c46A1A5E38B4f310b18c5",
        erc721Minter: "0xD87755CCeaab0edb28b3f0CD7D6405E1bB827B65",
        erc1155Minter: "0x81e1Fdad0658b69914801aBaDA7Aa0Abb31653E5",
        erc1155_addr: "0x93Ff4d90a548143c28876736Aa9Da2Bb7B1b52D4",
        nonce: Chain.IOTEX,
        feeMargin,
      },
      auroraParams: {
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.AURORA),
        minter_addr: "0x32E8854DC2a5Fd7049DCF10ef2cb5f01300c7B47",
        erc721_addr: "0x041AE550CB0e76a3d048cc2a4017BbCB74756b43",
        erc1155_addr: "0xca8E2a118d7674080d71762a783b0729AadadD42",
        erc1155Minter: "0x0000000000000000000000000000000000000000",
        erc721Minter: "0x0000000000000000000000000000000000000000",
        nonce: Chain.AURORA,
        notifier,
        feeMargin,
      },
      godwokenParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.GODWOKEN),
        minter_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
        erc721_addr: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
        erc1155_addr: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
        erc721Minter: "0x0000000000000000000000000000000000000000",
        erc1155Minter: "0x0000000000000000000000000000000000000000",
        nonce: Chain.GODWOKEN,
        feeMargin,
      },
      gateChainParams: {
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.GATECHAIN),
        minter_addr: "0xFc7f7fD2DBdAF6D8F3ee3f222b3a6a9f89729f05",
        erc721_addr: "0xD6939f722B977afd7DD934A31bc94d08d4ea4336",
        erc1155_addr: "",
        erc1155Minter: "0xc45759e51CdDBa46db4D1becC8B8Bcbe5d4a9bB4",
        erc721Minter: "0x0000000000000000000000000000000000000000",
        nonce: Chain.GATECHAIN,
        feeMargin,
      },
      skaleParams: {
        nonce: Chain.SKALE,
        notifier,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.SKALE),
        feeMargin,
        erc1155_addr: "0x48B218C9f626F079b82f572E3c5B46251c40fc47",
        erc1155Minter: "0xaB9eD7b9734471249255B4d969B32995015116d9",
        erc721Minter: "0x0F00f81162ABC95Ee6741a802A1218C67C42e714",
        erc721_addr: "0x57d2Ad1a14C77627D5f82B7A0F244Cfe391e59C5",
        minter_addr: "0xbED4a5b36fae07943589a0b34CC2Ec3a1c208E53",
        paymentTokenAddress: "0x0000000000000000000000000000000000000000",
      },
      moonbeamParams: {
        nonce: Chain.MOONBEAM,
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.MOONBEAM),
        erc721Minter: "",
        erc1155Minter: "",
        erc1155_addr: "0xe535A8De7C42a8bc1633f16965fbc259a3Ef58B6",
        erc721_addr: "0xfD3Ce0a10D4731b136a7C9e3f8a37edA1EFbf77f",
        minter_addr: "0xBA3Cc81cfc54a4ce99638b5da1F17b15476E7231",
      },
      abeyChainParams: {
        nonce: Chain.ABEYCHAIN,
        notifier,
        feeMargin,
        provider: new ethers.providers.JsonRpcProvider(MainNetRpcUri.ABEYCHAIN),
        erc721Minter: "0xBb5e9896cEe600DaC470775B6f235Db105E861BD",
        erc1155Minter: "0x35c3c3959d19A310Fc052545fCC29200dc440CdA",
        erc1155_addr: "0xF9DfD29ddEDEa3224f9c7E12c7Bbe37101341786",
        erc721_addr: "0x55B1D1891ABb21A5d245d149B49007b55Bd3746D",
        minter_addr: "0x4ceDb46481d7118E1D292C318E37510E5919bBe6",
      },
      secretParams: {
        notifier,
        rpcUrl: MainNetRpcUri.SECRET,
        bridge: {
          contractAddress: "secret18f66qjjuyudmh7q6s50hwpt9y679lanjs82jkg",
          codeHash:
            "224f175c92947bbfd656d26e21b5eee40f73eac6aa6b64c328db3c55261ee6b4",
        },
        xpnft: {
          contractAddress: "secret16zcej6asqrtfq08u3fdjhs03zpl7lgy7q32eps",
          codeHash:
            "b7f44f7d2f72bfec52b027ee6b3ef802246735b50b2bfe747851876f818d7f45",
        },
        umt: {
          contractAddress: "",
          codeHash: "",
        },
        chainId: "24",
        feeMargin,
      },
      nearParams: {
        networkId: "mainnet",
        nonce: Chain.NEAR,
        rpcUrl: MainNetRpcUri.NEAR,
        bridge: "",
        xpnft: "",
        feeMargin,
        notifier,
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
      },
    };
  };
}