import { ethers } from 'ethers'

const abi = [
  'function getDonations(string calldata githubUsername) external view returns (string[] memory projects, uint256[] memory amounts, bool[] memory claimStatus)',
  'function claimDonation(string calldata githubUsername, uint256 donationIndex) external',
]

const distributorAddress = '0xc0C90Da8e7a8c0b6a0Ab3f96d32954CC885bA681'
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz')

export interface Donation {
  project: string
  amount: string
  claimed: boolean
  index: number
}

async function getWalletProvider() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // 请求连接钱包
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (window.ethereum.chainId !== '0x138b') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x138b' }],
        })
      }

      // 获取钱包 provider
      const walletProvider = new ethers.BrowserProvider(window.ethereum)
      const signer = await walletProvider.getSigner()

      return { provider: walletProvider, signer }
    }
    catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }
  throw new Error('Please install MetaMask!')
}

export async function getDonations(githubHandle: string): Promise<Donation[]> {
  const distributor = new ethers.Contract(distributorAddress, abi, provider)

  try {
    const [projects, amounts, claimStatus] = await distributor.getDonations(
      githubHandle,
    )

    return projects.map((project: string, index: number) => ({
      project,
      amount: ethers.formatEther(amounts[index]),
      claimed: claimStatus[index],
      index,
    }))
  }
  catch (error) {
    console.error('Error fetching donations:', error)
    return []
  }
}

export async function claimDonation(githubHandle: string, index: number) {
  const { signer } = await getWalletProvider()
  const distributor = new ethers.Contract(distributorAddress, abi, signer)
  return distributor.claimDonation(githubHandle, index)
}
