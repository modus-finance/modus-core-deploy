import {
  DETERMINISTIC_DEPLOYMENT,
  DETERMINISTIC_FACTORIES,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
} from "./helpers/hardhat-config-helpers";
import {
  eArbitrumNetwork,
  eAvalancheNetwork,
  eEthereumNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  eBaseNetwork,
  eMonadNetwork,
} from "./helpers/types";
import { DEFAULT_NAMED_ACCOUNTS } from "./helpers/constants";

import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-dependency-compiler";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const TASK_FOLDERS = ["misc", "market-registry"];

// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
  loadTasks(TASK_FOLDERS);
}

export default {
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
          evmVersion: "berlin",
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  networks: {
    hardhat: hardhatNetworkSettings,
    localhost: {
      url: "http://127.0.0.1:8545",
      ...hardhatNetworkSettings,
    },
    tenderly: getCommonNetworkConfig("tenderly", 1),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    rinkeby: getCommonNetworkConfig(eEthereumNetwork.rinkeby, 4),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),
    [ePolygonNetwork.polygon]: getCommonNetworkConfig(
      ePolygonNetwork.polygon,
      137
    ),
    [ePolygonNetwork.mumbai]: getCommonNetworkConfig(
      ePolygonNetwork.mumbai,
      80001
    ),
    arbitrum: getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
    [eArbitrumNetwork.arbitrumTestnet]: getCommonNetworkConfig(
      eArbitrumNetwork.arbitrumTestnet,
      421614
    ),
    [eHarmonyNetwork.main]: getCommonNetworkConfig(
      eHarmonyNetwork.main,
      1666600000
    ),
    [eHarmonyNetwork.testnet]: getCommonNetworkConfig(
      eHarmonyNetwork.testnet,
      1666700000
    ),
    [eAvalancheNetwork.avalanche]: getCommonNetworkConfig(
      eAvalancheNetwork.avalanche,
      43114
    ),
    [eAvalancheNetwork.fuji]: getCommonNetworkConfig(
      eAvalancheNetwork.fuji,
      43113
    ),
    [eFantomNetwork.main]: getCommonNetworkConfig(eFantomNetwork.main, 250),
    [eFantomNetwork.testnet]: getCommonNetworkConfig(
      eFantomNetwork.testnet,
      4002
    ),
    [eOptimismNetwork.testnet]: getCommonNetworkConfig(
      eOptimismNetwork.testnet,
      420
    ),
    [eOptimismNetwork.main]: getCommonNetworkConfig(eOptimismNetwork.main, 10),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(
      eEthereumNetwork.goerli,
      5
    ),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(
      eEthereumNetwork.sepolia,
      11155111
    ),
    [eArbitrumNetwork.goerliNitro]: getCommonNetworkConfig(
      eArbitrumNetwork.goerliNitro,
      421613
    ),
    [eBaseNetwork.base]: getCommonNetworkConfig(eBaseNetwork.base, 8453),
    [eBaseNetwork.baseGoerli]: getCommonNetworkConfig(
      eBaseNetwork.baseGoerli,
      84531
    ),
    [eMonadNetwork.monad]: getCommonNetworkConfig(eMonadNetwork.monad, 143),
    [eMonadNetwork.monadTestnet]: getCommonNetworkConfig(eMonadNetwork.monadTestnet, 10143),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  dependencyCompiler: {
    paths: [
      "@modus-finance/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol",
      "@modus-finance/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol",
      "@modus-finance/core-v3/contracts/misc/AaveOracle.sol",
      "@modus-finance/core-v3/contracts/protocol/tokenization/AToken.sol",
      "@modus-finance/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol",
      "@modus-finance/core-v3/contracts/protocol/tokenization/StableDebtToken.sol",
      "@modus-finance/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/logic/CalldataLogic.sol",
      "@modus-finance/core-v3/contracts/protocol/pool/Pool.sol",
      "@modus-finance/core-v3/contracts/protocol/pool/L2Pool.sol",
      "@modus-finance/core-v3/contracts/protocol/pool/PoolConfigurator.sol",
      "@modus-finance/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol",
      "@modus-finance/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol",
      "@modus-finance/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol",
      "@modus-finance/core-v3/contracts/deployments/ReservesSetupHelper.sol",
      "@modus-finance/core-v3/contracts/misc/AaveProtocolDataProvider.sol",
      "@modus-finance/core-v3/contracts/misc/L2Encoder.sol",
      "@modus-finance/core-v3/contracts/protocol/configuration/ACLManager.sol",
      "@modus-finance/core-v3/contracts/dependencies/weth/WETH9.sol",
      "@modus-finance/core-v3/contracts/mocks/helpers/MockIncentivesController.sol",
      "@modus-finance/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol",
      "@modus-finance/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol",
      "@modus-finance/core-v3/contracts/mocks/tokens/MintableERC20.sol",
      "@modus-finance/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol",
      "@modus-finance/core-v3/contracts/mocks/tokens/WETH9Mocked.sol",
      "@modus-finance/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol",
      "@modus-finance/core-v3/contracts/mocks/upgradeability/MockAToken.sol",
      "@modus-finance/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol",
      "@modus-finance/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol",
      "@modus-finance/core-v3/contracts/mocks/helpers/MockPool.sol",
      "@modus-finance/core-v3/contracts/mocks/helpers/MockL2Pool.sol",
      "@modus-finance/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol",
      "@modus-finance/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol",
      "@modus-finance/core-v3/contracts/mocks/oracle/PriceOracle.sol",
      "@modus-finance/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol",
      "@modus-finance/periphery-v3/contracts/misc/UiPoolDataProviderV3.sol",
      "@modus-finance/periphery-v3/contracts/misc/WalletBalanceProvider.sol",
      "@modus-finance/periphery-v3/contracts/misc/WrappedTokenGatewayV3.sol",
      "@modus-finance/periphery-v3/contracts/misc/interfaces/IWETH.sol",
      "@modus-finance/periphery-v3/contracts/misc/UiIncentiveDataProviderV3.sol",
      "@modus-finance/periphery-v3/contracts/rewards/RewardsController.sol",
      "@modus-finance/periphery-v3/contracts/rewards/transfer-strategies/StakedTokenTransferStrategy.sol",
      "@modus-finance/periphery-v3/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol",
      "@modus-finance/periphery-v3/contracts/rewards/EmissionManager.sol",
      "@modus-finance/periphery-v3/contracts/mocks/WETH9Mock.sol",
      "@modus-finance/periphery-v3/contracts/mocks/testnet-helpers/Faucet.sol",
      "@modus-finance/periphery-v3/contracts/mocks/testnet-helpers/TestnetERC20.sol",
      "@modus-finance/periphery-v3/contracts/treasury/Collector.sol",
      "@modus-finance/periphery-v3/contracts/treasury/CollectorController.sol",
      "@modus-finance/periphery-v3/contracts/treasury/AaveEcosystemReserveV2.sol",
      "@modus-finance/periphery-v3/contracts/treasury/AaveEcosystemReserveController.sol",
      "@modus-finance/periphery-v3/contracts/adapters/paraswap/ParaSwapLiquiditySwapAdapter.sol",
      "@modus-finance/periphery-v3/contracts/adapters/paraswap/ParaSwapRepayAdapter.sol",
      "@modus-finance/periphery-v3/contracts/adapters/paraswap/ParaSwapWithdrawSwapAdapter.sol",
      "@aave/safety-module/contracts/stake/StakedAave.sol",
      "@aave/safety-module/contracts/stake/StakedAaveV2.sol",
      "@aave/safety-module/contracts/proposals/extend-stkaave-distribution/StakedTokenV2Rev3.sol",
    ],
  },
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT
    ? DETERMINISTIC_FACTORIES
    : undefined,
  etherscan: {
    apiKey: {
      'monadtest': "262YNH3WUGJMF71N4CCFXD9WMYX9RK5P9G"
    },
    customChains: [
      {
        network: eBaseNetwork.base,
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
      {
        network: "monadtest", 
        chainId: 10143,
        urls: {
          apiURL: "https://testnet.monadexplorer.com/api/",
          browserURL: "https://testnet.monadexplorer.com/"
        }
      },
    ],
  },
};
