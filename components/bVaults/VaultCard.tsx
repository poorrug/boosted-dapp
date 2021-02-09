import {
	Box,
	Badge,
	Image,
	Button,
	Text,
	Flex,
	Icon,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { FaInfo } from 'react-icons/fa';

interface VaultCardProps {
	vault: any;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
	return (
		<Box maxW="xs" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image src={vault.imageUrl} alt={vault.imageAlt} objectFit="fill" w="100%" height={200} />
			<Box p="4">
				{vault.tag && (
					<Badge borderRadius="full" my={2} p={1} colorScheme="yellow">
						{vault.tag}
					</Badge>
				)}
				{vault.tag !== 'Coming Soon' ? (
					<Box d="flex" alignItems="center">
						<Image src={vault.tokenIcon} w={5} h={5} borderRadius={2.5} />
						<Box
							color="gray.400"
							fontWeight="semibold"
							letterSpacing="wide"
							fontSize="xs"
							textTransform="uppercase"
							ml="2"
						>
							{vault.wantTokenTicker} &bull; {vault.vaultTokenTicker} &bull;{' '}
							<a target="_blank" rel="noreferrer" href={vault.strategyContract}>
								{vault.strategyName}
							</a>
						</Box>
					</Box>
				) : (
					<Box d="flex" alignItems="center">
						<Image src={vault.tokenIcon} w={5} h={5} borderRadius={2.5} />
						<Box
							color="gray.400"
							fontWeight="semibold"
							letterSpacing="wide"
							fontSize="xs"
							textTransform="uppercase"
							ml="2"
							as="a"
							href="https://discord.com/invite/gp9bsaQ"
							target="_blank"
							rel="noreferrer"
							textDecoration="underline"
						>
							Submit your strategy
						</Box>
					</Box>
				)}

				<Flex mt={1} alignItems="center">
					<Text fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
						{vault.title}
					</Text>
					{vault.tag !== 'Coming Soon' && (
						<Popover>
							<PopoverTrigger>
								<Button ml={4} size="xs">
									<Icon size="xs" as={FaInfo} />
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverCloseButton />
								<PopoverHeader>Vault Summary</PopoverHeader>
								<PopoverBody>
									Deposit {vault.wantTokenTicker}, receive {vault.vaultTokenTicker}, utilising{' '}
									{vault.strategyName}
								</PopoverBody>
							</PopoverContent>
						</Popover>
					)}
				</Flex>

				<Flex alignItems="center" mt={4}>
					<Text fontWeight="bold">{vault.apy}% </Text>

					<Box ml={2} as="span" color="gray.400" fontSize="sm" textTransform="uppercase">
						Unstable APY
					</Box>
				</Flex>
				{vault.tag !== 'Coming Soon' && (
					<Box mt={4}>
						<Link href="/bVaults/[id]" as={`/bVaults/${vault.id}`}>
							<Button colorScheme="blue" size="sm" my={2} w="100%">
								Enter
							</Button>
						</Link>
					</Box>
				)}
			</Box>
		</Box>
	);
};
