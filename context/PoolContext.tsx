import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Initialiser from 'context/Initialiser';

import BN from 'bignumber.js';
import {
	getPoolStats,
	getBoostV2Apy,
	getBoostPoolV2PriceInUSD,
	getBalancerAPY,
	getBalancerPoolPriceInUSD,
} from 'utils/pool';
import { usePriceFeedContext } from './PriceFeedContext';
import { ALL_POOLS, IPool } from 'constants/pools';

interface IPoolContext {
	closedPools: IPool[];
	openPools: IPool[];
}

export const PoolContext = createContext<IPoolContext>({
	closedPools: [],
	openPools: [],
});

export const PoolProvider: React.FC = ({ children }) => {
	const { coinGecko } = usePriceFeedContext();
	const [closedPools, setClosedPools] = useState<IPool[]>([]);
	const [openPools, setOpenPools] = useState<IPool[]>([]);
	const { provider, walletAddress } = Initialiser.useContainer();

	const getStats = useCallback(async () => {
		const CLOSED_POOLS = ALL_POOLS.filter((e) => !e.open);
		const OPEN_POOLS = ALL_POOLS.filter((e) => e.open);

		const promisedClosedPoolsArr = CLOSED_POOLS.map(async (pool) => {
			return {
				name: pool.name,
				icon: pool.icon,
				code: pool.code,
				order: pool.order,
				address: pool.address,
				tokenContract: pool.tokenContract,
				tokenTicker: pool.tokenTicker,
				poolSize: null,
				poolPriceInUSD: null,
				periodFinish: null,
				boosterPrice: null,
				apy: null,
				open: pool.open,
				claimable: pool.claimable,
			};
		});

		const promisedOpenPoolsArr = OPEN_POOLS.map(async (pool) => {
			const poolStats = await getPoolStats(provider, pool.address, false, walletAddress);
			let apy;
			let poolPriceInUSD;
			if (pool.code === 'eth_boost_v2_pool') {
				apy = await getBoostV2Apy(provider, coinGecko);
				poolPriceInUSD = await getBoostPoolV2PriceInUSD(provider, coinGecko);
			} else {
				apy = await getBalancerAPY(
					provider,
					coinGecko,
					pool.address,
					pool.tokenContract,
					pool.underlyingToken
				);
				poolPriceInUSD = await getBalancerPoolPriceInUSD(
					provider,
					coinGecko,
					pool.address,
					pool.tokenContract,
					pool.underlyingToken
				);
			}
			return {
				name: pool.name,
				icon: pool.icon,
				code: pool.code,
				order: pool.order,
				address: pool.address,
				tokenContract: pool.tokenContract,
				tokenTicker: pool.tokenTicker,
				poolSize: poolStats?.poolSize ? new BN(poolStats?.poolSize) : null,
				poolPriceInUSD: poolPriceInUSD ? poolPriceInUSD : null,
				periodFinish: poolStats?.periodFinish ? new BN(poolStats.periodFinish) : null,
				boosterPrice: poolStats?.boosterPrice ? new BN(poolStats.boosterPrice) : null,
				apy: apy,
				open: pool.open,
				url: pool.url,
			};
		});

		const resolvedClosedPool = await Promise.all(promisedClosedPoolsArr);
		const resolvedOpenPool = await Promise.all(promisedOpenPoolsArr);
		setClosedPools(resolvedClosedPool);
		setOpenPools(resolvedOpenPool);
	}, [provider, coinGecko, walletAddress]);

	useEffect(() => {
		getStats();
		const refreshInterval = setInterval(getStats, 10000);
		return () => clearInterval(refreshInterval);
	}, [getStats]);
	return (
		<PoolContext.Provider
			value={{
				closedPools,
				openPools,
			}}
		>
			{children}
		</PoolContext.Provider>
	);
};

export const usePoolContext = () => useContext(PoolContext) as IPoolContext;
