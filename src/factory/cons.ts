import {
  BatchExchangeRateRepo,
  cachedExchangeRateRepo,
  ExchangeRateRepo,
  networkBatchExchangeRateRepo,
  NetworkModel,
} from "crypto-exchange-rate";

import { NftInfo, FullChain } from "..";

import { CHAIN_INFO, ChainType, Chain } from "../consts";

export const _headers = {
  "Content-Type": "application/json",
  Accept: "*/*",
};

export function exchangeRateRepo(
  baseUrl: string
): ExchangeRateRepo & BatchExchangeRateRepo {
  const baseService = NetworkModel.batchExchangeRateService(baseUrl);

  return cachedExchangeRateRepo(
    networkBatchExchangeRateRepo(
      baseService,
      NetworkModel.exchangeRateDtoMapper()
    )
  );
}

export function checkBlockedContracts(to: any, contract: string) {
  const chain = CHAIN_INFO.get(to);
  if (chain?.rejectUnfreeze && chain?.rejectUnfreeze.includes(contract)) {
    throw new Error(
      `Transfering to ${chain.name} is prohibited by the NFT project team`
    );
  }
}

export function getDefaultContract<SignerT, RawNftF, Resp, RawNftT>(
  nft: NftInfo<RawNftF>,
  fromChain: FullChain<SignerT, RawNftT, Resp>,
  toChain: FullChain<SignerT, RawNftT, Resp>
): string | undefined {
  const defaultMintError = new Error(
    `Transfer has been canceled. The NFT you are trying to send will be minted with a default NFT collection`
  );

  const from = fromChain.getNonce();
  const to = toChain.getNonce();

  const fromType = CHAIN_INFO.get(from)?.type;
  const toType = CHAIN_INFO.get(to)?.type;

  const contract =
    //@ts-ignore contractType is checked
    "contractType" in nft.native &&
    //@ts-ignore contractType is checked
    nft.native.contractType === "ERC1155" &&
    toChain.XpNft1155
      ? toChain.XpNft1155
      : toChain.XpNft;

  if (
    typeof window !== "undefined" &&
    (/(allowDefaultMint=true)/.test(window.location.search) ||
      /testnet/.test(window.location.pathname))
  ) {
    return contract;
  }

  if (
    (from === Chain.VECHAIN && toType === ChainType.EVM) ||
    (to === Chain.VECHAIN && fromType === ChainType.EVM)
  ) {
    throw defaultMintError;
  }

  if (
    (fromType === ChainType.EVM && toType === ChainType.ELROND) ||
    (fromType === ChainType.ELROND && toType === ChainType.EVM)
  ) {
    throw defaultMintError;
  }

  if (
    (fromType === ChainType.EVM && toType === ChainType.TEZOS) ||
    (fromType === ChainType.TEZOS && toType === ChainType.EVM)
  ) {
    throw defaultMintError;
  }

  if (from === Chain.SECRET) {
    throw defaultMintError;
  }

  if (fromType === ChainType.TRON) {
    throw defaultMintError;
  }

  return contract;
}

export function prepareTokenId(nft: NftInfo<any>, from: number) {
  const tokenId =
    //@ts-ignore
    nft.native && "tokenId" in nft.native && nft.native.tokenId.toString();

  if (tokenId) {
    const notNumber = isNaN(Number(tokenId));

    if (notNumber) {
      if (from === Chain.ELROND) {
        if (nft.native.nonce) return String(nft.native.nonce);
        const hex = tokenId.split("-")?.at(2);
        return String(hex ? parseInt(hex, 16) : "");
      }

      if (from === Chain.TON || from === Chain.SECRET) {
        return "1";
      }
    } else {
      return tokenId;
    }
  }
  return undefined;
}
