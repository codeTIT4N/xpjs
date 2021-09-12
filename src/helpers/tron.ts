import { BigNumber } from "bignumber.js";
import {
  BalanceCheck,
  BatchWrappedBalanceCheck,
  DecodeRawNft,
  DecodeWrappedNft,
  MintNft,
  TransferForeign,
  TransferNftForeign,
  UnfreezeForeign,
  UnfreezeForeignNft,
  WrappedBalanceCheck,
  WrappedNft,
} from "./chain";
import { abi as ERC1155_abi } from "../fakeERC1155.json";

// @ts-ignore
import { TronWeb } from "tronweb";
import { EthNftInfo, MintArgs } from "./web3";

import { BigNumber as EthBN } from "@ethersproject/bignumber/lib/bignumber";
import { Interface } from "ethers/lib/utils";
import { abi as ERC721_abi } from "../fakeERC721.json";
import { Base64 } from "js-base64";
import { NftEthNative, NftPacked } from "validator/dist/encoding";
import * as ERC1155_contract from "../XPNet.json";

export type BaseTronHelper = BalanceCheck<string, BigNumber> &
  MintNft<string, MintArgs, void> & {
    /**
     *
     * Deploy an ERC1155 smart contract
     *
     * @argument owner  Owner of this smart contract
     * @returns Address of the deployed smart contract
     */
    deployErc1155(owner: string): Promise<string>;
  };

export type TronHelper = BaseTronHelper &
  WrappedBalanceCheck<string, BigNumber> &
  BatchWrappedBalanceCheck<string, BigNumber> &
  TransferForeign<string, string, string, string, string> &
  TransferNftForeign<string, string, EthNftInfo, string, string> &
  UnfreezeForeign<string, string, string, string, string> &
  UnfreezeForeignNft<string, string, BigNumber, string, string> &
  DecodeWrappedNft<string> &
  DecodeRawNft & {
    nftUri(info: EthNftInfo): Promise<string>;
  };

export async function baseTronHelperFactory(
  provider: TronWeb
): Promise<BaseTronHelper> {
  const setSigner = (signer: string) => {
    return provider.setPrivateKey(signer);
  };

  return {
    async mintNft(owner: string, options: MintArgs): Promise<void> {
      setSigner(owner);
      const erc = await provider.contract(ERC1155_abi, options.contract);
      await erc.mint(owner, EthBN.from(options.token.toString()), 1).send();
      await erc.setURI(options.token, options.uri).send();
    },
    async balance(address: string): Promise<BigNumber> {
      const balance = await provider.trx.getBalance(address);
      return new BigNumber(balance);
    },
    async deployErc1155(owner: string): Promise<string> {
      setSigner(owner);

      const contract = await provider.contract().new({
        abi: ERC1155_abi,
        bytecode: ERC1155_contract.bytecode,
      });

      return contract.address;
    },
  };
}

export async function tronHelperFactory(
  provider: TronWeb,
  erc1155_addr: string,
  minter_addr: string,
  minter_abi: Interface
): Promise<TronHelper> {
  const base = await baseTronHelperFactory(provider);
  const erc1155 = await provider.contract(ERC1155_abi, erc1155_addr);
  const minter = await provider.contract(minter_abi, minter_addr);

  const setSigner = (signer: string) => {
    return provider.setPrivateKey(signer);
  };

  async function extractTxn(hash: string): Promise<[string, string]> {
    const evs = await provider.getEventByTransactionID(hash);
    const ev = evs.find((e: any) => e?.contract_address == minter_addr);
    const action_id: string = ev.result["action_id"].toString();
    return [hash, action_id];
  }

  const nftUri = async (info: EthNftInfo): Promise<string> => {
    if (info.contract_type == "ERC721") {
      const erc = await provider.contract(ERC721_abi, info.contract);
      return await erc.tokenURI(info.token).call();
    } else {
      const erc = await provider.contract(ERC1155_abi, info.contract);
      return await erc.uri(info.token).call();
    }
  };

  function contractTypeFromNftKind(kind: 0 | 1): "ERC721" | "ERC1155" {
    return kind === NftEthNative.NftKind.ERC721 ? "ERC721" : "ERC1155";
  }

  return {
    ...base,
    async decodeUrlFromRaw(data: Uint8Array): Promise<string> {
      const packed = NftEthNative.deserializeBinary(data);
      const nft_info = {
        contract_type: contractTypeFromNftKind(packed.getNftKind()),
        contract: packed.getContractAddr(),
        token: EthBN.from(packed.getId()),
      };

      return await nftUri(nft_info);
    },
    decodeWrappedNft(raw_data: string): WrappedNft {
      const u8D = Base64.toUint8Array(raw_data);
      const packed = NftPacked.deserializeBinary(u8D);
      return {
        chain_nonce: packed.getChainNonce(),
        data: packed.getData_asU8(),
      };
    },
    nftUri: nftUri,
    async transferNativeToForeign(
      sender: string,
      chain_nonce: number,
      to: string,
      value: string
    ): Promise<[string, string]> {
      setSigner(sender);
      let res = await minter.freeze(chain_nonce, to).send({ callValue: value });
      return await extractTxn(res.txID);
    },
    async unfreezeWrapped(
      sender: string,
      chain_nonce: number,
      to: string,
      value: string
    ): Promise<[string, string]> {
      setSigner(sender);
      const res = await minter.withdraw(chain_nonce, to, value).send();
      return await extractTxn(res.txID);
    },
    async unfreezeWrappedNft(
      sender: string,
      to: string,
      id: BigNumber
    ): Promise<[string, string]> {
      setSigner(sender);
      const res = await minter.withdraw_nft(to, id).send();
      return await extractTxn(res.txID);
    },
    async transferNftToForeign(
      sender: string,
      chain_nonce: number,
      to: string,
      id: EthNftInfo
    ): Promise<[string, string]> {
      let txr;
      let ev;
      const call_data = Buffer.concat([
        Buffer.from(new Int32Array([0]).buffer), // 4 bytes padding
        Buffer.from(new Int32Array([chain_nonce]).buffer).reverse(), // BE, gotta reverse
        Buffer.from(to, "utf-8"),
      ]);
      setSigner(sender);
      if (id.contract_type == "ERC721") {
        ev = "TransferErc721";
        const erc = await provider.contract(ERC721_abi, id.contract);
        await erc
          .safeTransferFrom(sender, minter_addr, id.token, call_data)
          .send();
      } else {
        ev = "TransferErc1155";
        const erc = await provider.contract(ERC1155_abi, id.contract);
        txr = await erc
          .safeTransferFrom(
            sender,
            minter_addr,
            id.token,
            EthBN.from(1),
            call_data
          )
          .send();
      }
      ev.toString();
      return await extractTxn(txr.txID);
    },
    async balanceWrappedBatch(
      address: string,
      chain_nonces: number[]
    ): Promise<Map<number, BigNumber>> {
      const res = new Map<number, BigNumber>();
      const balance = await erc1155
        .balanceOfBatch(Array(chain_nonces.length).fill(address), chain_nonces)
        .call();
      balance.map((e: any, i: any) => {
        res.set(chain_nonces[i], new BigNumber(e.toString()));
      });
      return res;
    },
    async balanceWrapped(
      address: string,
      chain_nonce: number
    ): Promise<BigNumber> {
      const bal = await erc1155.balanceOf(address, chain_nonce).call();
      return new BigNumber(bal.toString());
    },
  };
}
