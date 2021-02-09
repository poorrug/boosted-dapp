import React, { useEffect, useState } from 'react';
import {
	Flex,
	Stack,
	Button,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Text,
	Spinner,
} from '@chakra-ui/react';
import { ProposalRow } from 'components/gov/ProposalRow';
import { useProposals } from 'hooks/gov/useProposals';
import { useModal } from 'context/ModalContext';
import { ProposalFormModal } from 'components/gov/ProposalFormModal';
import Initialiser from 'context/Initialiser';

import { StakeModal } from './StakeModal';
import { UnstakeModal } from './UnstakeModal';

export const Vote: React.FC = () => {
	const proposals = useProposals();
	const [onPresentProposalForm] = useModal(<ProposalFormModal />);
	const [onPresentStakeModal] = useModal(<StakeModal />);
	const [onPresentUnstakeModal] = useModal(<UnstakeModal />);
	const { walletAddress } = Initialiser.useContainer();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (proposals && walletAddress) {
			setLoading(false);
		}
	}, [proposals, walletAddress]);

	return (
		<Flex justifyContent="space-between" width="100%">
			<Stack spacing="1.5rem" mr="4" mt="4" flex={1} width="100%">
				{walletAddress && (
					<Stack direction={['column', 'column', 'row']} spacing={4}>
						<Button onClick={() => onPresentProposalForm()} size="sm" w={125}>
							+ PROPOSE
						</Button>
						<Button onClick={() => onPresentStakeModal()} size="sm" w={125}>
							STAKE
						</Button>
						<Button onClick={() => onPresentUnstakeModal()} size="sm" w={125}>
							WITHDRAW
						</Button>
					</Stack>
				)}
				<Tabs variant="enclosed">
					<TabList mb="1em">
						<Tab>Core</Tab>
						<Tab>Community</Tab>
					</TabList>
					<TabPanels>
						<TabPanel w="100%">
							{!walletAddress ? (
								<Flex justifyContent="center" alignItems="center" pt={4}>
									<Text fontSize="sm">Please unlock your wallet</Text>
								</Flex>
							) : loading ? (
								<Flex justifyContent="center" alignItems="center" pt={4}>
									<Spinner color="grey.500" />
								</Flex>
							) : (
								proposals &&
								proposals.map((e, i) => {
									if (i === 0 || i === 11 || i === 12) {
										return <ProposalRow key={i} pid={i} proposal={e} />;
									} else {
										return;
									}
								})
							)}
						</TabPanel>
						<TabPanel w="100%">
							{proposals &&
								proposals.map((e, i) => {
									if (i > 0) {
										return <ProposalRow key={i} pid={i} proposal={e} />;
									} else {
										return;
									}
								})}
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Stack>
		</Flex>
	);
};
