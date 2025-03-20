import { eEthereumNetwork, eMonadNetwork, IAaveConfiguration,
  TransferStrategy,
  AssetType, } from "./../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
  strategyDAI,
  strategyUSDC,
  strategyWBTC,
  strategyWMON,
  strategyUSDT,
  strategyWETH,
} from "./reservesConfigs";
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
import { AaveMarket } from "../aave/index";

export const MonadConfig: IAaveConfiguration = {
  ...AaveMarket,
  MarketId: "Modus Market",
  WrappedNativeTokenSymbol: "WMON",
  ATokenNamePrefix: "Modus",
  StableDebtTokenNamePrefix: "Modus",
  VariableDebtTokenNamePrefix: "Modus",
  SymbolPrefix: "Modus",
  ReserveFactorTreasuryAddress: {},
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WMON: strategyWMON,
    USDT: strategyUSDT,
    WETH: strategyWETH,
  },
  ChainlinkAggregator: {
    [eMonadNetwork.monad]: {
      USDC: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
    },
  },
  ReserveAssets: {
    [eMonadNetwork.monad]: {
      DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      WBTC: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      WMON: "0x1516000000000000000000000000000000000000",
      USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    [eMonadNetwork.monadTestnet]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WMON: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
  },
  EModes: {},
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  IncentivesConfig: {
    enabled: {
      [eEthereumNetwork.hardhat]: true,
      [eMonadNetwork.monadTestnet]: true,
    },
    rewards: {
      [eEthereumNetwork.hardhat]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eMonadNetwork.monadTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
      }
    },
    rewardsOracle: {
    },
    incentivesInput: {
    },
  },
};

export default MonadConfig;
